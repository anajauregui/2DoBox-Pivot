//***********************************************************
//  objects
//***********************************************************
//This is a change
// the new idea card object
function Idea(title, body)  {
  this.title = title;
  this.body = body;
  this.importance = 'Normal';// default importance
  this.id = Date.now();// this creates a unique time stamp that will be used to identify an individual card by placing it in an article as the name of the ID
  this.isComplete = false;
}

//************************************************************
//  event listeners
//************************************************************

// on page load loops over local storage and appends each item to page
$(document).ready(function() { // fire on document load
	for (var i = 0; i < localStorage.length; i++) { // run for loop over entire length of local storage array
		prepend(JSON.parse(localStorage.getItem(localStorage.key(i)))); //get every item from local storage.  Parse each item.  Run the Append function on each item
	}
  completedList();
});
//Use show completed todo button to display completed todo's on top of
$('.show-completed').on('click', showCompletedTasks)

//Toggle completed task to-do for strike through
$('.card-container').on('click', '.completed-task', completeTask);

//trigger search functions on input
$('.search-input').on('input', filterList);

// enable save button on inputs
$('.input-container').on('input', enableSaveButton);

// save button capture input values and send to append function
$('.save-button').on('click', saveNewItem);

$(window).on('keyup', function(e) {
  if(e.keyCode === 13 && ($('.input-title').val() !== '') && ($('.input-body').val() !== '')){
    enableSaveButton13();
  }
});

$('.card-container').on('input keydown', '.idea-input', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    $(e.target).prop('contenteditable', false);
    $('.input-title').focus();
  }
});

// delete
$('.card-container').on('click', '.delete-button', deleteItem);

//  new input in exsisting title area save to storage
$('.card-container').on('keyup', '.idea-title', editTitle);

//  new input in exsisting body area save to storage
$('.card-container').on('keyup', '.idea-body', editTask);

// up arrow button change importance
$('.card-container').on('click', '.arrow-up', changeUpvoteImportance);

// down arrow button change importance
$('.card-container').on('click', '.arrow-down', changeDownvoteImportance);


function changeUpvoteImportance() {
  var id = $(this).parent().parent().prop('id');//get the unique id of this task card
  var parsedTask = JSON.parse(localStorage.getItem(id));//get this task card from storage and parse it
  var currentImportance = parsedTask.importance;//get the current importance of this task card
  // adjust the importance level based on the current importance
  if(currentImportance === 'None') {
    parsedTask.importance = 'Low'// change the object idea card's importance
    $(this).siblings('.importance-value').text('Low');// change the importance of the task card on the DOM
  } else if(currentImportance === 'Low') {
    parsedTask.importance = 'Normal'// change the object idea card's importance
    $(this).siblings('.importance-value').text('Normal');// change the importance of the task card on the DOM
  } else if(currentImportance === 'Normal') {
    parsedTask.importance = 'High' // change the object idea card's importance
    $(this).siblings('.importance-value').text('High'); // change the importance of the task card on the DOM
  } else if(currentImportance === 'High') {
    parsedTask.importance = 'Critical' // change the object idea card's importance
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
    parsedTask.importance = 'High'// change the object idea card's importance
    $(this).siblings('.importance-value').text('High');// change the importance of the task card on the DOM
  } else if(currentImportance === 'High') {
    parsedTask.importance = 'Normal'// change the object idea card's importance
    $(this).siblings('.importance-value').text('Normal');// change the importance of the task card on the DOM
  } else if(currentImportance === 'Normal') {
    parsedTask.importance = 'Low' // change the object idea card's importance
    $(this).siblings('.importance-value').text('Low'); // change the importance of the task card on the DOM
  } else if(currentImportance === 'Low') {
    parsedTask.importance = 'None' // change the object idea card's importance
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


//********************************************************************************
//   functions
//*********************************************************************************

//  prepend idea card to card container
function prepend(idea)  { // add the new idea card created on the save button event listener to the card section
  $('.card-container').prepend(`
    <article class='idea-card'id=${idea.id}>
      <input class='idea-title idea-input' value='${idea.title}'>
      <img class='completed-task' src='assets/success.png'>
      <button class='delete-button'></button>
      <textarea cols='30' rows='10' class='idea-body idea-input' type='text' value=''>${idea.body}</textarea>
      <section class='button-container'>
        <button class='arrow-up'></button>
        <button class='arrow-down'></button>
        <p class='importance'>importance:</p>
        <p class='importance-value'> ${idea.importance}</p>
      </section>
      <hr />
    </article>
    `)
}

function completeTask(complete) {
  var id = $(this).parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  var isComplete = parsedIdea.isComplete;
  if (isComplete === false) {
    $(this).parent().toggleClass('complete');
    parsedIdea.isComplete = true;
  }
    localStorage.setItem(id, JSON.stringify(parsedIdea))
}

function deleteItem() {
  var id = $(this).parent().prop('id');
  localStorage.removeItem(id);
  $(this).parent().remove();
};

function editTitle() {
  var id = $(this).parent().prop('id');//get the unique id of this idea card
	var parsedIdea = JSON.parse(localStorage.getItem(id))//get the current quality of this idea card
	parsedIdea.title = $(this).val()// update the value of the title field
	localStorage.setItem(id, JSON.stringify(parsedIdea))// return the updated object idea card to local storage
}

function editTask() {
  var id = $(this).parent().prop('id');//get the unique id of this idea card
	var parsedIdea = JSON.parse(localStorage.getItem(id))//get the current quality of this idea card
	parsedIdea.body = $(this).val() // update the value of the body field
	localStorage.setItem(id, JSON.stringify(parsedIdea))// return the updated object idea card to local storage
}

// enable save button on return
function enableSaveButton13()  {
  var title = $('.input-title').val();
  var body = $('.input-body').val();
  var idea = new Idea(title, body);// create a new Idea object and pass through the captured input and body values
    if (title === "" || body === "") {
      $('.save-button').prop('disabled', true)
  } else {$('.save-button').prop('disabled', false)
  prepend(idea); // add the new idea card to the card area
  clearInputFields();  // clear the user input and body values
  sendToStorage(idea); // set the item and stringify to local storage
  disableSaveButton();
  }
}

// enable save button
function enableSaveButton()  {
  var ideaTitle = $('.input-title').val();
  var ideaBody = $('.input-body').val();
      if (ideaTitle === "" || ideaBody === "") {
        $('.save-button').prop('disabled', true)
      } else { $('.save-button').prop('disabled', false)
  }
}

// disable save button
function disableSaveButton() {
  $('.save-button').prop('disabled', true)
}

// clear input fields
function clearInputFields() { //clear the title and body input fields
  $('.input-title').val('');
  $('.input-body').val('');
  $('.input-title').focus();
}

// send idea to local storage
function sendToStorage(idea)  {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

// get an idea card from storage by id
function getFromStorage(id) {
	var parsedIdea = JSON.parse(localStorage.getItem(id))
	return parsedIdea;
}

function getAllFromLocalStorage(){
  var allItems = [];
  for (var i = 0; i < localStorage.length; i++) {
    allItems.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
  return allItems;
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
  }
}

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

function saveNewItem() {
  var title = $('.input-title').val();// capture input value
  var body = $('.input-body').val();// capture body value
  var idea = new Idea(title, body);// create a new Idea object and pass thru the captured input and body values
  prepend(idea); // add the new idea card to the card area
  clearInputFields();  // clear the user input and body values
  sendToStorage(idea); // set the item and stringify to local storage
  disableSaveButton();
}
