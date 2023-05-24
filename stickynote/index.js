const container = document.getElementById('container');
const addMemoBtn = document.getElementById('addMemoBtn');

let optionArr = [{color: ['#FFF8D1', '#FFDBAB', '#FDD4E2', '#D8DBFF', '#b2ddff', '#b3ece6'] , 
                  fontSize: ['20px', '30px', '35px', '40px', '45px', '50px', '55px']}]
const render = () => {
const localData = localStorage.getItem('memo');
let arr =  JSON.parse(localData) ? JSON.parse(localData) : [];

const addMemo = () => {
    let colorOptionStr= '';
    let fontOptionStr= '';
    let flag = arr.length <= container.childElementCount ? false : true;
    (optionArr[0].color).forEach((option,index) => colorOptionStr += 
    `<label id="colorLable" class="color-item__${index+1}">
        <input type="radio" value=${option} name="bg-color">
        <span class="checkmaker"></span>
    </label>`);
    (optionArr[0].fontSize).forEach(option => fontOptionStr += 
    `<li class="drop-item">${option}</li>`);
    let containStr = `
    <div class="memo__container" id="memoContainer">
        <div id="memoHeader" class="memo__header">
            <h4>📝메모</h4>
            <div class="memo__btn">
                <button id="fullScreenBtn" class="memo__btn--fullscreen">🖥️</button>
                <button id="deleteBtn" class="memo__btn--del">❌</button>
            </div>
        </div>
    <div id="memoBody" class="memo__body">`
    let bodyStr = `<ul id="dropMenu" class="drop-menu">${fontOptionStr}</ul>
        </div>
        <div class="memo__color">${colorOptionStr}</div>
    </div></div></div>  
    <div id="extendBtn" class="memo__extend"></div>`
    if(flag) {
        arr.forEach(i => container.insertAdjacentHTML('beforeend',  `
        <div id="memo" class="memo" style="width: ${i.width}; height: ${i.height}; top: ${i.top}; left:${i.left};">
            ${containStr}
                <textarea id="memoText" placeholder="내용을 입력하세요" class="memo__text" style="background: ${i.backgroundColor};font-size: ${i.fontSize};">${i.content}</textarea>
                <div id="memoOption" class="memo__container--option">
                    <div id="memoFontDrop" class="memo__font">
                        <button id="fontBtn" class="font-btn">${i.fontSize}</button>
                    ${bodyStr}
        </div>`));
    }else {
        const memo = document.createElement('div');
        memo.setAttribute('id', 'memo');
        memo.setAttribute('class', 'memo');
        let str = `
            ${containStr}
             <textarea id="memoText" placeholder="내용을 입력하세요" class="memo__text" style="background: #FFF8D1;font-size: 40px;"></textarea>
             <div id="memoOption" class="memo__container--option">
                <div id="memoFontDrop" class="memo__font">
                    <button id="fontBtn" class="font-btn">40px</button>
                    ${bodyStr}
        `
        memo.innerHTML = str;
        container.append(memo);
        positionSticky(memo);
    };

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
        const memo = e.target.closest("#memo");
        const find = arr.findIndex(item => item.content === memo.querySelector('.memo__text').value);
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
            arr[find].width = memo.style.width;
            arr[find].height = memo.style.height;
            localStorage.setItem('memo',JSON.stringify(arr));
          };
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler, { once: true });
    })}
)};

//드래그앤드롭
const dragMemo = (allMemo) => {
    allMemo.forEach(item => item.addEventListener('mousedown', e => {
        const memo = e.target.closest("#memo");
        const find = arr.findIndex(item => item.content === memo.querySelector('.memo__text').value);
        console.log(find, memo,dragTarget)
        lastOffsetX = e.offsetX;
        lastOffsetY = e.offsetY;
        isDragging = true;
        const drag = (e) => {
            e.preventDefault();
            if (!isDragging) return;
            memo.style.left = e.clientX - lastOffsetX - 20 + 'px';
            memo.style.top = e.clientY - lastOffsetY - 20 + 'px';
        }
        container.addEventListener('mousemove', drag);
        container.addEventListener('mouseup', () => {
            isDragging = false;
            arr[find].left = memo.style.left;
            arr[find].top = memo.style.top;
            localStorage.setItem('memo',JSON.stringify(arr));
        });
    }));
}

addMemoBtn.addEventListener("click", addMemo);
/// forEach 메모리 낭비 ==> 이벤트 위임방식으로 변경
container.addEventListener("click", (e) => {
    let target = e.target;
    if(target.className === 'container' && target.className === 'memo__extend' ){return;}
    const memo = e.target.closest("#memo");
    const find = arr.findIndex(item => item.content === memo.querySelector('.memo__text').value);
    if(find === -1) return;
    // 메모 내용
    if(target.className === 'memo__text'){
        target.addEventListener("change", (e) => {
            let flag = arr.length >= container.childElementCount ? true : false;
            //내용 업데이트
            if(flag){
                let value = ''
                value = target.value;
                arr[find].content = value;
            }else{ //새 데이터 추가
                let data = {'content': target.value, 
                'width': memo.style.width, 
                'height': memo.style.top, 
                'top':  memo.style.top, 
                'left':  memo.style.left, 
                'fontSize': target.style.fontSize, 
                'backgroundColor': target.style.background}
                arr.push(data);
            }
            localStorage.setItem('memo',JSON.stringify(arr))
        })
    }
    // 폰트 사이즈 적용
    if(target.className === 'font-btn'){
        target.nextElementSibling.classList.toggle("active")
    }
    if(target.className === 'drop-item'){
        const fontSize = target.textContent;
        memo.querySelector('.font-btn').textContent = fontSize;
        memo.querySelector('.memo__text').style.fontSize = fontSize;
        arr[find].fontSize = target.textContent;
        localStorage.setItem('memo',JSON.stringify(arr));
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
        target.className === 'checkmaker' ? target = target.parentNode : target
        memo.querySelector('.memo__text').style.background = target.firstElementChild.value;
        arr[find].backgroundColor = target.firstElementChild.value;
        localStorage.setItem('memo',JSON.stringify(arr));
    }
    //삭제
    if(target.className === 'memo__btn--del'){
        memo.remove();
        const filter = arr.filter(item => item.content !== memo.querySelector('.memo__text').value);
        arr = filter;
        localStorage.setItem('memo',JSON.stringify(arr))
    }
    return;
})}
render();