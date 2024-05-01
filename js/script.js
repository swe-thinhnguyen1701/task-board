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
const taskForm = $("#task-form");
const addTask = $("#add-task");
const toDoList = $("#todo-cards-list");
const inProgressList = $("#in-progress-cards-list");
const doneList = $("#done-cards-list");
const today = dayjs();

// Todo: create a function to generate a unique task id
/**
 * generateTaskId create a unique id
 *
 * @returns a unique ID
 */
function generateTaskId() {
  let id = Math.floor(Math.random() * 900000) + 100000;
  while (nextId.includes(id)) {
    id = Math.floor(Math.random() * 900000) + 100000;
  }
  nextId.push(id);
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return id;
}

// Todo: create a function to create a task card
/**
 * createTaskCard generates a task card and puts into a correct list based on its location
 *
 * @param {object} task will be display as a card on browser
 */
function createTaskCard(task) {
  const taskDate = dayjs(task.date, "MM/DD/YYYY");

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

  if (taskDate.isSame(today, "day") && task.location !== "#done-cards-list") {
    card.addClass("text-light bg-warning");
  } else if (taskDate.isBefore(today) && task.location !== "#done-cards-list") {
    card.addClass("text-light bg-danger");
    cardDeleteBtn.addClass("border border-white");
  }

  listItem.addClass("list-group-item w-75 border-0 p-0 m-3 mx-auto task-card");
  listItem.attr("id", task.id);
  listItem.append(card);

  $(task.location).append(listItem);
}

// Todo: create a function to render the task list and make cards draggable
/**
 * renderTaskList connect all 3 list and allow items to be dragged and dropped into 3 lists.
 */
function renderTaskList() {
  $("#todo-cards-list, #in-progress-cards-list, #done-cards-list")
    .sortable({
      connectWith: ".connectedSortable",
      update: handleDrop,
    })
    .disableSelection();
}

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

    // clear form and turn off blind and task box
    clearForm();

    taskForm.modal("hide");
  }

  return;
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = parseInt($(event.target).closest("li").attr("id"));
  console.log(taskId);
  taskList = taskList.filter(function (task) {
    return task.id !== taskId;
  });
  nextId = nextId.filter(function (id) {
    return id !== taskId;
  });

  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
  $(this).closest("li").remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = parseInt(ui.item.attr("id"));
  const taskObj = taskList.find(function (task) {
    return task.id === taskId;
  });

  const prevLocation = taskObj.location;
  const newLocation = $(event.target).attr("id");
  taskObj.location = `#${newLocation}`;
  console.log("Test");

  // console.log($(`#${newLocation}`));
  console.log(newLocation === "done-cards-list");

  if (newLocation === "done-cards-list") {
    $(`#${taskId} div`).removeClass("bg-danger bg-warning text-light");
  } else {
    if (prevLocation === "#done-cards-list") {
      const date = dayjs(taskObj.date, "MM/DD/YYYY")
      if (date.isSame(today, "day")) {
        $(`#${taskId} div`).addClass("text-light bg-warning");
      } else if (date.isBefore(today)) {
        $(`#${taskId} div`).addClass("text-light bg-danger");
      }
    }
  }

  localStorage.setItem("tasks", JSON.stringify(taskList));
  // console.log(taskObj);
}

// Todo: when the page loads, render the task list, add event listeners,
// make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  $("#task-date").datepicker();

  addTask.on("click", handleAddTask);
  for (task of taskList) {
    createTaskCard(task);
  }

  renderTaskList();
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

toDoList.on("click", ".delete-item-btn", handleDeleteTask);
inProgressList.on("click", ".delete-item-btn", handleDeleteTask);
doneList.on("click", ".delete-item-btn", handleDeleteTask);
