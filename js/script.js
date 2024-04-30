// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
if (taskList === null) taskList = [];

let nextId = JSON.parse(localStorage.getItem("nextId"))
  ? JSON.parse(localStorage.getItem("nextId"))
  : [];
//

/** FIELDS **/
const closeTaskBox = $("#close-task-box-btn");
const showTaskBox = $("#show-task-box-btn");
const blind = $("#blind");
const taskBox = $("#task-box");
const addTask = $("#add-task");
const toDoCardsList = $("#todo-cards-list");

// const toDoList =
//   JSON.parse(localStorage.getItem("toDoList")) === null
//     ? []
//     : JSON.parse(localStorage.getItem("toDoList"));

$("#task-date").datepicker();

closeTaskBox.on("click", function (event) {
  $("#task-title").val("");
  $("#task-date").val("");
  $("#task-description").val("");
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
/**
 *
 * @returns an
 */
function generateTaskId() {
  return Math.floor(Math.random() * 900000) + 100000;
}

// Todo: create a function to create a task card
/**
 *
 * @param {object} task
 */
function createTaskCard(task) {
  console.log("createTaskCard(task) is invoked");
  const today = dayjs();
  const taskDate = dayjs(task.date, "MM/DD/YYYY");

  console.log(today);
  console.log(taskDate.isSame(today, "day"));

  const listItem = $("<li>");
  const card = $("<div>");
  const cardHeader = $("<h4>");
  const cardBody = $("<div>");
  const cardDate = $("<p>");
  const cardDescription = $("<p>");
  const cardDeleteBtn = $("<button>");

  cardDate.addClass("card-text");
  cardDate.text(`${task.date}`);
  cardDescription.addClass("card-text");
  cardDescription.text(`${task.description}`);
  cardDeleteBtn.addClass("btn btn-danger delete-item-btn");
  cardDeleteBtn.text("Delete");

  cardBody.append(cardDate);
  cardBody.append(cardDescription);
  cardBody.append(cardDeleteBtn);
  cardBody.addClass(
    "card-body d-flex flex-column justify-content-center align-items-center"
  );

  cardHeader.addClass("card-header fw-bold");
  cardHeader.text(`${task.title}`);

  card.addClass("card mx-auto");
  card.append(cardHeader);
  card.append(cardBody);

  if (taskDate.isSame(today, "day")) {
    card.addClass("text-light bg-warning");
  } else if (taskDate.isBefore(today)) {
    card.addClass("text-light bg-danger");
    cardDeleteBtn.addClass("border border-white");
  }

  listItem.addClass("list-group-item w-75 border-0 p-0 m-3 mx-auto");
  listItem.append(card);

  $(task.location).append(listItem);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {}

// Todo: create a function to handle adding a new task
// TO DO LIST
function handleAddTask(event) {
  event.preventDefault();

  const task = {
    title: "",
    date: "",
    description: "",
    location: "#todo-cards-list",
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
    task.id = generateTaskId();

    // store data
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // generate task card and store toDoList
    createTaskCard(task);
    // toDoList.push(task);
    // localStorage.setItem("toDoList", JSON.stringify(toDoList));

    // clear form and turn off blind and task box
    clearForm();
    taskBox.hide();
    blind.hide();
  }

  return;
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  // event.preventDefault();
  $(this).closest("li").remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Todo: when the page loads, render the task list, add event listeners,
// make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  for (task of taskList) {
    createTaskCard(task);
  }
});

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
const clearForm = function () {
  $("#task-title").val("");
  $("#task-date").val("");
  $("#task-description").val("");
};

toDoCardsList.on("click", ".delete-item-btn", handleDeleteTask);
