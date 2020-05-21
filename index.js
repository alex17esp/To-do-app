// UI Selectors

const lightModeToggle = document.querySelector(".button--light--mode");
const listTitle = document.querySelector(".list--title");
const editTitleBtn = document.querySelector(".list--title--edit");
const listDragBtn = document.querySelector(".icon--drag");
const checkbox = document.querySelector(".list--item--checkbox");
const deleteTaskBtn = document.querySelector(".icon--remove");
// const addTaskBtn = document.querySelector(".list--item--add");
const listContainer = document.querySelector(".list--content--main");
const listCount = document.querySelector(".list--task--count");
const modal = document.querySelector(".list--title--modal");
let id = 0;

class Task {
  constructor() {
    this.name = "New Task";
    this.id = id++;
    this.checked = false;
  }
}

class UI {
  static displayTasks() {
    const tasks = Store.getTasks();

    tasks.forEach((task) => UI.addTaskToList(task));
  }

  static displayTasksCount() {
    const tasks = Store.getTasks();
    if (tasks.length === 0) {
      listCount.textContent = "No tasks left";
    } else if (tasks.length === 1) {
      listCount.textContent = `${tasks.length}/${tasks.length} task left`;
    } else {
      listCount.textContent = `${tasks.length}/${tasks.length} tasks left`;
    }
  }

  static addTaskToList(task) {
    let div = document.createElement("div");
    div.classList.add("list--item");

    div.innerHTML = `
    <img
      src="./assets/GoogleMaterial ic drag handle 48px.svg"
      alt=""
      srcset=""
      transform="rotate(45deg)"
      class="icon--drag"
    />
    <button class="list--item--checkbox">
      <img
        src="./assets/unchecked.svg"
        alt=""
        class="icon--empty--checkbox"
      />
    </button>
    <input type="text" class="list--item--name" value="${task.name}" />
    <button class="list--item--remove">
      <img src="./assets/close.svg" alt="" class="icon--remove" data-id="${task.id}"/>
    </button>
  `;
    listContainer.appendChild(div);
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
}

class Store {
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
      if (el.nextElementSibling.firstElementChild.dataset.id == index) {
        tasks[index].name = el.value;
      }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static clearTaskName(el) {
    const tasks = Store.getTasks();
    tasks.forEach((task, index) => {
      if (el.nextElementSibling.firstElementChild.dataset.id == index) {
        tasks[index].name = "";
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
}

// Events
// Display Tasks and list Count
document.addEventListener("DOMContentLoaded", () => {
  UI.displayTasks();
  UI.displayTasksCount();
  UI.displayTitle();
});

// Add a task
document.querySelector(".list--item--add").addEventListener("click", () => {
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
  modal.style.display = "flex";
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
    e.target.classList.toggle("checked");
    e.target.parentElement.parentElement.classList.toggle("checked");
    Store.taskCompleted(e.target);
  }
});
