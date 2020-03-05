const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoCompleteAll = document.getElementById("todo-completely-all");
const todoListFooter = document.getElementById("todo-list-footer");
const clearCompleted = document.getElementById("clear-completed-btn");

let remainTodoCount = 0;

todoForm.onsubmit = e => {
  e.preventDefault();

  if (todoInput.value == "") {
    return;
  }

  const elem = createTodoElement();
  todoList.appendChild(elem);
  todoInput.value = "";
  
  onAddTodo(elem);
};

todoCompleteAll.onclick = e => {
  for (let i = 0; i < todoList.childElementCount; i++) {
    const checkbox = todoList.children[i].getElementsByTagName("input")[0];
    if (e.target.checked && checkbox.checked) {
      continue;
    }
    
    checkbox.checked = e.target.checked;
    
    // NOTE : checked를 변경해주는 것 만으로는 onchange이벤트가 발생하지 않기 때문에 추가
    //        추후 좀 더 리서치 후 정리 필요
    const event = new Event("change");
    checkbox.dispatchEvent(event);
  }
};

clearCompleted.onclick = e => {
  const completedList = todoList.getElementsByClassName("complete");
  if (completedList.length < 0) {
    return;
  }

  for (let i = completedList.length - 1; i >= 0; i--) {
    completedList[i].remove();
  }

  if (!todoList.hasChildNodes()) {
    todoCompleteAll.classList.remove("visible");
    todoListFooter.style.display = "none";
  }
};

const createTodoElement = () => {
  const uuid = new Date().getTime();
  
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.id = "check-" + uuid;
  checkBox.onchange = e => {
    if (e.target.checked) {
      --remainTodoCount;
      e.target.parentNode.classList.add("complete");

      if (!todoCompleteAll.checked && isCompleteAll()) {
        todoCompleteAll.checked = true;
      }
    } else {
      ++remainTodoCount;
      e.target.parentNode.classList.remove("complete");
      todoCompleteAll.checked = false;
    }

    refreshRemainTodo();
  };

  const checkboxLabel = document.createElement("label");
  checkboxLabel.setAttribute("for", "check-" + uuid);

  const content = document.createElement("label");
  content.innerText = todoInput.value;
  content.id = "todo-content";

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("todo-content-remove");
  removeBtn.innerText = "×";
  removeBtn.onclick = e => {
    const removedElem = todoList.removeChild(e.target.parentNode);
    onRemoveTodo(removedElem);
  };

  const elem = document.createElement("li");
  elem.id = uuid;
  elem.appendChild(checkBox);
  elem.appendChild(checkboxLabel);
  elem.appendChild(content);
  elem.appendChild(removeBtn);

  return elem;
};

const onAddTodo = elem => {
  if (todoList.childElementCount == 1) {
    todoCompleteAll.classList.add("visible");
    todoListFooter.style.display = "block";
  }

  todoCompleteAll.checked = false;

  ++remainTodoCount;
  refreshRemainTodo();
};

const onRemoveTodo = elem => {
  if (!todoList.hasChildNodes()) {
    todoCompleteAll.classList.remove("visible");
    todoListFooter.style.display = "none";
    remainTodoCount = 0;
    return;
  }

  if (!elem.classList.contains("complete")) {
      todoCompleteAll.checked = isCompleteAll();
      --remainTodoCount;
  }

  refreshRemainTodo();
};

const refreshRemainTodo = () => {
  if (!todoList.hasChildNodes()) {
    return;
  }

  const leftCount = todoListFooter.getElementsByTagName("span")[0];
  const str = remainTodoCount > 1 ? " items left" : " item left";
  leftCount.innerText = remainTodoCount + str;
};

const isCompleteAll = () => {
  for (let i = 0; i < todoList.childElementCount; i++) {
    if (!todoList.children[i].classList.contains("complete")) {
      return false;
    }
  }
  return true;
}
