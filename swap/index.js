import axios from './node_modules/axios/dist/esm/axios.min.js';

const titleInput = document.getElementById("titleInput");
const titleText = document.getElementById("titleText");
const titleBtn = document.getElementById("titleBtn");
const btnWrap = document.getElementById("btnWrap");
const shuffleBtn = document.getElementById("shuffleBtn");
const settingBtn = document.getElementById("settingBtn");
const studetsSeat = document.getElementById("studetsSeat");
const modal = document.getElementById("modal");

let shuffling;
let seatType;
let genderType = 'random';

// 모달 화면 컨텐츠 배열
const seatArr = [
    {name: 'rdo-seat', id: 'rdo-seat1', label: '거리두기 대형'},
    {name: 'rdo-seat', id: 'rdo-seat2', label: '짝궁 대형'}
]
const lineArr = [
    {name: 'rdo-line', id: 'rdo-line1', value: '2', label: '2명'},
    {name: 'rdo-line', id: 'rdo-line2', value: '4', label: '4명'},
    {name: 'rdo-line', id: 'rdo-line3', value: '6', label: '6명'},
    {name: 'rdo-line', id: 'rdo-line4', value: '8', label: '8명'},
    {name: 'rdo-line', id: 'rdo-line5', value: '10', label: '10명'},
]
const genderArr = [
    {name: 'rdo-gender', id: 'rdo-gender1', value: 'random', label: '랜덤'},
    {name: 'rdo-gender', id: 'rdo-gender2', value: 'same', label: '동성'},
    {name: 'rdo-gender', id: 'rdo-gender3', value: 'other', label: '이성'},
]

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

    // 화면에 그리기
    const setView = (studentArr) => {
        // 자리바꾸기.ver
        studentArr.forEach((student) => studetsSeat.insertAdjacentHTML('beforeend', `<div class="student_seat ${student.gender === "male" ? "male" : 'female'}">${student.name}</div>`))
        
        // 순서정하기.ver
        // let str = '';
        // for(let i = 0; i < studentArr.length; i++){
        //     str += `<div class="student_seat ${studentArr[i].gender === "male" ? "male" : 'female'}"><span>${i + 1}</span>${studentArr[i].name}</div>`
        // }
        // studetsSeat.innerHTML = str;
    }
    
    // 데이터 여부에따라 화면에 그리기
    studentArr.length === 0 
    ? studetsSeat.insertAdjacentHTML('beforeend', `<p>학생 리스트가 없어요😢</p>`)
    : btnWrap.classList.add('show') 
    setView(studentArr)

    // 배열 섞기
    const shuffledBasic = () => {
        return studentArr = studentArr.map(value => ({...value, sort: Math.random()})).sort((a,b) => a.sort - b.sort);
    } 
    // 동성 짝궁
    const shuffledSameGender = () => {
        const maleStudents = shuffledBasic().filter((item) => item.gender === "male");
        const femaleStudents = shuffledBasic().filter((item) => item.gender === "female");
        const maleLength = maleStudents.length;
        const femaleLength = femaleStudents.length;
        const newStudentArr = [];
        for (let i = 0; i < shuffledBasic().length; i++) {
          if (Math.floor(i / 2) % 2 === 0) {
            if (maleLength !== 0) {
              newStudentArr.push(maleStudents[0]);
              maleStudents.shift();
            } else {
              newStudentArr.push(femaleStudents[0]);
              femaleStudents.shift();
            }
          } else {
            if (femaleLength !== 0) {
              newStudentArr.push(femaleStudents[0]);
              femaleStudents.shift();
            } else {
              newStudentArr.push(maleStudents[0]);
              maleStudents.shift();
            }
          }
        }
        studentArr = newStudentArr;
    };
    // 이성 짝궁
    const shuffledOtherGender = () => {
        const maleStudents = shuffledBasic().filter((item) => item.gender === "male");
        const femaleStudents = shuffledBasic().filter((item) => item.gender === "female");
        const newStudentArr = [];
        const maleLength = maleStudents.length;
        const femaleLength = femaleStudents.length;
        const compareGender = maleLength === femaleLength 
        ? maleLength 
        : maleLength > femaleLength  
        ? maleLength 
        : femaleLength
        for (let i = 0; i < compareGender; i++) {
          if(maleLength === femaleLength){
            newStudentArr.push(maleStudents[i]);
            newStudentArr.push(femaleStudents[i]);
          }else if(maleLength > femaleLength){
            if(femaleStudents[i]){
                newStudentArr.push(femaleStudents[i]);
            }
            newStudentArr.push(maleStudents[i]);
          }else{
            if(maleStudents[i]){
                newStudentArr.push(maleStudents[i]);
            }
            newStudentArr.push(femaleStudents[i]);
          }
        }
        studentArr = newStudentArr;
    };

    // 모달 화면 그리기
    const modalView = (e) => {
        const name = e.target.name;
        const studetsSeatcls = studetsSeat.classList;
        let str = '';
        if(name === 'setting'){
            str += `
            <button id="closeBtn" class="close_btn">x</button>
            <div class="modal_wrap">
                <div class="modal_inner">
                    <h4>자리 바꾸기 설정</h4>
                    <div class="seat_setting">
                        <label>자리 대형</label>`
                        seatArr.forEach(item => str += `
                        <input type="radio" id=${item.id} name=${item.name} value=${item.id} ${(studetsSeatcls.contains(item.id)) && "checked"}>
                        <label for=${item.id}>${item.label}</label>
                        `)
            str += `</div>`
            str +=  `<div class="line_setting">
                        <label>첫 줄 설정</label>`
                        lineArr.forEach(item => str += `
                        <input type="radio" id=${item.id} name=${item.name} value=${item.value} ${(studetsSeatcls.contains(item.id)) && "checked"}>
                        <label for=${item.id}>${item.label}</label>
                        `)
            str += `</div>`
            str +=  `<div id="gender" class="gender_setting ${(studetsSeatcls.contains("rdo-seat2")) && 'show'}">
                    <label>짝꿍 설정</label>`
                        genderArr.forEach(item => str += `
                            <input type="radio" id=${item.id} name=${item.name} value=${item.value} ${genderType === item.value && "checked"}>
                            <label for=${item.id}>${item.label}</label>
                        `)
            str += `</div>`
            str += `<div class="">
                        <button id="submitBtn" class="submit_btn">완료</button>
                    </div>
                </div>
            </div>`
        }else {
            str = `
            <button id="closeBtn" class="close_btn">x</button>
            <button id="stopBtn" class="stop_btn">멈추기</button> 
             `
        }
        modal.innerHTML = str;

        const $stopBtn = document.getElementById("stopBtn");
        const $closeBtn = document.getElementById('closeBtn');
        const $submitBtn = document.getElementById('submitBtn');
        const $gender = document.getElementById('gender');
        const $lineValue = document.querySelectorAll('input[name=rdo-line]');
        const $seatValue = document.querySelectorAll('input[name=rdo-seat]');

        $seatValue.forEach(item => item.addEventListener('change', e => {
            const id = e.target.id;
            if(id === "rdo-seat2") {
                studetsSeatcls.remove("rdo-seat1");
                studetsSeatcls.add("rdo-seat2");
                $gender.classList.add("show");
            }else{
                studetsSeatcls.add("rdo-seat1");
                studetsSeatcls.remove("rdo-seat2");
                $gender.classList.remove("show");
            }
        }));
        $lineValue.forEach(item => item.addEventListener('change', e => {
            const id = e.target.id;
            studetsSeatcls.contains("rdo-seat2") 
            ? studetsSeat.className = `student_seat__wrap rdo-seat2 ${id}` 
            : studetsSeat.className = `student_seat__wrap rdo-seat1 ${id}`
        }));
        $closeBtn.addEventListener("click", () => {
            modal.classList.remove("show");
            clearInterval(shuffling);
        });

        if($submitBtn) {
            $submitBtn.addEventListener("click", () => {
                seatType = document.querySelector('input[type=radio][name=rdo-seat]:checked').value;
                $gender.classList.contains('show')
                ? genderType = document.querySelector('input[type=radio][name=rdo-gender]:checked').value 
                : genderType = 'random';
                modal.classList.remove("show");
            });  
        }
        if($stopBtn){
            $stopBtn.addEventListener("click", () => {
                modal.classList.remove("show");
                clearInterval(shuffling)
            });
        }
    }
    
    // 순서 섞기
    const shuffle = () => {
        if((seatType === undefined && genderType === 'random') || (seatType === 'rdo-seat1' || genderType === 'random')){
            shuffling = setInterval(() => {
                shuffledBasic();
                studetsSeat.innerHTML = ``;
                setView(studentArr);
            }, 100);
        };
        if(seatType === 'rdo-seat2' && genderType === 'same'){
            shuffling = setInterval(() => {
                shuffledSameGender();
                studetsSeat.innerHTML = ``;
                setView(studentArr);
            }, 100);
        };
        if(seatType === 'rdo-seat2' && genderType === 'other'){
            shuffling = setInterval(() => {
                shuffledOtherGender();
                studetsSeat.innerHTML = ``;
                setView(studentArr);
            }, 100);
        };
        return () => clearInterval(shuffling);
    }
    
    //섞기 클릭 후 시각적 변화
    shuffleBtn.addEventListener("click", function(e){
        shuffle();
        modal.classList.add("show");
        modalView(e);
    });
    settingBtn.addEventListener("click", function(e){
        modal.classList.add("show");
        modalView(e);
    });
}

setContents();