//***********************************************************
//  objects
//***********************************************************
//This is a change
// the new idea card object
function Idea(title, body)  {
  this.title = title;
  this.body = body;
  this.quality = 'Swill';// default quality
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

// up arrow button change quality
$('.card-container').on('click', '.arrow-up',  function() {
  var id = $(this).parent().parent().prop('id');//get the unique id of this idea card
  var parsedIdea = JSON.parse(localStorage.getItem(id));//get this idea card from storage and parse it
  var currentQuality = parsedIdea.quality;//get the current quality of this idea card
  // adjust the quality based on the current quality
  if(currentQuality === 'Swill') {
    parsedIdea.quality = 'Plausible'// change the object idea cards quality
    $(this).siblings('.quality-value').text('Plausible');// change the quality of the idea card on the DOM
  }
  else if(currentQuality === 'Plausible') {
    parsedIdea.quality = 'Genius'// change the object idea cards quality
    $(this).siblings('.quality-value').text('Genius');// change the quality of the idea card on the DOM
  }
  localStorage.setItem(id, JSON.stringify(parsedIdea));// return the updated object idea card to local storage
})

// down arrow button change quality
$('.card-container').on('click', '.arrow-down',  function() {
  var id = $(this).parent().parent().prop('id');//get the unique id of this idea card
  var parsedIdea = JSON.parse(localStorage.getItem(id));//get this idea card from storage and parse it
  var currentQuality = parsedIdea.quality;//get the current quality of this idea card
  // adjust the quality based on the current quality
  if(currentQuality === 'Genius') {
    parsedIdea.quality = 'Plausible'// change the object idea cards quality
    $(this).siblings('.quality-value').text('Plausible');// change the quality of the idea card on the DOM
  }
  else if(currentQuality === 'Plausible') {
    parsedIdea.quality = 'Swill'// change the object idea cards quality
    $(this).siblings('.quality-value').text('Swill');// change the quality of the idea card on the DOM
  }
  localStorage.setItem(id, JSON.stringify(parsedIdea));// return the updated object idea card to local storage
})

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
        <p class='quality'>quality:</p>
        <p class='quality-value'> ${idea.quality}</p>
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
