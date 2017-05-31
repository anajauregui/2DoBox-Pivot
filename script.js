loadPage();

function Task(title, body)  {
  this.title = title;
  this.body = body;
  this.importance = 'Normal';
  this.id = Date.now();
  this.isComplete = false;
}


$('.card-container')
  .on('input keydown', '.task-input', enterEdit)
  .on('click', '.delete-button', deleteItem)
  .on('keyup', '.task-title', editTitle)
  .on('keyup', '.task-body', editTask)
  .on('click', '.arrow-up', changeUpvote)
  .on('click', '.arrow-down', changeDownvote)
  .on('click', '.completed-task', completeTask);

$('.critical-importance').on('click', filterImportance);
$('.high-importance').on('click', filterImportance);
$('.normal-importance').on('click', filterImportance);
$('.low-importance').on('click', filterImportance);
$('.no-importance').on('click', filterImportance);

$('.input-container').on('input', enableSaveButton);
$('.save-button').on('click', saveNewItem);
$('.search-input').on('input', filterList);
$('.show-completed').on('click', showCompletedTasks)
$('.show-more').on('click', completedList);
$(window).on('keyup', enterSave)


function changeDownvote() {
  var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  var id = $(this).parent().parent().prop('id');
  var parsedTask = JSON.parse(localStorage.getItem(id));
  var currentImportance = $(this).siblings('.importance-value').text();
  var index = importanceArray.indexOf(currentImportance);
  $(this).siblings('.importance-value').text(importanceArray[index - 1]);
  parsedTask.importance = $(this).siblings('.importance-value').text();
  localStorage.setItem(id, JSON.stringify(parsedTask));
}

function changeUpvote() {
  var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  var id = $(this).parent().parent().prop('id');
  var parsedTask = JSON.parse(localStorage.getItem(id));
  var currentImportance = $(this).siblings('.importance-value').text();
  var index = importanceArray.indexOf(currentImportance);
  $(this).siblings('.importance-value').text(importanceArray[index + 1]);
  parsedTask.importance = $(this).siblings('.importance-value').text();
  localStorage.setItem(id, JSON.stringify(parsedTask));
}

function clearInputFields() {
  $('.input-title').val('');
  $('.input-body').val('');
  $('.input-title').focus();
}

function completedList() {
  var filterCompleteList = [];
  var fullList = getAllFromLocalStorage();
  filterCompleteList = fullList.filter(function(item) {
    return item.isComplete === false;
  })
  if (filterCompleteList.length > 0) {
    displaySearchResults(filterCompleteList);
  }
}

function completeTask(complete) {
  var id = $(this).closest('article').prop('id');
  var parsedTask = JSON.parse(localStorage.getItem(id));
  var isComplete = parsedTask.isComplete;
    $(this).closest('article').toggleClass('complete');
    parsedTask.isComplete = !parsedTask.isComplete;
    localStorage.setItem(id, JSON.stringify(parsedTask))
    enableShowCompleteBtn();
}

function deleteItem() {
  var id = $(this).parent().prop('id');
  localStorage.removeItem(id);
  $(this).parent().remove();
  loadPage();
};

function editTitle() {
  var id = $(this).parent().prop('id');
	var parsedTask = JSON.parse(localStorage.getItem(id))
	parsedTask.title = $(this).val()
	localStorage.setItem(id, JSON.stringify(parsedTask))
}

function editTask() {
  var id = $(this).parent().prop('id');
	var parsedTask = JSON.parse(localStorage.getItem(id))
	parsedTask.body = $(this).val()
	localStorage.setItem(id, JSON.stringify(parsedTask))
}

function enableSaveButton13()  {
  var title = $('.input-title').val();
  var body = $('.input-body').val();
  var task = new Task(title, body);
    if (title === "" || body === "") {
      $('.save-button').prop('disabled', true)
  } else {$('.save-button').prop('disabled', false)
  prepend(task);
  clearInputFields();
  sendToStorage(task);
  disableSaveButton();
  }
}

function enableSaveButton()  {
  var taskTitle = $('.input-title').val();
  var taskBody = $('.input-body').val();
      if (taskTitle === "" || taskBody === "") {
        $('.save-button').prop('disabled', true)
      } else { $('.save-button').prop('disabled', false)
  }
}

function enableShowCompleteBtn() {
  $('.show-completed').prop('disabled', false)
}

function enterEdit(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    $(e.target).prop('contenteditable', false);
    $('.input-title').focus();
  }
}

function enterSave(e) {
  if(e.keyCode === 13 && ($('.input-title').val() !== '') && ($('.input-body').val() !== '')){
    enableSaveButton13();
  }
}

function disableSaveButton() {
  $('.save-button').prop('disabled', true)
}

function disableShowCompleteBtn() {
  $('.show-completed').prop('disabled', true)
}

function displayCompletedTaskResults(taskResults) {
  taskResults.forEach(function(item) {
    prepend(item);
  });
}

function displaySearchResults(searchResults) {
  $('.card-container').empty();
  searchResults.forEach(function(item) {
    prepend(item);
  });
}

function filterImportance() {
  var newList = [];
  var buttonText = $(this).text();
  var wholeList = getAllFromLocalStorage();
  newList = wholeList.filter(function(task) {
    return task.importance === buttonText;
  })
  if (newList.length > 0) {
    displaySearchResults(newList);
  } else {
    $('.card-container').empty();
  }
}

function filterList(){
  var filteredList = [];
  var searchText = $('.search-input').val().toUpperCase();
  var fullList = getAllFromLocalStorage();
  filteredList = fullList.filter(function(item){
    return item.title.toUpperCase().includes(searchText) || item.body.toUpperCase().includes(searchText)
  })
  if (filteredList.length > 0) {
    displaySearchResults(filteredList);
  }
}

function getAllFromLocalStorage(){
  var allItems = [];
  for (var i = 0; i < localStorage.length; i++) {
    allItems.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
  return allItems;
}

function getFromStorage(id) {
	var parsedTask = JSON.parse(localStorage.getItem(id))
	return parsedTask;
}

function loadPage() {
  for (var i = 0; i < localStorage.length; i++) {
    prepend(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
  completedList();
  showTenTasks();
}

function prepend(task)  {
  if (task.isComplete) {
    var completeTask = 'complete';
  }
  $('.card-container').prepend(`
    <article class='task-card ${completeTask}'id=${task.id}>
    <input class='task-title task-input' value='${task.title}'>
    <button class='delete-button'></button>
    <textarea cols='30' rows='10' class='task-body task-input' type='text' value=''>${task.body}</textarea>
    <section class='button-container'>
    <button class='arrow-up'></button>
    <button class='arrow-down'></button>
    <p class='importance'>Importance:&nbsp</p>
    <p class='importance-value'>${task.importance}</p>
    <button class='completed-task'>Completed Task</button>
    </section>
    <hr />
    </article>
    `)
  }

  function saveNewItem() {
    var title = $('.input-title').val();
    var body = $('.input-body').val();
    var task = new Task(title, body);
    prepend(task);
    clearInputFields();
    sendToStorage(task);
    disableSaveButton();
  }

function sendToStorage(task)  {
  localStorage.setItem(task.id, JSON.stringify(task));
}

function showCompletedTasks() {
  var filterCompleteList = [];
  var fullList = getAllFromLocalStorage();
  filterCompleteList = fullList.filter(function(item) {
    return item.isComplete === true;
  })
  if (filterCompleteList.length > 0) {
      loadPage();
      displayCompletedTaskResults(filterCompleteList);
      disableShowCompleteBtn();
  }
}

function showTenTasks() {
  $('.task-card').slice(10).hide();
}
