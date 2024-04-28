// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
if(taskList === null) taskList = [];
let nextId = JSON.parse(localStorage.getItem("nextId"));
const closeTaskBox = $("#close-task-box-btn");
const showTaskBox = $("#show-task-box-btn");
const blind = $("#blind");
const taskBox = $("#task-box");
const addTask = $("#add-task");


closeTaskBox.on("click", function (event) {
  taskBox.hide();
  blind.hide();
});

showTaskBox.on("click", function (event) {
  {
    taskBox.addClass("mt-4");
    taskBox.show();
    blind.show();
  }
});

addTask.on("click", handleAddTask);

// Todo: create a function to generate a unique task id
function generateTaskId() {}

// Todo: create a function to create a task card
/**
 *
 * @param {object} task
 */
function createTaskCard(task) {}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const task = {
    title: "",
    dat: "",
    description: "",
  };

  const title = $("#task-title").val();
  const date = $("#task-date").val();
  const description = $("#task-description").val();
  if (
    validateData(title, "Task Title") &&
    validateData(date, "Task Date") &&
    validateData(description, "Task Description")
  ) {
    
    task.title = title;
    task.date = date;
    task.description = description;

    // store data
    taskList.push(task);
    localStorage.setItem("task", JSON.stringify(taskList));
    console.log(taskList);

    // clear form and turn off blind and task box
    clearForm();
    taskBox.hide();
    blind.hide();
  }

  return;
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {});


/**
 * validateData validates data.
 * 
 * @param {string} data needs validating
 * @param {string} cetegory of data
 * @returns false if data is empty and pops up alert message.
 *          true otherwise.
 */
const validateData = function (data, cetegory) {
  if (!data || data.trim().length == 0) {
    window.alert(`${cetegory} is required`);
    return false;
  }
  return true;
};

/**
 * clearForm erase all input data.
 */
const clearForm = function(){
    $("#task-title").val("");
    $("#task-date").val("");
    $("#task-description").val("");
}