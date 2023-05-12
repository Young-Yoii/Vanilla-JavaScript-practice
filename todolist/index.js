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
const ratingBox = document.getElementById("ratingBox");
const stars = document.querySelectorAll('.star')

const date = new Date().toISOString().slice(0, 10);
let setClick = [true, true, true, false, false];
let rating =  setClick.filter(Boolean).length;
const setView = (setClick) => {
    setClick.forEach((i, index) => i ? stars[index].classList.add("clicked") : stars[index].classList.remove("clicked"));
};
setView(setClick)
dateInput.forEach(item => {
    item.addEventListener("input", (e) => {
        e.target.setAttribute("value", e.target.value);
        e.target.classList.remove("date");
        e.target === todoStartDate && todoEndDate.setAttribute("min", e.target.value);
    })
})
setBtn.addEventListener("click", () => {
    modal.classList.add("show")
})
const showRating = (rating) => {
    let clickStates = [...setClick];
    return setClick = clickStates.map((i, idx) => clickStates[idx] = idx <= rating-1 ? true : false);
}
const handle = e => {
    const target = e.target;
    let clickStates = [...setClick];
    setClick = clickStates.map((i, idx) => clickStates[idx] = idx <= parseInt(target.dataset.index) ? true : false);
    rating = setClick.filter(Boolean).length;
    console.log(setClick, target.dataset.index, setClick[parseInt(target.dataset.index)], stars[parseInt(target.dataset.index)]);
    setView(setClick);
}

stars.forEach((i) => {i.addEventListener('click', (e) => {handle(e)})})


const app = async() => {
    let arr = [];
    const data = await axios.get('http://localhost:3000/todolist');
    arr = data.data.map(item => item);
   
    arr.forEach(item => {
        let content = `
            <div class="tit">
                <h4>${item.title}</h4>
                <input type="text" id="titInput" value="${item.title}" class="tit-input">
                ${item.cont && `<p>${item.cont}</p>`}
                <input type="text" id="contInput" value="${item.cont}" class="cont-input">
            </div>
            <div>
                <div class="btn">
                    <button id="${item.id}" type="button" class="delete-btn">✖️</button>
                    <input type="checkbox" id="${item.id}" class="complete-btn" name="complete">
                    <button id="${item.id}" type="button" class="update-btn">✏️</button>
                </div>
            `
        let rating = '';
        showRating(item.rating).forEach((i, index)=> rating += `<span class=${i && 'clicked'} data-index=${index}>★</span>`)
        item.isComplete === false && item.start === date &&
        todoList.insertAdjacentHTML('beforeend', `
            <li>
                ${content}
                <div class="date">~ ${item.end}</div>
                ${item.rating && `<div id="ratingView" class="rating-view" value=${item.id}>${rating}</div>`}
                </div>
            </li>
        `)
        
        item.isComplete === false && item.end < date &&
        undoList.insertAdjacentHTML('beforeend', `
            <li>
                ${content}
                <div class="date">~ ${item.end}</div>
                </div>
            </li>
        `)
        item.isComplete === false && item.start > date &&
        havetodoList.insertAdjacentHTML('beforeend', `
            <li>
                ${content}
                <div class="date">${item.start} ~</div>
                </div>
            </li>
        `)
    });
    const $deleteBtn = document.querySelectorAll(".delete-btn");
    const $completeBtn = document.querySelectorAll(".complete-btn");
    const $updateBtn = document.querySelectorAll(".update-btn");


    
    $deleteBtn.forEach(item => {item.addEventListener("click", async(e) => {
        const target = parseInt(e.target.id);
        axios.delete(`http://localhost:3000/todolist/${target}`, {
            data: {
              id: target,
              },
           })
    })})
    $completeBtn.forEach(item => {item.addEventListener("click", async(e) => {
        const target = parseInt(e.target.id);
        axios.patch(`http://localhost:3000/todolist/${target}`, {"isComplete": true})
    })})
    
}


const postData = async() => {
   const title = todoTit.value;
   const cont = todoCont.value;
   const start = todoStartDate.value;
   const end = todoEndDate.value;

   if(title === '' || start === '' || end === '') {
        if(title === '') {alert("제목을 입력해주세요"); todoTit.focus();}
        else if(start === '') {alert("시작 날짜를 입력해주세요"); todoStartDate.focus();}
        else {alert("종료날짜를 입력해주세요"); todoEndDate.focus();}
    return;
   }

    axios.post(`http://localhost:3000/todolist`, {title, cont, start, end, "isComplete": false, rating})
}
submitBtn.addEventListener("click", postData)

app()