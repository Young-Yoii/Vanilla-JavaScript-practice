const main = document.getElementById("main");
const contents = document.getElementById("contents");
const titleInput = document.getElementById("titleInput");
const titleBtn = document.getElementById("titleBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const studetsSeat = document.getElementById("studetsSeat");
const modal = document.getElementById("modal");
const stopBtn = document.getElementById("stopBtn");
const closeBtn = document.querySelector('.close_btn');

import axios from './node_modules/axios/dist/esm/axios.min.js';

const setContents = async() => {
    let shuffling;
    //데이터 받아오기
    const data = await axios.get("./data.json");
    let studentArr = data.data.students;

    //화면에 그리기
    const setView = (studentArr) => {
        studentArr.forEach((student) => studetsSeat.insertAdjacentHTML('beforeend', `<div class="student_seat">${student.name}</div>`))
    }
    
    //데이터 여부에따라 화면에 그리기
    studentArr.length === 0 
    ? studetsSeat.insertAdjacentHTML('beforeend', `<p>학생 리스트가 없어요</p>`)
    : shuffleBtn.style.display = 'block' 
    setView(studentArr)

    //배열 섞기
    const shuffle = () => {
        studentArr = studentArr.map(value => ({...value, sort: Math.random()})).sort((a,b) => a.sort - b.sort);
        studetsSeat.innerHTML = ``;
        setView(studentArr)
    } 

    //섞기 클릭 후 시각적 변화
    shuffleBtn.addEventListener("click", function(){
        shuffling = setInterval(() => shuffle(), 100);
        modal.classList.add("show")
    });

    closeBtn.addEventListener("click", function(){
        modal.classList.remove("show");
        clearInterval(shuffling)
    });
    stopBtn.addEventListener("click", function(){
        modal.classList.remove("show");
        clearInterval(shuffling)
    });
}
setContents()