var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var completeEditTask = function(taskName, taskType, taskId) {
    // FIND THE MATCHING TASK LIST ITEM
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // SET NEW VALUES
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // LOOP THROUGH TASKS ARRAY AND TASK OBJECT WITH NEW CONTENT
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // CHECK IF INPUT VALUES ARE EMPTY STRINGS
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
    // HAS DATA ATTRIBUTE, SO GET TASK ID AND CALL FUNCTION TO COMPLETE EDIT PROCESS
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // NO DATA ATTRIBUTE, SO CREATE OBJECT AS NORMAL AND PASS TO createTaskEl FUNCTION
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };

        createTaskEl(taskDataObj);
    }

    // PACKAGE UP DATA AS AN OBJECT
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };
};

var createTaskEl = function (taskDataObj) {

    console.log(taskDataObj);
    console.log(taskDataObj.status);

    // CREATE LIST ITEM
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // ADD TASK ID AS A CUSTOM ATTRIBUTE
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // CREATE DIV TO HOLD TASK INFO AND ADD TO LIST ITEM
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";

    // ADD HTML CONTENT TO DIV
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // ADD ENTIRE LIST ITEM TO TASK LIST
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // INCREASE TASK COUNTER FOR NEXT UNIQUE ID
    taskIdCounter++;
};

var createTaskActions = function(taskId) {

    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // CREATE EDIT BUTTON
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // CREATE DELETE BUTTON
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // CREATE OPTION ELEMENT
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // APPEND TO SELECT
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
    // GET TARGET ELEMENT FROM EVENT
    var targetEl = event.target;

    // EDIT BUTTON WAS CLICKED
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // DELETE BUTTON WAS CLICKED
    else if (targetEl.matches(".delete-btn")) {
       var taskId = targetEl.getAttribute("data-task-id");
       deleteTask(taskId);
    }
};

var editTask = function(taskId) {
    console.log("editing task #" + taskId);

    // GET TASK LIST ITEM ELEMENT
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // GET CONTENT FROM TASK NAME AND TYPE
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "'");
    taskSelected.remove();
    console.log(taskId);
    if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }

    // CREATE NEW ARRAY TO HOLD UPDATED LIST OF TASKS
    var updatedTaskArr = [];

    // LOOP THROUGH CURRENT TASKS
    for (var i = 0; i < tasks.length; i++) {
        // IF tasks[i].id DOESN'T MATCH THE VALUE OF taskId, KEEP THAT TASK AND PUSH IT INTO THE NEW ARRAY
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // REASSIGN TASKS ARRAY TO BE THE SAME AS updatedTaskArr
    tasks = updatedTaskArr;
};

var taskStatusChangeHandler = function(event) {
   // GET THE TASK ITEM'S ID
   var taskId = event.target.getAttribute("data-task-id");
   
   // GET THE CURRENTLY SELECTED OPTION'S VALUE AND CONVERT TO LOWERCASE
   var statusValue = event.target.value.toLowerCase();

   // FIND THE PARENT TASK ITEM ELEMENT BASED ON THE ID
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

   if (statusValue === "to do") {
       tasksToDoEl.appendChild(taskSelected);
   }
   else if (statusValue === "in progress") {
       tasksInProgressEl.appendChild(taskSelected);
   }
   else if (statusValue === "completed") {
       tasksCompletedEl.appendChild(taskSelected);
   }

   // UPDATE TASKS IN TASKS ARRAY
   for (var i = 0; i < tasks.length; i++) {
       if (tasks[i].id === parseInt(taskId)) {
           tasks[i].status = statusValue;
       }
   }
   console.log(tasks);
};

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);