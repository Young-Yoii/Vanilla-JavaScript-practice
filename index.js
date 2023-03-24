// dom요소
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideItems = document.querySelectorAll('.box_wrap > div');
const slide = document.getElementById('box');
const startSlide = slideItems[0];
const endSlide = slideItems[slideItems.length - 1];

let curSlide = 1;
const size = startSlide.clientWidth;

// 요소 생성
const startElem = document.createElement('div');
const endElem = document.createElement('div');

// 요소 복제
endSlide.classList.forEach((c) => endElem.classList.add(c));
endElem.innerHTML = endSlide.innerHTML;

startSlide.classList.forEach((c) => startElem.classList.add(c));
startElem.innerHTML = startSlide.innerHTML;

// 각 복제한 엘리먼트 추가하기
slideItems[0].before(endElem);
slideItems[slideItems.length - 1].after(startElem);

// 복제한 요소 선택
const slideItems2 = document.querySelectorAll('.box_wrap > div');

// 1번 배너가 먼저 보이게
slideItems2.forEach((i) => {
  i.style.transform = `translateX(-${size * curSlide}px)`;
  i.style.transition = 'none';
});

const nextFunc = () => {
  curSlide++;
  if (slideItems2.length - 1 === curSlide) {
    setTimeout(() => {
      curSlide = 1;
      slideItems2.forEach((i) => {
        i.style.transform = `translateX(-${size * curSlide}px)`;
        i.style.transition = 'none';
      });
    }, 1000);
  }
  slideItems2.forEach((i) => {
    i.style.transform = `translateX(-${size * curSlide}px)`;
    i.style.transition = '1s';
  });
};

const prevFunc = () => {
  curSlide--;
  if (curSlide === 0) {
    setTimeout(() => {
      curSlide = slideItems2.length - 2;
      console.log(slideItems2.length);
      slideItems2.forEach((i) => {
        i.style.transform = `translateX(-${size * curSlide}px)`;
        i.style.transition = 'none';
      });
    }, 1000);
  }

  slideItems2.forEach((i) => {
    i.style.transform = `translateX(-${size * curSlide}px)`;
    i.style.transition = '1s';
  });
};

prevBtn.addEventListener('click', prevFunc);
nextBtn.addEventListener('click', nextFunc);
