// UI Selectors

const listContainer = document.querySelector(".list--content--main");
const listCount = document.querySelector(".list--task--count");
const modal = document.querySelector(".list--title--modal");

let id = 0;
let dragStartEl;
let lightMode = false;

class Task {
  constructor() {
    this.name = "New Task";
    this.id = id;
    this.checked = false;
  }
}

class UI {
  static getTheme() {
    localStorage.getItem("theme", JSON.parse(lightMode)) == "true"
      ? (lightMode = true)
      : (lightMode = false);

    if (lightMode) {
      document.body.classList.add("light");
    }
  }

  static displayTasks() {
    const tasks = Store.getTasks();

    tasks.forEach((task) => UI.addTaskToList(task));
  }

  static displayTasksCount() {
    const tasks = Store.getTasks();
    const completedTasks = tasks.filter((task) => task.checked === false);
    if (tasks.length === 0) {
      listCount.textContent = "No tasks left";
    } else if (tasks.length === 1) {
      listCount.textContent = `${completedTasks.length}/${tasks.length} task left`;
    } else {
      listCount.textContent = `${completedTasks.length}/${tasks.length} tasks left`;
    }
  }

  static addTaskToList(task) {
    let div = document.createElement("div");
    task.checked === false
      ? div.classList.add("list--item")
      : (div.className = "list--item checked");
    div.setAttribute("draggable", true);
    div.setAttribute("data-index", task.id);
    div.innerHTML = `
    <img
      src="./assets/${
        lightMode
          ? "light-GoogleMaterial ic drag handle 48px"
          : "GoogleMaterial ic drag handle 48px"
      }.svg"
      alt="drag task"
      srcset=""
      
      class="icon--drag"
    />
    <button class="list--item--checkbox ">
      <img
        src="./assets/${
          lightMode && task.checked === true
            ? "light-check-r"
            : lightMode && task.checked === false
            ? "light-unchecked"
            : !lightMode && task.checked === true
            ? "check-r"
            : "unchecked"
        }.svg"
        alt="task status"
        class="icon--empty--checkbox"
      />
    </button>
    <input type="text" class="list--item--name" value="${task.name}" />
    <button class="list--item--remove">
      <img src="./assets/${
        lightMode ? "light-close" : "close"
      }.svg" alt="delete task" class="icon--remove" data-id="${task.id}"/>
    </button>
  `;
    listContainer.appendChild(div);

    // UI.addEventListeners();
  }

  static deleteTask(el) {
    if (el.classList.contains("icon--remove")) {
      el.parentElement.parentElement.remove();
    }
  }

  static removeTaskList() {
    const taskList = document.querySelectorAll(".list--item");
    const taskListArr = [...taskList];
    taskListArr.forEach((task) => task.remove());
  }

  static displayTitle() {
    const title = Store.getTitleName();
    const listTitle = document.querySelector(".list--title");
    listTitle.textContent = title;
  }

  static updateTitleDisplay(title) {
    document.querySelector(".list--title").textContent = title;
    document.querySelector(".modal--list--title").textContent = title;
  }

  static showTaskCompleted(el) {
    const tasks = Store.getTasks();
    tasks.forEach((task) => {
      if (
        el.parentElement.nextElementSibling.nextElementSibling.firstElementChild
          .dataset.id == task.id &&
        task.checked === true
      ) {
        el.classList.add("checked");
        el.src = `./assets/${lightMode ? "light-check-r" : "check-r"}.svg`;
        el.parentElement.parentElement.classList.add("checked");
      } else if (
        el.parentElement.nextElementSibling.nextElementSibling.firstElementChild
          .dataset.id == task.id &&
        task.checked === false
      ) {
        el.classList.remove("checked");
        el.parentElement.parentElement.classList.remove("checked");
        el.src = `./assets/${lightMode ? "light-unchecked" : "unchecked"}.svg`;
      }
    });
  }

  // static addEventListeners() {
  //   console.log("dragstart");
  // }
}

class Store {
  static getId() {
    const tasks = Store.getTasks();
    if (tasks === null || tasks.length === 0) {
      id = 0;
    } else {
      id = tasks[tasks.length - 1].id + 1;
    }
  }
  static getTasks() {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    return tasks;
  }

  static addTask(task) {
    const tasks = Store.getTasks();
    Store.getId();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static removeTask(el) {
    const tasks = Store.getTasks();
    tasks.forEach((task, index) => {
      if (el.dataset.id == task.id) {
        tasks.splice(index, 1);
      }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static changeTaskName(el) {
    const tasks = Store.getTasks();
    tasks.forEach((task, index) => {
      if (el.nextElementSibling.firstElementChild.dataset.id == task.id) {
        task.name = el.value;
      }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static clearTaskName(el) {
    const tasks = Store.getTasks();
    tasks.forEach((task, index) => {
      if (el.nextElementSibling.firstElementChild.dataset.id == task.id) {
        task.name = "";
        el.value = "";
      }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static clearTaskList() {
    localStorage.clear("tasks");
  }

  static getTitleName() {
    let title;
    if (localStorage.getItem("title") === null) {
      title = "New List";
    } else {
      title = JSON.parse(localStorage.getItem("title"));
    }

    return title;
  }

  static changeTitleName(input) {
    let title = Store.getTitleName();
    title = input;
    localStorage.setItem("title", input);
  }

  static updateTitleStorage(input) {
    localStorage.setItem("title", JSON.stringify(input));
  }

  static taskCompletedToggle(el) {
    const tasks = Store.getTasks();
    tasks.forEach((task) => {
      if (
        el.parentElement.nextElementSibling.nextElementSibling.firstElementChild
          .dataset.id == task.id &&
        task.checked === false
      ) {
        task.checked = true;
      } else if (
        el.parentElement.nextElementSibling.nextElementSibling.firstElementChild
          .dataset.id == task.id &&
        task.checked === true
      ) {
        task.checked = false;
      }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static storeTheme(lightMode) {
    localStorage.setItem("theme", JSON.stringify(lightMode));
  }
}

// Events
// Display Tasks and list Count
document.addEventListener("DOMContentLoaded", () => {
  Store.getId();
  UI.getTheme();
  UI.displayTasks();
  UI.displayTasksCount();
  UI.displayTitle();
});

// Add a task
document.querySelector(".list--item--add").addEventListener("click", () => {
  Store.getId();
  const task = new Task();
  UI.addTaskToList(task);
  Store.addTask(task);
  UI.displayTasksCount();
});

// Remove task
listContainer.addEventListener("click", (e) => {
  UI.deleteTask(e.target);
  Store.removeTask(e.target);
  UI.displayTasksCount();
});

// Change Task Name

listContainer.addEventListener("focusin", (e) => {
  if (
    e.target.classList.contains("list--item--name") &&
    e.target.value === "New Task"
  ) {
    Store.clearTaskName(e.target);
  }
});

listContainer.addEventListener("change", (e) => {
  if (e.target.classList.contains("list--item--name")) {
    Store.changeTaskName(e.target);
  }
});

// Clear taskList
document
  .querySelector(".button--navbar--delete")
  .addEventListener("click", () => {
    Store.clearTaskList();
    UI.removeTaskList();
    UI.displayTasksCount();
  });

document.querySelector(".list--title--edit").addEventListener("click", () => {
  document.querySelector(".icon--remove").src = `./assets/${
    lightMode ? "light-close" : "close"
  }.svg`;
  modal.style.display = "flex";
  document.querySelector(".title--input").focus();
});

document.querySelector(".icon--remove").addEventListener("click", () => {
  modal.style.display = "none";
});
document.querySelector(".modal--confirm").addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target == modal) modal.style.display = "none";
});

document.querySelector(".title--input").addEventListener("input", (e) => {
  Store.updateTitleStorage(e.target.value);
  UI.updateTitleDisplay(e.target.value);
});

listContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("icon--empty--checkbox")) {
    Store.taskCompletedToggle(e.target);
    UI.showTaskCompleted(e.target);
    UI.displayTasksCount();
  }
});

// Drag And Drop

listContainer.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("list--item")) {
    dragStart(e);
    listContainer.addEventListener("dragover", dragOver);
    listContainer.addEventListener("drop", dragDrop);
    listContainer.addEventListener("dragenter", dragEnter);
    listContainer.addEventListener("dragleave", dragLeave);
  }
});

function dragStart(e) {
  // console.log("dragStart");
  dragStartEl = e.target.closest("div");
}

function dragEnter(e) {
  // console.log("dragENter");
  e.target.classList.add("over");
}

function dragLeave(e) {
  // console.log("dragLeave");
  e.target.closest("div").classList.remove("over");
}

function dragOver(e) {
  // // console.log(e);
  e.target.closest("div").classList.add("over");
  e.preventDefault();
}

function dragDrop(e) {
  e.target.closest("div").classList.remove("over");

  const dragEndEl = e.target.closest("div");
  const tasks = Store.getTasks();

  const startIndex = tasks.findIndex(
    (task) => task.id === +dragStartEl.dataset.index
  );
  const endIndex = tasks.findIndex(
    (task) => task.id === +dragEndEl.dataset.index
  );

  [tasks[startIndex], tasks[endIndex]] = [tasks[endIndex], tasks[startIndex]];

  localStorage.setItem("tasks", JSON.stringify(tasks));
  listContainer.innerHTML = "";
  UI.displayTasks();

  // dragEndEl.replaceWith(dragStartEl);
  // temp.replaceWith(dragStartEl);
}

document.querySelector(".button--light--mode").addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.body.classList.contains("light")
    ? (lightMode = true)
    : (lightMode = false);

  listContainer.innerHTML = "";
  UI.displayTasks();
  Store.storeTheme(lightMode);
  // document
  //   .querySelectorAll("img")
  //   .forEach((img) => (img.src = `dark-${img.name}`));
});
