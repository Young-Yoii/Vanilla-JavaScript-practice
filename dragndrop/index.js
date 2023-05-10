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
    let currentItemIndex;
    // const draggables = document.querySelectorAll(".draggable");
    // draggables.forEach(draggable => {
    //     draggable.addEventListener("dragstart", (e) => {
    //       draggable.classList.add("dragging");
    //     });
    //     draggable.addEventListener("dragend", () => {
    //         draggable.classList.remove("dragging");
    //     });
    // });

    main.addEventListener("dragstart", (e) => {
        e.target.classList.contains("draggable") ? currentItem = e.target : currentItem = e.target.parentElement
        currentItem.classList.add("dragging");
        const listArr = [...currentItem.parentElement.children];
        currentItemIndex = listArr.indexOf(currentItem);
    });
     main.addEventListener("drop", e => {
        e.preventDefault();
        const draggable = document.querySelector(".dragging");
        draggable.classList.remove("dragging");
        
     })
    main.addEventListener("dragover", e => {
        e.preventDefault();
        let currentDropItem;
        e.target.classList.contains("draggable") ? currentDropItem = e.target : currentDropItem = e.target.parentElement
        // const currentDropItem = e.target;
        const draggable = document.querySelector(".dragging");
        // console.log(currentItem)
        console.log(currentItemIndex)
        console.log(currentDropItem)
        console.log(currentItem.getBoundingClientRect())
        console.log(currentDropItem.getBoundingClientRect())
        const listArr = [...currentItem.parentElement.children];
        const a = currentItem.getBoundingClientRect().left
        const b = currentDropItem.getBoundingClientRect().left
        const c = currentItem.getBoundingClientRect().top
        const d = currentDropItem.getBoundingClientRect().top
        const dropItemIndex = listArr.indexOf(currentDropItem);
        console.log(dropItemIndex)
        if(dropItemIndex === -1) return
        // if (currentItemIndex < dropItemIndex) {
            a >= b && c>=d? currentDropItem.before(currentItem) : currentDropItem.after(currentItem)
        // }
        // else {
        //     currentDropItem.before(currentItem);
        // }

        // 1->4 after 가야하는데 before
        // 7 -> 3 before 가야하는데 after
    })
    
    

}
setContents()