//***********************************************************
//  objects
//***********************************************************

function Task(title, body)  {
  this.title = title;
  this.body = body;
  this.importance = 'Normal';
  this.id = Date.now();
  this.isComplete = false;
}

//************************************************************
//  event listeners
//************************************************************

loadPage();

$('.show-completed').on('click', showCompletedTasks)

$('.card-container').on('click', '.completed-task', completeTask);

$('.search-input').on('input', filterList);

$('.input-container').on('input', enableSaveButton);

$('.save-button').on('click', saveNewItem);

$(window).on('keyup', enterSave)

$('.card-container').on('input keydown', '.task-input', enterEdit)

$('.card-container').on('click', '.delete-button', deleteItem);

$('.card-container').on('keyup', '.task-title', editTitle);

$('.card-container').on('keyup', '.task-body', editTask);

$('.card-container').on('click', '.arrow-up', changeUpvoteImportance);

$('.card-container').on('click', '.arrow-down', changeDownvoteImportance);

$('.critical-importance').on('click', filterCritical);

$('.high-importance').on('click', filterHigh);

$('.normal-importance').on('click', filterNormal);

$('.low-importance').on('click', filterLow);

$('.no-importance').on('click', filterNone);

//********************************************************************************
//   functions
//*********************************************************************************

function prepend(task)  {
  $('.card-container').prepend(`
    <article class='task-card'id=${task.id}>
      <input class='task-title task-input' value='${task.title}'>
      <button class='delete-button'></button>
      <textarea cols='30' rows='10' class='task-body task-input' type='text' value=''>${task.body}</textarea>
      <section class='button-container'>
        <button class='arrow-up'></button>
        <button class='arrow-down'></button>
        <p class='importance'>Importance:&nbsp</p>
        <p class='importance-value'> ${task.importance}</p>
        <button class='completed-task'>Completed Task</button>
      </section>
      <hr />
    </article>
    `)
}

function completeTask(complete) {
  var id = $(this).parent().prop('id');
  var parsedTask = JSON.parse(localStorage.getItem(id));
  var isComplete = parsedTask.isComplete;
  if (isComplete === false) {
    $(this).parent().addClass('complete');
    parsedTask.isComplete = true;
  }
    localStorage.setItem(id, JSON.stringify(parsedTask))
    // enableShowCompleteBtn();
}

function deleteItem() {
  var id = $(this).parent().prop('id');
  localStorage.removeItem(id);
  $(this).parent().remove();
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

// enable save button on return
function enableSaveButton13()  {
  var title = $('.input-title').val();
  var body = $('.input-body').val();
  var task = new Task(title, body);// create a new Task object and pass through the captured input and body values
    if (title === "" || body === "") {
      $('.save-button').prop('disabled', true)
  } else {$('.save-button').prop('disabled', false)
  prepend(task); // add the new task card to the card area
  clearInputFields();  // clear the user input and body values
  sendToStorage(task); // set the item and stringify to local storage
  disableSaveButton();
  }
}

// enable save button
function enableSaveButton()  {
  var taskTitle = $('.input-title').val();
  var taskBody = $('.input-body').val();
      if (taskTitle === "" || taskBody === "") {
        $('.save-button').prop('disabled', true)
      } else { $('.save-button').prop('disabled', false)
  }
}

// function enableShowCompleteBtn() {
//   console.log('function might be working');
//   var filteredList = [];
//   var fullList = getAllFromLocalStorage();
//   var targetTask = $('.card-container').find('.completed-task').hasClass('completed');
//   filteredList = fullList.filter(function() {
//     console.log($('.card-container').find('.completed-task').hasClass('completed'));
//     return (targetTask === true);
//   })
//   if (filteredList.length > 0) {
//     $('.show-completed').prop('disabled', false);
//   } else {
//     $('.show-completed').prop('disabled', true);
//   }
// }

// edit title or body upon pressing enter key
function enterEdit(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    $(e.target).prop('contenteditable', false);
    $('.input-title').focus();
  }
}

// save task upon pressing enter key
function enterSave(e) {
  if(e.keyCode === 13 && ($('.input-title').val() !== '') && ($('.input-body').val() !== '')){
    enableSaveButton13();
  }
}

// disable save button
function disableSaveButton() {
  $('.save-button').prop('disabled', true)
}

function disableShowCompleteBtn() {
  $('.show-completed').prop('disabled', true)
}

// clear input fields
function clearInputFields() { //clear the title and body input fields
  $('.input-title').val('');
  $('.input-body').val('');
  $('.input-title').focus();
}

// send task to local storage
function sendToStorage(task)  {
  localStorage.setItem(task.id, JSON.stringify(task));
}

// get an task card from storage by id
function getFromStorage(id) {
	var parsedTask = JSON.parse(localStorage.getItem(id))
	return parsedTask;
}

function getAllFromLocalStorage(){
  var allItems = [];
  for (var i = 0; i < localStorage.length; i++) {
    allItems.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
  return allItems;
}


// *****************************************************************************
//This is a test function to show what we will need to implement to have only 10 most recent tasks appear on the page. to start from the end need to use a (- integer)
function test(){
  var array = [];
  var limitList = getAllFromLocalStorage();
array = limitList.slice(0,11);
  return array;
}
// *****************************************************************************

// Filter by different importance levels

function filterCritical() {
  console.log('clicked');
  var newList = [];
  var wholeList = getAllFromLocalStorage();
  newList = wholeList.filter(function(task) {
    return task.importance === 'Critical';
  })
  if (newList.length > 0) {
    displaySearchResults(newList);
  }
}

function filterHigh() {
  console.log('clicked');
  var newList = [];
  var wholeList = getAllFromLocalStorage();
  newList = wholeList.filter(function(task) {
    return task.importance === 'High';
  })
  if (newList.length > 0) {
    displaySearchResults(newList);
  }
}

function filterNormal() {
  console.log('clicked');
  var newList = [];
  var wholeList = getAllFromLocalStorage();
  newList = wholeList.filter(function(task) {
    return task.importance === 'Normal';
  })
  if (newList.length > 0) {
    displaySearchResults(newList);
  }
}

function filterLow() {
  console.log('clicked');
  var newList = [];
  var wholeList = getAllFromLocalStorage();
  newList = wholeList.filter(function(task) {
    return task.importance === 'Low';
  })
  if (newList.length > 0) {
    displaySearchResults(newList);
  }
}

function filterNone() {
  console.log('clicked');
  var newList = [];
  var wholeList = getAllFromLocalStorage();
  newList = wholeList.filter(function(task) {
    return task.importance === 'None';
  })
  if (newList.length > 0) {
    displaySearchResults(newList);
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

function showCompletedTasks() {
  var filterCompleteList = [];
  var fullList = getAllFromLocalStorage();
  filterCompleteList = fullList.filter(function(item) {
    return item.isComplete === true;
  })
  if (filterCompleteList.length > 0) {
      AllDisplaySearchResults(filterCompleteList);
      disableShowCompleteBtn();
  }
}

// function addCompletedClass(item) {
//   $(item).addClass('complete');
// }

function AllDisplaySearchResults(searchResults) {
  $('.card-container').prepend();
  searchResults.forEach(function(item) {
    prepend(item);
  })
}

function displaySearchResults(searchResults) {
  $('.card-container').empty();
  searchResults.forEach(function(item) {
    prepend(item);
  })
}

function loadPage() {
  for (var i = 0; i < localStorage.length; i++) { // run for loop over entire length of local storage array
		prepend(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
  completedList();
}



function saveNewItem() {
  var title = $('.input-title').val();// capture input value
  var body = $('.input-body').val();// capture body value
  var task = new Task(title, body);// create a new Task object and pass thru the captured input and body values
  prepend(task); // add the new task card to the card area
  clearInputFields();  // clear the user input and body values
  sendToStorage(task); // set the item and stringify to local storage
  disableSaveButton();
}

function changeUpvoteImportance() {
  var id = $(this).parent().parent().prop('id');//get the unique id of this task card
  var parsedTask = JSON.parse(localStorage.getItem(id));//get this task card from storage and parse it
  var currentImportance = parsedTask.importance;//get the current importance of this task card
  // adjust the importance level based on the current importance
  if(currentImportance === 'None') {
    parsedTask.importance = 'Low'// change the object task card's importance
    $(this).siblings('.importance-value').text('Low');// change the importance of the task card on the DOM
  } else if(currentImportance === 'Low') {
    parsedTask.importance = 'Normal'// change the object task card's importance
    $(this).siblings('.importance-value').text('Normal');// change the importance of the task card on the DOM
  } else if(currentImportance === 'Normal') {
    parsedTask.importance = 'High' // change the object task card's importance
    $(this).siblings('.importance-value').text('High'); // change the importance of the task card on the DOM
  } else if(currentImportance === 'High') {
    parsedTask.importance = 'Critical' // change the object task card's importance
    $(this).siblings('.importance-value').text('Critical'); // change the importance of the task card on the DOM
  }
  localStorage.setItem(id, JSON.stringify(parsedTask));// return the updated object task card to local storage
}

function changeDownvoteImportance() {
  var id = $(this).parent().parent().prop('id');//get the unique id of this task card
  var parsedTask = JSON.parse(localStorage.getItem(id));//get this task card from storage and parse it
  var currentImportance = parsedTask.importance;//get the current importance of this task card
  // adjust the importance level based on the current importance
  if(currentImportance === 'Critical') {
    parsedTask.importance = 'High'// change the object task card's importance
    $(this).siblings('.importance-value').text('High');// change the importance of the task card on the DOM
  } else if(currentImportance === 'High') {
    parsedTask.importance = 'Normal'// change the object task card's importance
    $(this).siblings('.importance-value').text('Normal');// change the importance of the task card on the DOM
  } else if(currentImportance === 'Normal') {
    parsedTask.importance = 'Low' // change the object task card's importance
    $(this).siblings('.importance-value').text('Low'); // change the importance of the task card on the DOM
  } else if(currentImportance === 'Low') {
    parsedTask.importance = 'None' // change the object task card's importance
    $(this).siblings('.importance-value').text('None'); // change the importance of the task card on the DOM
  }
  localStorage.setItem(id, JSON.stringify(parsedTask));// return the updated object task card to local storage
}

// function switchUpvote(currentImportance) {
//   console.log('parsedTask current importance: ' + currentImportance);
//   switch (currentImportance) {
//     case 'None':
//       currentImportance = 'Low';
//       $(this).find('.importance-value').text('Low');
//       break;
//     case 'Low':
//       currentImportance = 'Normal';
//       $(this).find('.importance-value').text('Normal');
//       break;
//     case 'Normal':
//       currentImportance = 'High';
//       $(this).find('.importance-value').text('High');
//       break;
//     case 'High':
//       currentImportance = 'Critical';
//       $(this).find('.importance-value').text('Critical');
//       break;
//     default:
//       console.log(($(this).find('.importance-value')));
//       console.log('switch is not working');
//       break;
//   }
// }
