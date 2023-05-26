import axios from './node_modules/axios/dist/esm/axios.min.js';

const titleInput = document.getElementById("titleInput");
const titleText = document.getElementById("titleText");
const submitBtn = document.getElementById("submitBtn");
const cancleBtn = document.getElementById("cancleBtn");
const btnWrap = document.getElementById("btnWrap");
const shuffleBtn = document.getElementById("shuffleBtn");
const studetsList = document.getElementById("studetsList");
const modal = document.getElementById("modal");

let shuffling;

// 제목 세팅 이벤트 리스너
titleInput.addEventListener("input", (e) => {
    if((e.target.value).length > 0) {
        submitBtn.classList.add("show");
    }
})
submitBtn.addEventListener("click", () => {
    titleInput.classList.remove("show");
    titleText.classList.add("show");
    submitBtn.classList.remove("show");
    cancleBtn.classList.remove("show");
    titleText.innerHTML = titleInput.value;
})
cancleBtn.addEventListener("click", () => {
    titleInput.classList.remove("show");
    titleText.classList.add("show");
    submitBtn.classList.remove("show");
    cancleBtn.classList.remove("show");
})
titleText.addEventListener("click", () => {
    titleInput.classList.add("show");
    titleText.classList.remove("show");
    cancleBtn.classList.add("show");
})

// 셔플 관련 함수
const setContents = async() => {
    // 데이터 받아오기
    const data = await axios.get("./data.json");
    let studentArr = data.data.students;

    const setView = (studentArr) => {
        studentArr.forEach((student) => studetsList.insertAdjacentHTML('beforeend', `
        <div class="student" style="background:${student.gender === 'male' ? 'skyblue' : 'lightpink'}">
            <p>${student.name}</p>
            <button type="button" id="excludeBtn" class="student__exclud-btn">❌</button>
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
        selectStudents.forEach(student => str += `<p class="pick-student__pick" style="background:${student.gender === 'male' ? 'skyblue' : 'lightpink'}">${student.name}</p>`)

        modal.innerHTML = `
            <div class="modal__wrap">
                <div class="btn-wrap">
                    <button type="button" id="reSuffleBtn" class="resuffle-btn">다시뽑기</button>
                    <button id="closeBtn" class="close-btn">✖️</button>
                </div>
                <div class="modal__inner">
                    ${str}
                </div>
            </div>
        `
        
        // 중복학생 제외
        if(check){
            studentArr = studentArr.filter((item) => !selectStudents.includes(item))
        };
    };

    // 모달 화면 그리기
    const modalView = () => {
        modal.innerHTML = `
            <div class="modal__wrap">
                <div class="btn-wrap">
                    <button id="closeBtn" class="close-btn">✖️</button>
                </div>
                <div class="modal__inner">
                    <div>
                        <input type="number" id="drawNum" placeholder="몇명을 뽑을건가요?" min="1" value="1">
                        <label for="chck1">
                            <input type="checkbox" id="chck1">
                            뽑힌학생 제외하기
                        </label>
                    </div>
                    <button type="button" id="stopBtn" class="stop-btn">🕹️</button>
                </div>
            </div>
        `
        const $drawNum = document.getElementById('drawNum');
        const $stopBtn = document.getElementById('stopBtn');
        const $checkVal = document.getElementById('chck1');
        
        $stopBtn.addEventListener('click', () => {
            clearInterval(shuffling);
            selectStudent($drawNum.value, $checkVal.checked)
        })
    };

    shuffleBtn.addEventListener('click', () => {
        shuffle();
        modal.classList.add('show');
        modalView();
    });

    modal.addEventListener('click', (e) => {
        if(e.target.className === 'close-btn'){
            modal.classList.remove("show");
            clearInterval(shuffling);
        }
        if(e.target.className === 'resuffle-btn'){
            shuffle();
            modalView();
        }
    })
}
setContents();