var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
event.preventDefault ();
var taskNameInput = document.querySelector("input[name='task-name']").value;
var taskTypeInput = document.querySelector("select[name='task-type']").value;

// PACKAGE UP DATA AS AN OBJECT
var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
};

// SEND IT AS AN ARGUMENT TO createTaskEl
createTaskEl(taskDataObj);
};

var createTaskEl = function(taskDataObj) {

    // CREATE LIST ITEM
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    
    // CREATE DIV TO HOLD TASK INFO AND ADD TO LIST ITEM
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    
    // ADD HTML CONTENT TO DIV
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // ADD ENTIRE LIST ITEM TO TASK LIST
    tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", taskFormHandler);