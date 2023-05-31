const container = document.getElementById('container');
const addMemoBtn = document.getElementById('addMemoBtn');

const localData = localStorage.getItem('memo');
let arr =  JSON.parse(localData) ? JSON.parse(localData) : [];

const addMemo = () => {
    let optionArr = [{
        color: ['#fff8d1', '#ffdbab', '#fdd4e2', '#d8d8ff', '#b2ddff', '#b3ece6'] , 
        fontSize: ['20px', '30px', '35px', '40px', '45px', '50px', '55px', '60px', '70px']
    }];
    let flag = arr.length <= container.childElementCount ? false : true;
    
    const setStr =(i, idx) => {
        let colorOptionStr= '';
        let fontOptionStr= '';
        (optionArr[0].color).forEach((option,index) => colorOptionStr += 
        `<label id="colorLable" class="color-item__${index+1}">
            <input type="radio" value=${option} name="bg-color${idx}" ${(i.backgroundColor === 'rgb(255, 248, 209)' ? i.backgroundColor = '#fff8d1' : i.backgroundColor || '#fff8d1') === option && 'checked = true'}>
            <span class="checkmaker"></span>
        </label>`); 
        (optionArr[0].fontSize).forEach(option => fontOptionStr += 
        `<li class="drop-item">${option}</li>`);
        let topStr = `
            <div class="memo__container" id="memoContainer">
                <div id="memoHeader" class="memo__header">
                    <h4>📝메모</h4>
                    <div class="memo__btn">
                        <button id="fullScreenBtn" class="memo__btn--fullscreen">🖥️</button>
                        <button id="deleteBtn" class="memo__btn--del">❌</button>
                    </div>
                </div>
                <div id="memoBody" class="memo__body">
                    <textarea id="memoText" placeholder="내용을 입력하세요" class="memo__text" style="background: ${i.backgroundColor || '#fff8d1'};font-size: ${i.fontSize || '40px'};">${i.content || ''}</textarea>
                    <div id="memoOption" class="memo__container--option">
                        <div id="memoFontDrop" class="memo__font">
                            <button id="fontBtn" class="font-btn">${i.fontSize || '40px'}</button>
                            <ul id="dropMenu" class="drop-menu">${fontOptionStr}</ul>
                        </div>
                        <div class="memo__color">`
        let bottomStr =  `${colorOptionStr}
                        </div>
                    </div>
                </div>
            </div>  
            <div id="extendBtn" class="memo__extend"></div>`;
        return topStr + bottomStr;
    };
    
    if(flag){
        // 메모 데이터가 있을 때
        arr.forEach((i, idx) => container.insertAdjacentHTML('beforeend',  `
            <div id="memo" class="memo" style="width: ${i.width};height: ${i.height};top: ${i.top};left: ${i.left};" data-id=${i.id}>
                ${setStr(i, idx)}
            </div>`));
    }else{
        const idx = document.querySelectorAll('#memo').length;
        const memo = document.createElement('div');
        memo.setAttribute('id', 'memo');
        memo.setAttribute('class', 'memo');
        memo.setAttribute('data-id', idx);
        positionSticky(memo);
        memo.innerHTML = setStr('#fff8d1', idx);
        container.append(memo);
    };
    
    // 메모 불러왔을때의 폰트사이즈 세팅
    const allFontSize = document.querySelectorAll('.drop-item');
    allFontSize.forEach(fontEl => fontEl.parentNode.previousElementSibling.textContent === fontEl.textContent && fontEl.classList.add('selected'));
};

const positionSticky = (memo) => {
    memo.style.width = '500px';
    memo.style.height = '300px';
    memo.style.top =
      window.innerHeight / 2 -
      memo.clientHeight / 2 +
      (-100 + Math.round(Math.random() * 50)) +
      'px'; 
    memo.style.left =
      window.innerWidth / 2 -
      memo.clientWidth / 2 +
      (-100 + Math.round(Math.random() * 50)) +
      'px';
};

let dragTarget;
let isDragging = false;
let isExtending = false;
let lastOffsetX = 0;
let lastOffsetY = 0;
let DEFAULT_W = 300;
let DEFAULT_H = 200;

// 이벤트 리스너
addMemoBtn.addEventListener("click", addMemo);
/// forEach 메모리 낭비방지 ==> 이벤트 위임방식으로 변경
container.addEventListener("click", (e) => {
    let target = e.target;
    const memo = e.target.closest("#memo");
    // 메모 내용
    if(target.className === 'memo__text'){
        const find = arr.findIndex(item => item.id === Number(memo.getAttribute('data-id')));
        target.addEventListener("change", () => {
            let flag = arr.length >= container.childElementCount ? true : false;
            if(flag){
                arr[find].content = target.value;
            }else{
                let data = {
                'id': arr.length,
                'content': target.value, 
                'width': memo.style.width, 
                'height': memo.style.top, 
                'top':  memo.style.top, 
                'left':  memo.style.left, 
                'fontSize': target.style.fontSize, 
                'backgroundColor': target.style.background
                };
                arr.push(data);
            }
            localStorage.setItem('memo',JSON.stringify(arr));
        });
    };
    if(target.className === 'font-btn'){
        target.nextElementSibling.classList.toggle("active");
    };
    // 폰트 사이즈 적용
    if(target.className === 'drop-item'){
        const find = arr.findIndex(item => item.id === Number(memo.getAttribute('data-id')));
        const idx = Array.from(document.querySelectorAll('#memo')).indexOf(memo);
        let beforeSelected = document.getElementsByClassName('selected')[idx];
        if(beforeSelected && beforeSelected !== target){
            beforeSelected.classList.remove('selected');
        }
        target.classList.toggle("selected");
        const fontSize = target.textContent;
        memo.querySelector('.font-btn').textContent = fontSize;
        memo.querySelector('.memo__text').style.fontSize = fontSize;
        arr[find].fontSize = fontSize;
        localStorage.setItem('memo',JSON.stringify(arr));
    };
    // 최대화
    if(target.className === 'memo__btn--fullscreen'){
        const find = arr.findIndex(item => item.id === Number(memo.getAttribute('data-id')));
        let str = '';
        const attrArr = [
            {key: 'width',val: memo.style.width, fullVal: '100%'},
            {key: 'height', val: memo.style.height, fullVal: '100%'},
            {key: 'top', val: memo.style.top, fullVal: '0%'},
            {key: 'left', val: memo.style.left, fullVal: '0%'},
            {key: 'z-index', val: 0, fullVal: '999'},
        ];
        if(container.style.height !== '100%'){
            container.style.height = '100%';
            attrArr.forEach(attr => {
                memo.setAttribute(`data-${attr.key}`, attr.val);
                str += `${attr.key}: ${attr.fullVal};`;
                memo.style = `${str}`;
            });
            container.querySelector('#extendBtn').style.display = "none";
            target.innerHTML = "💻";
        }else{
            container.style.height = '88%';
            attrArr.forEach(attr => {
                str += `${attr.key}: ${memo.getAttribute(`data-${attr.key}`)};`;
                memo.style = `${str}`;
            })
            container.querySelector('#extendBtn').style.display = "block";
            target.innerHTML = "🖥️";
            arr[find].top = memo.style.top;
            arr[find].left = memo.style.left;
            localStorage.setItem('memo',JSON.stringify(arr));
        }
    };
    // 배경색
    if(target.getAttribute('id') === 'colorLable' || target.className === 'checkmaker'){
        const find = arr.findIndex(item => item.id === Number(memo.getAttribute('data-id')));
        target.className === 'checkmaker' ? target = target.parentNode : target;
        memo.querySelector('.memo__text').style.backgroundColor = target.querySelector('input').value;
        arr[find].backgroundColor = target.querySelector('input').value;
        localStorage.setItem('memo',JSON.stringify(arr));
    };
    // 삭제
    if(target.className === 'memo__btn--del'){
        memo.remove();
        arr = arr.filter(item => item.id !== Number(memo.getAttribute('data-id')));
        arr.forEach((i,idx) => i.id = idx);
        localStorage.setItem('memo',JSON.stringify(arr));
    };
})
container.addEventListener("mousedown", (e) => {
    const memo = e.target.closest("#memo");
    let target = e.target;
    // 드래그앤드롭
    if(target.className === 'memo__header'){
        const find = arr.findIndex(item => item.id === Number(memo.getAttribute('data-id')));
        isDragging = true;
        dragTarget = target.parentNode.parentNode;
        lastOffsetX = e.offsetX;
        lastOffsetY = e.offsetY;
        const drag = (e) => {
            e.preventDefault();
            if (!isDragging) return;
            dragTarget.style.left = e.clientX - lastOffsetX - 20 + 'px';
            dragTarget.style.top = e.clientY - lastOffsetY - 20 + 'px';
        }
        container.addEventListener('mousemove', drag);
        container.addEventListener('mouseup', () => {
            isDragging = false;
            arr[find].left = memo.style.left;
            arr[find].top = memo.style.top;
            localStorage.setItem('memo',JSON.stringify(arr));
        });
    }
    // 사이즈변경
    if(target.className === 'memo__extend'){
        const find = arr.findIndex(item => item.id === Number(memo.getAttribute('data-id')));
        isExtending = true;
        let prevX = e.screenX;
        let prevY = e.screenY;  
        DEFAULT_W = target.parentNode.clientWidth; 
        DEFAULT_H  = target.parentNode.clientHeight; 
        const mouseMoveHandler = (e) => {
            const X = e.screenX - prevX - 40;
            const Y = e.screenY - prevY - 40;
            if(isExtending){
                document.body.style.cursor = "nw-resize";
                target.classList.add("show");
                memo.style.width = `${DEFAULT_W + X}px`;
                memo.style.height = `${DEFAULT_H + Y}px`;
                memo.style.draggable ="false"
            }
            return;
        };
        const mouseUpHandler = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            isExtending = true;
            isDragging = false;
            document.body.style.cursor = "default";
            target.classList.remove("show");
            arr[find].width = memo.style.width;
            arr[find].height = memo.style.height;
            localStorage.setItem('memo',JSON.stringify(arr));
          };
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler, { once: true });
    }
})
container.addEventListener('mouseover', (e) => {
    const target = e.target.className;
    if(target === 'memo__header' || target === 'memo__text'){
      e.target.closest('.memo__container').parentNode.querySelector('.memo__extend').classList.add('show');
    }
    return;
})
container.addEventListener('mouseout', (e) => {
    const target = e.target.className;
    if(target === 'memo__header' || target === 'memo__text'){
      e.target.closest('.memo__container').parentNode.querySelector('.memo__extend').classList.remove('show');
    }
    return;
})

/*==================
memo 개수 변경 감지
====================*/
// 변경을 감지할 노드 선택
const targetNode = document.getElementById("container");

// 감지 옵션 (감지할 변경)
const config = { attributes: false, childList: true, subtree: false };

// 변경 감지 시 실행할 콜백 함수
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
   if(mutation.type === "childList") {
        document.querySelectorAll('#memo').forEach((i,idx) => i.setAttribute('data-id', idx));
    }
  }
};

// 콜백 함수에 연결된 감지기 인스턴스 생성
const observer = new MutationObserver(callback);

// 설정한 변경의 감지 시작
observer.observe(targetNode, config);