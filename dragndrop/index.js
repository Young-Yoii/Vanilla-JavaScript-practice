import axios from './node_modules/axios/dist/esm/axios.min.js';
// todo : 바뀐 순서를 db에 저장하기
const main = document.getElementById('main');

const setContents = async() => {
    const data = await axios.get("./data.json");
    const content = data.data.content;

    let str =''; 
    content.forEach(item => {
        str += ` <div class="draggable" draggable="true">
                <p>${item.name}</p>`
        item.content.forEach(item => str += item.key ? `<p>${item.key} : ${item.val}</p>` : `<p>${item}</p>`)
        str += `</div>`
    })
    main.innerHTML = str;

    let currentItem;
    main.addEventListener("dragstart", (e) => {
        // div 안의 요소가 잡히는 것 방지
        e.target.classList.contains("draggable") ? currentItem = e.target : currentItem = e.target.parentElement;
        currentItem.classList.add("dragging");
    });
    main.addEventListener("dragover", e => {
        e.preventDefault();
        let currentDropItem;
        e.target.classList.contains("draggable") || e.target.classList.contains("main") ? currentDropItem = e.target : currentDropItem = e.target.parentElement;
        const listArr = [...currentItem.parentElement.children];
        const curItemLeft = currentItem.getBoundingClientRect().left;
        const curDropItemLeft = currentDropItem.getBoundingClientRect().left;
        const curItemTop = currentItem.getBoundingClientRect().top;
        const curDropItemTop = currentDropItem.getBoundingClientRect().top;

        const dropItemIndex = listArr.indexOf(currentDropItem);

        //main 부분이 잡혔을때 방지 --> 개선필요
        if(dropItemIndex === -1) return;
        curItemLeft >= curDropItemLeft && curItemTop >= curDropItemTop ? currentDropItem.before(currentItem) : currentDropItem.after(currentItem);
    })
    main.addEventListener("drop", e => {
        e.preventDefault();
        const draggable = document.querySelector(".dragging");
        draggable.classList.remove("dragging");
    })
}
setContents();