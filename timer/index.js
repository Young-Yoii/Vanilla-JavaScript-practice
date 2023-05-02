const main = document.getElementById("main");
const countDownBtn = document.getElementById("countDownBtn");
const countUpBtn = document.getElementById("countUpBtn");
const settingBtn = document.getElementById("settingBtn");
const playBtn = document.getElementById("playBtn");
const resetBtn = document.getElementById("resetBtn");
const timeView = document.getElementById("timeView");
const titView = document.getElementById("titView");
const modal = document.getElementById("modal");

let hour = `00`;
let min = `00`;
let sec = `00`;
let timer;
let toggle = true;

window.onload = () => {
    init();
}
// 윈도우 로드시 동적으로 텍스트 삽입
function init() {
    setTimer(hour, min, sec);
}

// 타이머 display 셋팅
function setTimer(hour, min, sec){
    timeView.innerText = `${String(hour).padStart(2, "0")} : ${String(min).padStart(2, "0")} : ${String(sec).padStart(2, "0")}`; 
}

function setMode(e) {
    const name = e.target.name;

    if(name === "down") {
        main.classList.add("down");
        main.classList.remove("up");
    } 
    else {
        main.classList.add("up");
        main.classList.remove("down");
    }
};

countDownBtn.addEventListener("click", setMode);
countUpBtn.addEventListener("click", setMode);

// 카운터 셋팅
function setCount() {
    modal.classList.add("show");
    if(main.classList.contains("down")){
        modal.innerHTML = `
        <button class="close_btn">x</button>
        <div class="modal_wrap">
            <div class="modal_inner">
                <h4>카운트 다운 설정</h4>
                <div class="time_btn">
                    <button type="button" name="thirty">30분</button>
                    <button type="button" name="ten">10분</button>
                    <button type="button" name="three">3분</button>
                </div>
                <div class="time_input">
                    <span>
                        <input type="number" min="0" value=${hour} id="hour" name="hour">
                        <label for="">시</label>
                    </span>
                    <span>
                        <input type="number" min="0" value=${min} id="min" name="min">
                        <label for="">분</label>
                    </span>
                    <span>
                        <input type="number" min="0" value=${sec} id="sec" name="sec">
                        <label for="">초</label>
                    </span>
                    </div>
                <div class="time_tit">
                    <label for="">제목을 입력하세요</label>
                    <input type="text" id="tit">
                </div>
                <div class="">
                    <button class="submit_btn">완료</button>
                </div>
            </div>
        </div>
    ` }else{
        modal.innerHTML = `
        <button class="close_btn">x</button>
        <div class="modal_wrap">
            <div class="modal_inner">
                <h4>카운트 업 설정</h4>
                <div class="time_tit">
                    <label for="">제목을 입력하세요</label>
                    <input type="text" id="tit">
                </div>
                <button class="submit_btn">완료</button>
            </div>
        </div>
    ` }

    //동적으로 삽입한 el
    const $timeBtn = document.querySelectorAll('.time_btn > button');
    const $timeInput = document.querySelectorAll('.time_input input');
    const $minInput = document.getElementById('min');
    const $titInput = document.getElementById('tit');
    const $closeBtn = document.querySelector('.close_btn');
    const $submitBtn = document.querySelector('.submit_btn');

    $closeBtn.addEventListener("click", function(){
        modal.classList.remove("show");
    });
    $submitBtn.addEventListener("click", function(){
        modal.classList.remove("show");
    });

    //분 버튼 클릭시 인풋창 값 변경
    $timeBtn.forEach(btn => {
        btn.addEventListener("click",function(e){
            if(e.target.name === "thirty"){
                $minInput.setAttribute('value', 30);
                min = 30;
            }else if(e.target.name === "ten"){
                $minInput.setAttribute('value', 10);
                min = 10;
            }else {
                $minInput.setAttribute('value', 3);
                min = 3;
            }
            setTimer(hour, min, sec);
        });
    });

    //시간값 변경시 시간 display 변경
    $timeInput.forEach(input => {
        input.addEventListener("input",function(e){
            if(e.target.name === "hour"){
                hour = (e.target.value).padStart(2, "0");
            }else if(e.target.name === "min"){
                min = (e.target.value).padStart(2, "0");
            }else {
                sec = (e.target.value).padStart(2, "0");
            }
            setTimer(hour, min, sec);
        });
    });

    //제목값 변경시 제목 display 변경
    $titInput.addEventListener("input",function(e){
        titView.innerHTML = e.target.value;
    });
};
function countDown() {
    if (sec != 0) {
        sec--;
        setTimer(hour, min, sec);
    } else {
        if (min != 0) {
            min--;
            sec = 60;
        } else {
            if (hour != 0){
                hour--;
                min = 60;
            }
            else {
                clearInterval(timer);
                alert("시간 종료")
                playBtn.innerHTML = '▶'
                toggle = true;
            }
        }
    }
};
function countUp() {
    ++sec;
    hour = Math.floor(sec / 3600);
    min = Math.floor((sec - hour * 3600) / 60);
    let updSecond = sec - (hour * 3600 + min * 60);

    setTimer(hour, min, updSecond);
};

// 시간 리셋
function resetTimer() {
    clearInterval(timer);
    timeView.innerText = `00 : 00 : 00`;
    playBtn.innerHTML = '▶'
    hour = `00`;
    min = `00`;
    sec = `00`;
};
// 재생, 일시정지 버튼 토글
function pause() {
    if(main.classList.contains("down")){
        if(hour === '00' && min === '00' && sec === '00') {
            alert("시간을 설정해 주세요");
            return;
        }
       countDown(); 
    }else if(main.classList.contains("up")) {
       countUp();
    }
    if (!toggle) {
        // 반복 중단
        clearInterval(timer)
        playBtn.innerHTML = '▶'
        toggle = true;
    } else {
        // 반복 재개
        if(main.classList.contains("down")){
            timer = setInterval(countDown, 1000);
        }else {
            timer = setInterval(countUp, 1000);
        }
        playBtn.innerHTML = '||';
        toggle = false;
    }
};

settingBtn.addEventListener("click", setCount);
resetBtn.addEventListener('click', resetTimer);
playBtn.addEventListener('click', pause);
// 모달 배경 클릭시 모달 닫힘
window.addEventListener('click', (e) => {
    e.target === modal ? modal.classList.remove("show") : false;
})