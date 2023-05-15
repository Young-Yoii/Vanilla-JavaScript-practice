import axios from './node_modules/axios/dist/esm/axios.min.js';
const todoList = document.getElementById("todoList");
const undoList = document.getElementById("undoList");
const havetodoList = document.getElementById("havetodoList");
const todoTit = document.getElementById("todoTit");
const todoCont = document.getElementById("todoCont");
const submitBtn = document.getElementById("submitBtn");
const dateInput = document.querySelectorAll("input[type='date']");
const todoStartDate = document.getElementById("todoStartDate");
const todoEndDate = document.getElementById("todoEndDate");
const setBtn = document.getElementById("setBtn");
const modal = document.getElementById("modal");
const modalWrap = document.getElementById("modalWrap");
const stars = document.querySelectorAll('.star')
const showCompleteTodoBtn = document.getElementById('showCompleteTodoBtn')

const date = new Date().toISOString().slice(0, 10);
let setClick = [true, true, true, false, false];
let rating =  setClick.filter(Boolean).length;
const setView = (setClick) => {
    setClick.forEach((i, index) => i ? stars[index].classList.add("clicked") : stars[index].classList.remove("clicked"));
};
setView(setClick);

dateInput.forEach(item => {item.addEventListener("input", (e) => {
    e.target.dataset.placeholder = e.target.value;
   if(e.target === todoStartDate){
    todoEndDate.setAttribute("min", e.target.value);
    if(e.target.value > todoEndDate.dataset.placeholder){
        todoEndDate.dataset.placeholder = e.target.value;
    }
   }
})});
setBtn.addEventListener("click", () => {
    modal.classList.add("show");
});
const showRating = (rating) => {
    let clickStates = [...setClick];
    return setClick = clickStates.map((i, idx) => clickStates[idx] = idx <= rating-1 ? true : false);
};
const handle = e => {
    const target = e.target;
    let clickStates = [...setClick];
    setClick = clickStates.map((i, idx) => clickStates[idx] = idx <= parseInt(target.dataset.index) ? true : false);
    rating = setClick.filter(Boolean).length;
    setView(setClick);
};

stars.forEach((i) => i.addEventListener('click',handle));


const app = async() => {
    let arr = [];
    const data = await axios.get('http://localhost:3000/todolist');
    arr = data.data.map(item => item);
   
    arr.forEach(item => {
        let content = `
            <div>
                <h4>${item.title}</h4>
                ${item.cont && `<p>${item.cont}</p>`}
            </div>
            <div>
                <div class="todo__btn">
                    <button id="${item.id}" type="button" class="delete-btn">✖️</button>
                    <input type="checkbox" id="${item.id}" class="complete-btn" name="complete">
                    <button id="${item.id}" type="button" class="update-btn">✏️</button>
                </div>
            `
        let rating = '';
        showRating(item.rating).forEach((i, index)=> rating += `<span class=${i && 'clicked'} data-index=${index}>★</span>`);
        if(item.isComplete === false && item.start === date) {
        document.querySelector('.todo__default.today').classList.add('none');
        todoList.insertAdjacentHTML('beforeend', `
            <li>
                ${content}
                <div class="todo__date">~ ${item.end}<span class="todo__date--start-none">${item.start}</span><span class="todo__date--end-none">${item.end}</span></div>
                ${item.rating && `<div id="ratingView" class="todo__rating" value=${item.rating}>${rating}</div>`}
                </div>
            </li>
        `);}
        if(item.isComplete === false && item.end < date) {
        document.querySelector('.todo__default.undo').classList.add('none');
        undoList.insertAdjacentHTML('beforeend', `
            <li>
                ${content}
                <div class="todo__date">~ ${item.end}
                    <span class="todo__date--start-none">${item.start}</span>
                    <span class="todo__date--end-none">${item.end}</span>
                </div>
                <div id="ratingView" class="todo__rating--none" value=${item.rating}>${rating}</div>
                </div>
            </li>
        `);}
        if(item.isComplete === false && item.start > date){
            document.querySelector('.todo__default.havetodo').classList.add('none');
        havetodoList.insertAdjacentHTML('beforeend', `
            <li>
                ${content}
                <div class="todo__date">${item.start} ~
                    <span class="todo__date--start-none">${item.start}</span>
                    <span class="todo__date--end-none">${item.end}</span>
                </div>
                <div id="ratingView" class="todo__rating--none" value=${item.rating}>${rating}</div>
                </div>
            </li>
        `)}
    });

    showCompleteTodoBtn.addEventListener("click", () => {
        modalWrap.textContent = '';
        arr.forEach(item => item.isComplete && modalWrap.insertAdjacentHTML('beforeend', `
            <div class="complete-todo">
                <h4>${item.title}</h4>
                <p>${item.start} ~ ${item.end}</p>
                <button id="${item.id}" type="button" class="delete-btn">✖️</button>
            </div>
        `))
        modal.classList.add("show");

        document.querySelectorAll(".delete-btn").forEach(item => item.addEventListener("click", async(e) => {
            e.preventDefault();
            const target = parseInt(e.target.id);
            axios.delete(`http://localhost:3000/todolist/${target}`, {
                data: {
                  id: target,
                  },
               })
        }));
    })

    const $deleteBtn = document.querySelectorAll(".delete-btn");
    const $completeBtn = document.querySelectorAll(".complete-btn");
    const $updateBtn = document.querySelectorAll(".update-btn");
    
    $deleteBtn.forEach(item => item.addEventListener("click", async(e) => {
        const target = parseInt(e.target.id);
        axios.delete(`http://localhost:3000/todolist/${target}`, {
            data: {
              id: target,
              },
           })
    }));
    $completeBtn.forEach(item => item.addEventListener("click", async(e) => {
        const target = parseInt(e.target.id);
        axios.patch(`http://localhost:3000/todolist/${target}`, {"isComplete": true})
    }));
    $updateBtn.forEach(item => item.addEventListener("click", async(e) => {
        const targetId = parseInt(e.target.id);
        const targetClosest = e.target.closest('li');
        submitBtn.innerHTML = "수정하기";
        submitBtn.setAttribute("value", targetId);

        // 모달창 값 넣어주기(조금 더 효율적인 방법 고안해보기)
        todoTit.value = targetClosest.querySelector('h4').textContent;
        targetClosest.querySelector('p') ? todoCont.value = targetClosest.querySelector('p').textContent : todoCont.value="";
        todoStartDate.dataset.placeholder = targetClosest.querySelector('.todo__date--start-none').textContent;
        todoEndDate.dataset.placeholder = targetClosest.querySelector('.todo__date--end-none').textContent;
        const rating = targetClosest.querySelector('#ratingView').getAttribute('value');
        showRating(rating);
        setView(setClick);

        modal.classList.add("show");
    }));
    
};

const postData = async(e) => {
   const title = todoTit.value;
   const cont = todoCont.value;
   const start = todoStartDate.dataset.placeholder;
   const end = todoEndDate.dataset.placeholder;
   const target = parseInt(e.target.value);
    
   if(title === '' || start === '' || end === '') {
        if(title === '') {alert("제목을 입력해주세요"); todoTit.focus();}
        else if(start === '') {alert("시작 날짜를 입력해주세요"); todoStartDate.focus();}
        else {alert("종료날짜를 입력해주세요"); todoEndDate.focus();}
    return;
   };

  if(!target){
    axios.post(`http://localhost:3000/todolist`, {title, cont, start, end, "isComplete": false, rating});
  }
  else {
    axios.patch(`http://localhost:3000/todolist/${target}`, {title, cont, start, end, "isComplete": false, rating});
   }
};
submitBtn.addEventListener("click", postData);

app();