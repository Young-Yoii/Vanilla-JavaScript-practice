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
        <div class="memo__container" id="memoContainer">
            <div id="memoHeader" class="memo__header">
                <h4>메모</h4>
                <div class="memo__btn">
                    <button id="fullScreenBtn" class="memo__btn--fullscreen">최대화</button>
                    <button id="deleteBtn" class="memo__btn--del">지우기</button>
                </div>
            </div>
            <div id="memoBody" class="memo__body">
                <textarea id="memoText" placeholder="내용을 입력하세요" class="memo__text"></textarea>
                <div id="memoOption" class="memo__container--option">
                    <div id="memoFontDrop" class="memo__font">
                        <button id="fontBtn" class="font-btn">40px</button>
                        <ul id="dropMenu" class="drop-menu">
                            <li>20px</li>
                            <li>30px</li>
                            <li>35px</li>
                            <li>40px</li>
                            <li>45px</li>
                            <li>50px</li>
                            <li>55px</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>  
    `
    memo.innerHTML = str;
    container.appendChild(memo);
    memo.appendChild(extendBtn);
    positionSticky(memo);
    
    document.getElementById("fontBtn").addEventListener("click", () => {
        document.getElementById("dropMenu").classList.toggle("active");
    })
    document.querySelectorAll("#dropMenu > li").forEach(el => el.addEventListener("click", (e) =>{
        console.log(e.target.textContent)
    }))
    
    const allExtendBtn = document.querySelectorAll("#extendBtn");
    const allMemo = document.querySelectorAll("#memoHeader");
    const fullScreenBtn = document.querySelectorAll("#fullScreenBtn");
    extendMemo(allExtendBtn);
    dragMemo(allMemo);
    fullscreen(fullScreenBtn, extendBtn)
}

const fullscreen = (fullScreenBtn, extendBtn) => {
    fullScreenBtn.forEach(item => item.addEventListener("click", (e) => {
        const target = e.target.closest("#memo");
        if(target.style.width !== '100%'){
            container.style.height = '100%';
            target.setAttribute('data-width', target.style.width.slice(0,3));
            target.setAttribute('data-height', target.style.height.slice(0,3));
            target.setAttribute('data-top', target.style.top.slice(0,3));
            target.setAttribute('data-left', target.style.left.slice(0,3));
            target.style.left = '0';
            target.style.top = '0';
            target.style.width = '100%';
            target.style.height = '100%';
            extendBtn.style.display = "none";
            e.target.innerHTML = "원래 크기로"  
        }else{
            container.style.height = '92%';
            target.style.width = target.getAttribute('data-width') + "px";
            target.style.height = target.getAttribute('data-height') + "px";
            target.style.top = target.getAttribute('data-top') + "px";
            target.style.left = target.getAttribute('data-left') + "px";
            extendBtn.style.display = "block";
            e.target.innerHTML = "최대화";
        }
    }))
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
    memo.style.width = '300px';
    memo.style.height = '200px'; 
}

let dragTarget;
let isDragging = false;
let isExtending = false;
let lastOffsetX = 0;
let lastOffsetY = 0;
let DEFAULT_W = 300;
let DEFAULT_H = 200;

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
        }

        const mouseUpHandler = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            isExtending = true;
            isDragging = false;
            document.body.style.cursor = "default";
            e.target.classList.remove("show");
          };
    
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler, { once: true });
    })
     // item.addEventListener("mouseleave", (e) => e.target.classList.remove("show"))
    }
)}

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
console.log(arr)
}
init()