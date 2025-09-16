window.addEventListener('DOMContentLoaded',() => {

    setNote();
    setDate();

});



function setNote() {
    let form = document.forms[0];
    let ul = document.querySelector("ul");
    let setBox = document.querySelector(".todo__set");
    let isEdit = false;

    document.addEventListener('mousedown', (e) => {
        if(e.detail > 1) e.preventDefault();
    });

    function windowLoad() {
        window.addEventListener('load', (e) => { 
            for(let i = 0; i < localStorage.length; i++) {
                onSubmit(e, localStorage.getItem(i));
            }
        });
    }
    windowLoad();

    function checkOnEmpty(state) {
        let isEmpty = state;
        if(isEmpty) ul.previousElementSibling.textContent = 'List is empty...';
        else ul.previousElementSibling.textContent = '';
    }
    checkOnEmpty(true);
    
    function confirmRemoval(text, element, isRemoveAllChecked) {
            isEdit = false;
            let answer = confirm(text,'');
            if(!answer) return;
        
            if(Array.isArray(element)) {
                if(!isRemoveAllChecked) element.forEach((item) => {
                    if(item.classList.contains('list__item_reject')) return;
                    item.remove();

                    localStorage.clear()
                    setStorage(ul.querySelectorAll(".list__text")); 
                });
                if(isRemoveAllChecked) {
                    element.forEach((item) => {
                        if(item.classList.contains('list__item_done')) {
                            item.remove();

                            localStorage.clear()
                            setStorage(ul.querySelectorAll(".list__text")); 
                        } 
                    });
                }
            } 
            else element.remove();
            
            ul.parentElement.style.minHeight = 0;
            if(ul.children.length == 0) checkOnEmpty(true);  
        }
    
    function createNoteElement(value) {
        let html = `
            <span class="list__text">${value}</span>  
            <div class="">
                <span class="check list__target" >✓</span>
                <span class="denied list__target" >✕</span> 
                <span class="reject list__target" >reject</span> 
            </div>`;
            
        let elem = document.createElement('li');
        elem.classList.add('list__item');
        elem.classList.add('target-item');
        elem.insertAdjacentHTML('afterBegin', html);

        checkOnEmpty(false);

        ul.parentElement.style.minHeight = ul.parentElement.offsetHeight + elem.offsetHeight + "px";
        ul.append(elem);

        return elem;
    }

    function setStorage(node) {
        node.forEach((item, i) => localStorage.setItem(i, item.textContent))
    }
    
    function replaceItem(elem, i) {
        isEdit = true;
        let textArea = document.createElement('textarea');
    
        textArea.classList.add('list__edit');
        elem.insertAdjacentHTML('afterend', '<button type="button" class="button  list__edit-button">Edit</button>');

        textArea.value = elem.innerHTML;
        elem.replaceWith(textArea);
        textArea.focus();

        let editButton = ul.querySelectorAll("button");
        

        function abortReplace() {
            textArea.replaceWith(elem);
            elem.textContent = textArea.value;
            editButton.forEach(button => {
                button.removeEventListener("click", onClick);
                button.remove(); 
                isEdit = false;
            });
        }

        function onClick(i) {
            localStorage.setItem(i, textArea.value)
            abortReplace();
        }

        if (editButton) editButton.forEach((button) => button.addEventListener('click', () => onClick(i)));
    }

    
    function addDoneClass(item) {
        let check = item.querySelectorAll(".check");
        let reject = item.querySelectorAll(".reject");

        if (item.classList.contains("list__item_done")) {
            item.classList.remove("list__item_reject");

            check.forEach(item => item.style.color = "lightgreen");
            reject.forEach(item => item.style.color = "");
        } else check.forEach(item => item.style.color = "");
    }

    function addRejectClass(item) {
        let check = item.querySelectorAll(".check");
        let reject = item.querySelectorAll(".reject");
        
        if (item.classList.contains("list__item_reject")) {
            item.classList.remove("list__item_done");

            reject.forEach(item => item.style.color = "red");
            check.forEach(item => item.style.color = "");

        } else reject.forEach(item => item.style.color = "");
    }

    function setState(e, item, i) {
        if(isEdit) return;
        let target = e.target.closest(".list__target");
        if (!target) return;

        if (target && target.matches(".check")) {
            if(item.classList.contains('list__item_reject')) return;
            item.classList.toggle("list__item_done");
            addDoneClass(item);
        };

        if (target && target.matches(".reject")) {
            item.classList.toggle("list__item_reject")
            addRejectClass(item);
        };

        if (target && target.matches(".denied")) {
            if(item.classList.contains('list__item_reject')) return;
            confirmRemoval('Delete this note?', item);

            localStorage.clear();
            setStorage(ul.querySelectorAll(".list__text")); 

        };
    }

    function onSubmit(e, value) {
        e.preventDefault();
        
        if(value) createNoteElement(value);
        
        let li = document.querySelectorAll(".list__item");
        let liText = document.querySelectorAll(".list__text"); 

        li.forEach((item, i) => {
            item.onclick = (e) => setState(e, item, i);
        });
        form.reset();

        liText.forEach((span, i) => {
            localStorage.setItem(i, span.textContent);
            span.onclick = () => {
                if(isEdit) return;
                replaceItem(span, i);
            }
        });
    }

    function setBoxHandle(e) {
        let target = e.target.closest(".button");
        if (!target) return;
    
        if(target && target.matches(".check-all")) {
            Array.from(ul.children).forEach(item => {
                if(item.classList.contains('list__item_reject')) return;
                item.classList.add("list__item_done");
                addDoneClass(item)
            });  
        }

        if(target && target.matches(".remove-all")) {
            let includeClass = true;
            for(let li of ul.children) if(!li.classList.contains('list__item_reject')) includeClass = false
            if(ul.children.length > 0 && !includeClass) confirmRemoval('Delete all notes?', Array.from(ul.children));
        } 
        if(target && target.matches(".remove-all-checked")) {
            let isRemoveAllChecked = true;
            let includeClass = false;
            for(let li of ul.children) if(li.classList.contains("list__item_done")) includeClass = true;
            if(includeClass) confirmRemoval('Delete all completed notes?', Array.from(ul.children), isRemoveAllChecked)
        };
    }

    form.addEventListener("submit", (e) => onSubmit(e, form.note.value));
    setBox.addEventListener("click", setBoxHandle);
}

function setDate() {
    let date = new Date();
    let dateBox = document.querySelector('.footer__date');

    function getDate(date) {
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        let year = date.getFullYear();
        return {
            day,
            month,
            year,
        }
    }
    dateBox.innerHTML = `${getDate(date).day} . ${getDate(date).month} . ${getDate(date).year}`;
}