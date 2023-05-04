const main = document.getElementById("main");
const contents = document.getElementById("contents");
const titleInput = document.getElementById("titleInput");
const titleBtn = document.getElementById("titleBtn");
const btnWrap = document.getElementById("btnWrap");
const shuffleBtn = document.getElementById("shuffleBtn");
const settingBtn = document.getElementById("settingBtn");
const studetsSeat = document.getElementById("studetsSeat");
const modal = document.getElementById("modal");


import axios from './node_modules/axios/dist/esm/axios.min.js';

const setContents = async() => {
    let shuffling;
    let seatType;
    let genderType;
    // 데이터 받아오기
    const data = await axios.get("./data.json");
    let studentArr = data.data.students;

    // 화면에 그리기
    const setView = (studentArr) => {
        studentArr.forEach((student) => studetsSeat.insertAdjacentHTML('beforeend', `<div class="student_seat">${student.name}</div>`))
    }
    
    // 데이터 여부에따라 화면에 그리기
    studentArr.length === 0 
    ? studetsSeat.insertAdjacentHTML('beforeend', `<p>학생 리스트가 없어요</p>`)
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
                newStudentArr.push(femaleStudents[i])
            }
            newStudentArr.push(maleStudents[i])
          }else{
            if(maleStudents[i]){
                newStudentArr.push(maleStudents[i])
            }
            newStudentArr.push(femaleStudents[i])
          }
        }
        studentArr = newStudentArr;
    };

    // 모달 화면 그리기
    const modalView = (e) => {
        const name = e.target.name;
        if(name === 'setting'){
            modal.innerHTML = `
            <button id="closeBtn" class="close_btn">x</button>
            <div class="modal_wrap">
                <div class="modal_inner">
                    <h4>자리 바꾸기 설정</h4>
                    <div class="seat_setting">
                        <label>자리 대형</label>
                        <input type="radio" id="rdo-seat1" name="rdo-seat" value="rdo-seat1" checked>
                        <label for="rdo-seat1">거리두기 대형</label>
                        <input type="radio" id="rdo-seat2" name="rdo-seat" value="rdo-seat2">
                        <label for="rdo-seat2">짝궁 대형</label>
                    </div>
                    <div class="line_setting">
                        <label>첫 줄 설정</label>
                        <input type="radio" id="rdo-line1" name="rdo-line" value="2">
                        <label for="rdo-line1">2명</label>
                        <input type="radio" id="rdo-line2" name="rdo-line" value="4">
                        <label for="rdo-line2">4명</label>
                        <input type="radio" id="rdo-line3" name="rdo-line" value="6" checked>
                        <label for="rdo-line3">6명</label>
                        <input type="radio" id="rdo-line4" name="rdo-line" value="8">
                        <label for="rdo-line4">8명</label>
                        <input type="radio" id="rdo-line5" name="rdo-line" value="10">
                        <label for="rdo-line5">10명</label>
                    </div>
                    <div id="gender" class="gender_setting">
                        <label>짝꿍 설정</label>
                        <input type="radio" id="rdo-gender1" name="rdo-gender" value="random">
                        <label for="rdo-gender1">랜덤</label>
                        <input type="radio" id="rdo-gender2" name="rdo-gender" value="same">
                        <label for="rdo-gender2">동성</label>
                        <input type="radio" id="rdo-gender3" name="rdo-gender" value="other">
                        <label for="rdo-gender3">이성</label>
                    </div>
                    <div class="">
                        <button id="submitBtn" class="submit_btn">완료</button>
                    </div>
                </div>
            </div>`
        }else {
            modal.innerHTML = `
            <button id="closeBtn" class="close_btn">x</button>
            <button id="stopBtn" class="stop_btn">멈추기</button>
            `
        }
        const $stopBtn = document.getElementById("stopBtn");
        const $closeBtn = document.getElementById('closeBtn');
        const $submitBtn = document.getElementById('submitBtn');
        
        const $lineValue = document.querySelectorAll('input[name=rdo-line]');
        const $seatValue = document.querySelectorAll('input[name=rdo-seat]');

        $seatValue.forEach((item)=> item.addEventListener('change', function(e){
            const id = e.target.id;
            if(id === "rdo-seat2") {
                studetsSeat.classList.add("rdo-seat2")
                document.getElementById("gender").classList.add("show");
            }else{
                studetsSeat.classList.remove("rdo-seat2")
                document.getElementById("gender").classList.remove("show");
            }
        }));
        $lineValue.forEach((item)=> item.addEventListener('change', function(e){
            const id = e.target.id;
            studetsSeat.classList.contains("rdo-seat2") ? studetsSeat.className = `student_seat__wrap rdo-seat2 ${id}` : studetsSeat.className = `student_seat__wrap ${id}`
        }));
        $closeBtn.addEventListener("click", function(){
            modal.classList.remove("show");
            clearInterval(shuffling)
        });

        if($submitBtn) {
            $submitBtn.addEventListener("click", function(){
                seatType = document.querySelector('input[type=radio][name=rdo-seat]:checked').value;
                if(document.getElementById("gender").classList.contains('show')){
                    genderType = document.querySelector('input[type=radio][name=rdo-gender]:checked').value;  
                }else {
                    genderType = undefined;
                }
                modal.classList.remove("show");
                document.querySelector('input[type=radio][name=rdo-seat]:checked').setAttribute('checked', true);
            });  
        }
        if($stopBtn){
            $stopBtn.addEventListener("click", function(){
                modal.classList.remove("show");
                clearInterval(shuffling)
            });
        }
    }
    
    // 순서 섞기
    const shuffle = () => {
        if((seatType === undefined && genderType === undefined) || (seatType === 'rdo-seat1' || genderType === 'random')){
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
        modal.classList.add("show")
        modalView(e);
    });
    settingBtn.addEventListener("click", function(e){
        modal.classList.add("show")
        modalView(e);
    });
}
setContents();