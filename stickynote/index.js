const container = document.getElementById('container');
const addMemoBtn = document.getElementById('addMemoBtn');

let arr = [];
let optionArr = ['#FFF8D1', '#FFDBAB', '#FDD4E2', '#D8DBFF', '#b2ddff', '#b3ece6']
const addMemo = () => {
    const memo = document.createElement('div');
    memo.setAttribute('id', 'memo');
    memo.setAttribute('class', 'memo');
    const extendBtn = document.createElement('div');
    extendBtn.setAttribute('id', 'extendBtn');
    extendBtn.setAttribute('class', 'memo__extend');
    let optionStr= '';
    optionArr.forEach((option,index) => optionStr += `<label id="colorLable" class="color-item__${index+1}"><input type="radio" value=${option} name="bg-color"><span class="checkmaker">
    </span></label>`);
    let basicStr = `
        <div class="memo__container" id="memoContainer">
            <div id="memoHeader" class="memo__header">
                <h4>📝메모</h4>
                <div class="memo__btn">
                    <button id="fullScreenBtn" class="memo__btn--fullscreen">🖥️</button>
                    <button id="deleteBtn" class="memo__btn--del">❌</button>
                </div>
            </div>
            <div id="memoBody" class="memo__body">
                <textarea id="memoText" placeholder="내용을 입력하세요" class="memo__text"></textarea>
                <div id="memoOption" class="memo__container--option">
                    <div id="memoFontDrop" class="memo__font">
                        <button id="fontBtn" class="font-btn">40px</button>
                        <ul id="dropMenu" class="drop-menu">
                            <li class="drop-item">20px</li>
                            <li class="drop-item">30px</li>
                            <li class="drop-item">35px</li>
                            <li class="drop-item">40px</li>
                            <li class="drop-item">45px</li>
                            <li class="drop-item">50px</li>
                            <li class="drop-item">55px</li>
                        </ul>
                    </div>
                   <div class="memo__color">${optionStr}</div>
                </div>
            </div>
        </div>  
    `
    
    memo.innerHTML = basicStr;
    container.appendChild(memo);
    memo.appendChild(extendBtn);
    positionSticky(memo);
    
    const allExtendBtn = document.querySelectorAll("#extendBtn");
    const allMemo = document.querySelectorAll("#memoHeader");
    extendMemo(allExtendBtn);
    dragMemo(allMemo);
}

const positionSticky = (memo) => {
      memo.style.left =
      window.innerWidth / 2 -
      memo.clientWidth / 2 +
      (-100 + Math.round(Math.random() * 50)) +
      'px';
    memo.style.top =
      window.innerHeight / 2 -
      memo.clientHeight / 2 +
      (-100 + Math.round(Math.random() * 50)) +
      'px'; 
    memo.style.width = '500px';
    memo.style.height = '300px'; 
}

let dragTarget;
let isDragging = false;
let isExtending = false;
let lastOffsetX = 0;
let lastOffsetY = 0;
let DEFAULT_W = 300;
let DEFAULT_H = 200;

//사이즈 조절
const extendMemo = (extendBtn) => {
    extendBtn.forEach(item => {
        item.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        isExtending = true;
        let prevX = e.screenX;
        let prevY = e.screenY;  
        DEFAULT_W = e.target.parentNode.clientWidth; 
        DEFAULT_H  = e.target.parentNode.clientHeight; 
        
        const mouseMoveHandler = (e) => {
            const X = e.screenX - prevX - 40;
            const Y = e.screenY - prevY - 40;
            if(isExtending){
                document.body.style.cursor = "nw-resize";
                item.parentNode.style.width = DEFAULT_W + X + "px";
                item.parentNode.style.height = DEFAULT_H + Y + "px";
                item.parentNode.style.draggable ="false"
                e.target.classList.add("show");
            }
            return;
        };

        const mouseUpHandler = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            isExtending = true;
            isDragging = false;
            document.body.style.cursor = "default";
            e.target.classList.remove("show");
          };
    
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler, { once: true });
    })}
)};

//드래그앤드롭
const dragMemo = (allMemo) => {
    allMemo.forEach(item => item.addEventListener('mousedown', e => {
        dragTarget = item.parentNode.parentNode;
        lastOffsetX = e.offsetX;
        lastOffsetY = e.offsetY;
        isDragging = true;
        const drag = (e) => {
            e.preventDefault();
            if (!isDragging) return;
            dragTarget.style.left = e.clientX - lastOffsetX - 20 + 'px';
            dragTarget.style.top = e.clientY - lastOffsetY - 20 + 'px';
        }
        container.addEventListener('mousemove', drag);
        container.addEventListener('mouseup', () => isDragging = false);
    }));
}

const data = (text, height, width) => {
    let obj = {
        "text": text,
        "height" : height,
        "width": width
    }
    arr.push(obj)
    console.log(arr)
}

addMemoBtn.addEventListener("click", addMemo);
// forEach 메모리 낭비 ==> 이벤트 위임방식으로 변경
container.addEventListener("click", (e) => {
    const target = e.target;
    const div = e.target.closest('div');
    const memo = e.target.closest("#memo");
    console.log(e.target)
    // 폰트 사이즈 적용
    if(target.className === 'font-btn'){
        target.nextElementSibling.classList.toggle("active")
    }
    if(target.className === 'drop-item'){
        const fontSize = target.textContent;
        div.firstElementChild.textContent = fontSize;
        div.parentNode.previousElementSibling.style.fontSize = fontSize;
    }
    // 최대화
    if(target.className === 'memo__btn--fullscreen'){
        const attrArr = [
            {key: 'width',val: memo.style.width},
            {key: 'height', val: memo.style.height},
            {key: 'top', val: memo.style.top},
            {key: 'left', val: memo.style.left}
        ]
        if(memo.style.width !== '100%'){
            container.style.height = '100%';
            attrArr.forEach(attr => {
                memo.setAttribute(`data-${attr.key}`, attr.val.slice(0,3));
            })
            memo.style = 'width: 100%;height: 100%;top: 0%;left: 0%;z-index: 999';
            container.querySelector('#extendBtn').style.display = "none";
            target.innerHTML = "💻";
        }else{
            container.style.height = '92%';
            memo.style.width = `${memo.getAttribute('data-width')}px`;
            memo.style.height = `${memo.getAttribute('data-height')}px`;
            memo.style.top = `${memo.getAttribute('data-top')}px`;
            memo.style.left = `${memo.getAttribute('data-left')}px`;
            memo.style.zIndex = '';
            container.querySelector('#extendBtn').style.display = "block";
            target.innerHTML = "🖥️";
        }
    }
    if(target.getAttribute('id') === 'colorLable' || target.className === 'checkmaker'){
        let value;
        target.getAttribute('id') === 'colorLable' ? value = target.firstElementChild.value : value = target.previousElementSibling.value;
        div.parentNode.previousElementSibling.style.background = value;
    }
    if(target.className === 'memo__btn--del'){
        memo.remove();
    }
})