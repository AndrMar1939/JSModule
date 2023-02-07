// 1 minute === 2px
// app works only with three events in the same time

let toDoList = [
    {
        start: 0,
        duration: 15,
        title: "Exercise",
    },
    {
        start: 25,
        duration: 30,
        title: "Travel to work",
    },
    {
        start: 30,
        duration: 30,
        title: "Plan day",
    },
    {
        start: 60,
        duration: 15,
        title: "Review yesterday's commits",
    },
    {
        start: 100,
        duration: 15,
        title: 'Code review',
    },
    {
        start: 180,
        duration: 90,
        title: "Have lunch with John",
    },
    {
        start: 360,
        duration: 30,
        title: "Skype call",
    },
    {
        start: 370,
        duration: 45,
        title: "Follow up with designer",
    },
    {
        start: 405,
        duration: 30,
        title: "Push up branch",
    },    
]


// _____________________________________________________________________________________________

class RenderHours {
    constructor() {
        this.container = document.querySelector(".calendar-container");
        this.renderAll();
    }

    renderHour(time) {
        const hourBlock = document.createElement("div");
        hourBlock.className = "hour-block";
        hourBlock.innerHTML = `
            <h2 class="hour-block__number">${time}:00</h2>
            <h3 class="hour-block__number smaller-text">${time}:30</h3>        
        `;

        if (time === 17) {
            hourBlock.innerHTML = `
            <h2 class="hour-block__number">${time}:00</h2>     
        `;
        }
        return this.container.append(hourBlock);
    }
    renderAll() {
        for (let i = 8; i <=17; i++) {
            this.renderHour(i);
        }
    }
}
// _____________________________________________________________________________________________
class Act {
    constructor(item){
        Object.assign(this, item);
        this.width = 200;
        this.end = item.start + item.duration;
        this.leftX = 40;
        this.id = Act.id++;
    }
    static id = 0;
}
// _____________________________________________________________________________________________

class ListOfActions {

    constructor (list){
        list = list.sort(function (a,b) {return a.start - b.start});
        this.items = list.map(item => new Act(item));
        this.calculateWidthAndLeft();
    }

    calculateWidthAndLeft(){  
        // width    

        let arrOfSameTimeActs = this.items.filter( item => {
            let i = this.items.indexOf(item);
            if (i < this.items.length - 1 && item.end > this.items[i+1].start || 
                i > 0 && item.start < this.items[i-1].end) {
                return true
            } 
        });     

        // let arrOfSameTimeActs = this.items.filter( item => {
        //     let i = this.items.indexOf(item);
        //     for (const ch of this.items) {
        //         if (item.id > ch.id && item.end > ch.start) {
        //         return true
        //     } 
        //     }

        // });     

        arrOfSameTimeActs.forEach(element => {
            element.width = element.width/2;
        });
        // leftX coordinate

            for (let i = 0; i < arrOfSameTimeActs.length-1; i++){
                if(arrOfSameTimeActs[i+1].id - arrOfSameTimeActs[i].id === 1) {
                    if (arrOfSameTimeActs[i].leftX === 40) {
                        arrOfSameTimeActs[i+1].leftX += 100;
                    }
                    else if (arrOfSameTimeActs[i].leftX === 140 && i >=1 && arrOfSameTimeActs[i-1].end > arrOfSameTimeActs[i+1].start) {
                        arrOfSameTimeActs[i+1].leftX += 200;
                    } 
                    else if (arrOfSameTimeActs[i].leftX === 140 && i >=1 && arrOfSameTimeActs[i].end > arrOfSameTimeActs[i+1].start) {
                        arrOfSameTimeActs[i+1].leftX += 200;
                    }
                    else if (arrOfSameTimeActs[i].leftX === 240) {
                        arrOfSameTimeActs[i+1].leftX = 40;
                    }
                }
            }


        // for (const ch of this.items) {

        //     for (const e of this.items) {
      
        //         if(ch.id !== e.id && ch.end > e.start && e.start > ch.start && ch.end > e.end) {
        //             console.log('+');
        //             ch.width = 100;
        //         } else 
        //         if ( ch.id !== e.id && ch.end >= e.start && e.start > ch.start) {
        //             console.log('++');
        //             ch.width = 100;
        //         } else
        //         if (ch.id !== e.id && ch.start > e.end && ch.end < e.end) {
        //             console.log('+++');
        //             ch.width = 100;

        //         }
        //     }
            
        // }
        return arrOfSameTimeActs;
    }
}

// ___________________________________________________________________________________________

class RenderActions {
    #toDoList = null;
    #renderHours = null;

    constructor(listOfActs, renderHours) {
        this.container = document.querySelector(".calendar-container");

        this.#toDoList = listOfActs.items;

        this.#renderHours = renderHours;

        this.renderToDoList(this.#toDoList);
        this.modalWindowOptions();

        
    }

    renderOneAct(act){
        const actContainer = document.createElement("div");
        actContainer.className = "event-block";
        actContainer.innerHTML = `
            <p>${act.title}</p>
        `;    

        actContainer.setAttribute("style", `height: ${act.duration * 2}px; width: ${act.width}px; top: ${act.start * 2}px; left: ${act.leftX}px; background: #E2ECF5; border-left: 3px solid #6e9fcf80;`);


        return actContainer;
    }


    renderToDoList(list){
        this.container.innerHTML = '';
        this.#renderHours.renderAll();

        // list of actions
        let actsCollection = list.map(item => this.renderOneAct(item));
        this.container.append(...actsCollection);

        // remove events 
            // this.modalWindowOptions();


    }

    // remove events method and change colors

    modalWindowOptions() {
        let listOfBlocks = this.container.querySelectorAll(".event-block");

        let arrFromNode = Array.from(listOfBlocks);
        listOfBlocks.forEach(item => {
            let titleText = item.querySelector('p');

            // calculating time from pixels
            let startInPixels = item.style.top.replace('px', '');
            let startHours = (+startInPixels/2 - ((+startInPixels/2) % 60)) / 60 + 8 +"";
            let startMinutes = (+startInPixels/2) % 60 + "";
            let duration = +item.style.height.replace('px', '')/2;
            
            // event for event box
            item.addEventListener ("click", () => {

                const modalWindow = document.querySelector(".modal-info");    
                modalWindow.classList.add('active'); 
                modalWindow.innerHTML = `
                    <div class="modal-info-text">
                        <b>Event name: ${item.textContent}</b>
                        <p>Event start: ${startHours.padStart(2, "0")}:${startMinutes.padStart(2, "0")}</p>
                        <p>Duration: ${duration} minutes</p>
                    </div>    
                `;    

                
                // change event colors
                    // background
                const inputColorContainer = document.createElement("div"); 
                inputColorContainer.className = "input-color-container"

                const actColorInput = document.createElement("input"); 
                actColorInput.type = 'color';

                const actColorInputLabel = document.createElement("label"); 
                actColorInputLabel.className = "input-color-background";
                actColorInputLabel.textContent = "choose a background";                
                actColorInputLabel.append(actColorInput);

                inputColorContainer.append(actColorInputLabel);

                actColorInput.value = "#E2ECF5";
                actColorInput.addEventListener("input", () => {
                    item.style.background =  `${actColorInput.value}`;
                })
                     // border
                const borderColorInput = document.createElement("input"); 
                borderColorInput.type = 'color';

                const borderColorInputLabel = document.createElement("label"); 
                borderColorInputLabel.className = "input-color-border";
                borderColorInputLabel.textContent = "choose a border";                
                borderColorInputLabel.append(borderColorInput);

                inputColorContainer.append(borderColorInputLabel);

                borderColorInput.value = "#6e9fcf";
                borderColorInput.addEventListener("input", () => {
                    item.style.borderLeft =  `3px solid ${borderColorInput.value}80`;
                })
                // modalWindow.append(inputColorContainer);                    

                // container for buttons
                const closeBtn = document.createElement("button"); 
                const removeBtn = document.createElement("button");  
                const commitBtn = document.createElement("button");  
                const containerForButtons = document.createElement("div");  
                containerForButtons.append(commitBtn, closeBtn, removeBtn);
                // modalWindow.append(containerForButtons);

                // commit changes in modal window
                commitBtn.type = "button";
                commitBtn.className = "modal-info-commit-btn";
                commitBtn.innerText = "Commit changes";               
            
                // close modal window
                 
                closeBtn.type = "button";
                closeBtn.className = "modal-info-close-btn";
                closeBtn.innerText = "Close this window";
                closeBtn.addEventListener('click', (event) => {
                    if (event.target !==closeBtn) {
                        return
                    }
                    modalWindow.classList.remove('active'); 
                })
                    // remove btn
                
                removeBtn.type = "button";
                removeBtn.className = "modal-info-remove-btn";
                removeBtn.innerText = "Remove current event";


                // remove event in calendar
                removeBtn.addEventListener('click', (event) => { 
                    // cancel bubbling
                    if (event.target !==removeBtn) {
                        return
                    }

                    modalWindow.classList.remove('active'); 


                    // create arr from NodeList and filter ToDoList by index
                    

                    toDoList = toDoList.filter(i => {
                        return toDoList.indexOf(i) !== arrFromNode.indexOf(item)}
                    );  
                        
                    // return i.title !== titleText.textContent || i.duration !== duration || i.start !== startInPixels/2}
                    

                    
                    
                    this.#toDoList = new ListOfActions(toDoList);
                    this.renderToDoList(this.#toDoList.items);
                    console.log(toDoList)
                    console.log(listOfActs) 
                })



                // change event title, start, duration
                      // new title
                    const inputChangeEventContainer = document.createElement("div"); 
                    inputChangeEventContainer.className = "input-change-event-container"
    
                    const actNameInput = document.createElement("input"); 
                    actNameInput.type = 'text';
    
                    const actNameInputLabel = document.createElement("label"); 
                    actNameInputLabel.className = "input-event-properties";
                    actNameInputLabel.textContent = "new name:";                
                    actNameInputLabel.append(actNameInput);
    
                    inputChangeEventContainer.append(actNameInputLabel);
    
                    // actNameInput.addEventListener('input', () => {
                    //     titleText.textContent = actNameInput.value;
                    // })
                        // new start
                    
                    const actStartInput = document.createElement("input"); 
                    actStartInput.type = 'time';
                    // actStartInput.value = "08:00";
    
                    const actStartInputLabel = document.createElement("label"); 
                    actStartInputLabel.className = "input-event-properties";
                    actStartInputLabel.textContent = "new start:";                
                    actStartInputLabel.append(actStartInput);
    
                    inputChangeEventContainer.append(actStartInputLabel);    

                        // new duration
    
                    const actDurationInput = document.createElement("input"); 
                    actDurationInput.type = 'number';
    
                    const actDurationInputLabel = document.createElement("label"); 
                    actDurationInputLabel.className = "input-event-properties";
                    actDurationInputLabel.textContent = "new duration:";                
                    actDurationInputLabel.append(actDurationInput);
    
                    inputChangeEventContainer.append(actDurationInputLabel);
    

    
                    // commit changes 

                    commitBtn.addEventListener("click", () => {
                        let currentNodeIndex = arrFromNode.indexOf(item);
                        console.log(toDoList[currentNodeIndex])
                        //new title
                        if (!!actNameInput.value){
                            titleText.textContent = actNameInput.value; 
                            toDoList[currentNodeIndex].title = actNameInput.value;                           
                        }
                       

                        // new start
                        
                        let hoursNew = actStartInput.value.slice(0, 2);
                        let minutesNew = actStartInput.value.slice(3);
                          
                        let startTime = (+hoursNew-8) * 60 + (+minutesNew);     
                        

                        if (!!actStartInput.value && startTime < 540 && startTime >=0) {                            
                            item.style.top = `${startTime *2}px`;
                            toDoList[currentNodeIndex].start = startTime;
                        }
    
                        

                        //new  duration
                        
                        if (!!actDurationInput.value) {
                            duration = actDurationInput.value;
                            item.style.height = `${duration *2}px`;  
                            toDoList[currentNodeIndex].duration = (+duration);                          
                        }
                        

                        // rerender new modal window
                        modalWindow.innerHTML = `
                        <div class="modal-info-text">
                            <b>Event name: ${item.textContent}</b>
                            <p>Event start: ${startHours.padStart(2, "0")}:${startMinutes.padStart(2, "0")}</p>
                            <p>Duration: ${duration} minutes</p>
                        </div>    
                         `;  

                         if (!!actStartInput.value && startTime < 540 && startTime >=0) {                            
                            modalWindow.innerHTML = `
                            <div class="modal-info-text">
                                <b>Event name: ${item.textContent}</b>
                                <p>Event start: ${hoursNew.padStart(2, "0")}:${minutesNew.padStart(2, "0")}</p>
                                <p>Duration: ${duration} minutes</p>
                            </div>    
                             `; 
                        }

                         modalWindow.append(inputColorContainer, inputChangeEventContainer, containerForButtons);  

                        // toDoList = toDoList.sort(function (a,b) {return a.start - b.start});
                        // this.#toDoList = new ListOfActions(toDoList);
                        // this.renderToDoList(this.#toDoList.items);
      
                    })   
    
                    modalWindow.append(inputColorContainer, inputChangeEventContainer, containerForButtons);

            })
 
        })   

    }


}

// ____________________________________________________inputs
class Inputs {
    #renderActions = null;
    constructor(renderActions){
        this.#renderActions = renderActions;
        this.list = null;

        this.btnAddEvent = document.querySelector('.input-btn-add');
        this.btnShowInputs = document.querySelector('.open-inputs-btn');
        this.btnCloseInputs = document.querySelector('.input-btn-close');
        this.inputContainer = document.querySelector('.inputs-container');
        this.startInput = document.getElementById('start-event');
        this.durationInput = document.getElementById('duration-event');
        this.titleInput = document.getElementById('title-event');        

        this.startInput.value = "08:00";
        
        this.addNewEvent();

    }

    addNewEvent() {
        // open inputs
        this.btnShowInputs.addEventListener ('click', () => {
            this.inputContainer.classList.add('active');
            this.btnShowInputs.classList.add('active');
        })
        // close inputs
        this.btnCloseInputs.addEventListener ('click', () => {
            this.inputContainer.classList.remove('active');
            this.btnShowInputs.classList.remove('active');
        })

        // inputs logic
        this.btnAddEvent.addEventListener('click', () => {
            // calculating start for event from time
            let hours = this.startInput.value.slice(0, 2);
            let minutes = this.startInput.value.slice(3);
            minutes= +minutes;

            let startTime = (+hours - 8) * 60 + minutes;  
            
            // create new Act

            let newAct = {
                start: startTime,
                duration:  +this.durationInput.value,
                title: this.titleInput.value,
            }

            if (this.durationInput.value > 0 && startTime < 540) {
                toDoList.push(newAct);
                this.list = new ListOfActions(toDoList);                
                this.#renderActions.renderToDoList(this.list.items);                
            }     
            
        })
    }
}







const renderHours = new RenderHours;
let listOfActs = new ListOfActions(toDoList);
const renderActions = new RenderActions(listOfActs, renderHours);
const inputs = new Inputs(renderActions);
console.log(toDoList);







