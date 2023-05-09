import axios from './node_modules/axios/dist/esm/axios.min.js';

const titleInput = document.getElementById("titleInput");
const titleText = document.getElementById("titleText");
const titleBtn = document.getElementById("titleBtn");
const btnWrap = document.getElementById("btnWrap");
const shuffleBtn = document.getElementById("shuffleBtn");
const studetsList = document.getElementById("studetsList");
const modal = document.getElementById("modal");

let shuffling;

// 제목 세팅 이벤트 리스너
titleInput.addEventListener("input", (e) => {
    if((e.target.value).length > 0) {
        titleBtn.classList.add("show");
    }
})
titleBtn.addEventListener("click", () => {
    titleInput.classList.remove("show");
    titleText.classList.add("show");
    titleBtn.classList.remove("show");
    titleText.innerHTML = titleInput.value;
})
titleText.addEventListener("click", () => {
    titleInput.classList.add("show");
    titleText.classList.remove("show");
})

// 셔플 관련 함수
const setContents = async() => {
    // 데이터 받아오기
    const data = await axios.get("./data.json");
    let studentArr = data.data.students;

    const setView = (studentArr) => {
        studentArr.forEach((student) => studetsList.insertAdjacentHTML('beforeend', `
        <div class="student">
            <p>${student.name}</p>
            <button type="button" id="excludeBtn">x</button>
        </div>
    `))
    const $excludeBtn = document.querySelectorAll('#excludeBtn');
    $excludeBtn.forEach(item => item.addEventListener("click", (e) => {onRemoveStudent(e)}));
    };

    // 데이터 여부에따라 화면에 그리기
    studentArr.length === 0 
    ? studetsList.insertAdjacentHTML('beforeend', `<p>학생 리스트가 없어요😢</p>`)
    : btnWrap.classList.add('show') 
    setView(studentArr)

    // 학생 삭제
    const onRemoveStudent = (e) => {
        let filterStudent = [];
        for (let i = 0; i < studentArr.length; i++) {
            studentArr[i].name === (e.target.previousElementSibling).textContent && filterStudent.push(studentArr[i]);
        }
        studetsList.innerHTML = '';
        studentArr = studentArr.filter((item) => !filterStudent.includes(item));
        setView(studentArr);
    }

    // 배열 섞기
    const shuffledBasic = () => {
        return studentArr = studentArr.map(value => ({...value, sort: Math.random()})).sort((a,b) => a.sort - b.sort);
    } ;

    // 섞기 시각적 변화
    const shuffle = () => {
        shuffling = setInterval(() => {
            shuffledBasic();
            studetsList.innerHTML = ``;
            setView(studentArr);
        }, 100);
    };
    
    const selectStudent = (value, check) => {
        let selectStudents = [];
        let str ='';
        const num = parseInt(value);
        if(num <= 0 || studentArr.length <= num) {
            alert('입력값을 확인하세요') 
            shuffle();
            modalView();
            return;
        }
        for(let i = 0; i < num; i++){
            selectStudents.push(studentArr[i]);
        }
        str += `<div class="pick-student">`
        selectStudents.forEach(student => str += `<p class="pick-student__pick">${student.name}</p>`)
        str +=  `</div>`
        str += `<button type="button" id="reSuffleBtn">다시뽑기</button>`
        modal.innerHTML = str;

        document.getElementById('reSuffleBtn').addEventListener('click', () => {
            shuffle();
            modalView();
        });
        
        // 중복학생 제외
        if(check){
            studentArr = studentArr.filter((item) => !selectStudents.includes(item))
        };
    };

    // 모달 화면 그리기
    const modalView = () => {
        modal.innerHTML = `
            <button id="closeBtn" class="close_btn">x</button>
            <div class="modal_wrap">
                <div class="modal_inner">
                    <input type="number" id="drawNum" placeholder="몇명을 뽑을건가요?" min="1" value="1">
                    <input type="checkbox" id="chck1">
                    <label for="chck1">뽑힌학생 제외하기</label>
                    <button type="button" id="stopBtn">뽑기</button>
                </div>
            </div>
        `
        const $drawNum = document.getElementById('drawNum');
        const $stopBtn = document.getElementById('stopBtn');
        const $checkVal = document.getElementById('chck1');
        const $closeBtn = document.getElementById('closeBtn');
        
        $stopBtn.addEventListener('click', () => {
            clearInterval(shuffling);
            selectStudent($drawNum.value, $checkVal.checked)
        })
        $closeBtn.addEventListener("click", function(){
            modal.classList.remove("show");
            clearInterval(shuffling);
        });
    };

    shuffleBtn.addEventListener('click', () => {
        shuffle();
        modal.classList.add('show');
        modalView();
    });
}
setContents();