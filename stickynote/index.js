const container = document.getElementById('container');
const addMemoBtn = document.getElementById('addMemoBtn');

let arr = [];
const init = () => {
let obj = {"text": "", "width": "300px", "height": "200px"}
const addMemo = () => {
    const memo = document.createElement('div');
    memo.setAttribute('id', 'memo');
    memo.setAttribute('class', 'memo');
    const extendBtn = document.createElement('div');
    extendBtn.setAttribute('id', 'extendBtn');
    extendBtn.setAttribute('class', 'memo__extend');
    let str = `
        <div class="" id="memoContainer">
            <div id="memoHeader" class="memo__header">
                <h4>메모</h4>
                <div class="memo__btn">
                    <button id="fullScreenBtn" class="memo__btn--fullscreen">최대화</button>
                    <button id="deleteBtn" class="memo__btn--del">지우기</button>
                </div>
            </div>
            <div id="memoContainer" class="memo__container">
                <textarea id="memoText" placeholder="내용을 입력하세요" class="memo__text"></textarea>
                <div id="memoOption" class=memo__container--option"></div>
            </div>
        </div>  
    `
    memo.innerHTML = str;
    container.appendChild(memo);
    memo.appendChild(extendBtn);
    positionSticky(memo);
    
    
    const allExtendBtn = document.querySelectorAll("#extendBtn");
    const allMemo = document.querySelectorAll("#memoHeader");
    extendMemo(allExtendBtn);
    dragMemo(allMemo);
}
let l = 0;
let i = 0;

const positionSticky = (memo) => {
    if(container.innderHTML = ""){
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
    }else {
        memo.style.left = l + 15 + 'px';
        memo.style.top = i + 15  + 'px';
    }
    l = 15 +  memo.clientX;
    i = 15;
    
}

let dragTarget;
let isDragging = false;
let isExtending = false;
let lastOffsetX = 0;
let lastOffsetY = 0;
let DEFAULT_W = 300;
let DEFAULT_H = 200;

const extendMemo = (extendBtn) => {
    extendBtn.forEach(item => item.addEventListener("mousedown", (e) => {
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
            }
            return;
        }

        const mouseUpHandler = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            isExtending = true;
            isDragging = false;
            document.body.style.cursor = "default";
          };
    
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler, { once: true });
    }));
}

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

addMemoBtn.addEventListener("click", addMemo);
console.log(obj)
}
init()