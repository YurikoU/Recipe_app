// https://rapidapi.com/spoonacular/api/recipe-food-nutrition/
//API call header
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '723127a008msh5f0756979223977p1cc23djsnf7870823e43b',
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
  }
};

var container = document.querySelector('section#indexSection > div.container > div');
var searchBtn = document.querySelector('nav button.btn');
var searchInputText;

//Default recipe list
window.addEventListener('load', (e) => {
  searchInputText = 'summer';
  getRecipes();
});

//Once a user enter some term and click the button, fetch the applicable recipes from the API
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  searchInputText = document.querySelector('nav input').value.replace(" ", "%20");
  document.querySelector('nav input').value = '';
  getRecipes();
});

//Fetch JSON data from recipe API based on the user API
function getRecipes() {
  removeOldCardElements();
  fetch(`https://${options.headers["X-RapidAPI-Host"]}/recipes/random?tags=${searchInputText}&number=20`, options)
    .then(response => response.json())
    .then(jsonData => {
      // console.log(container)
      // console.log(jsonData)
      createNewCardElements(jsonData);
    })
    .catch((error) => console.error('Fail to fetch data from the recipe API :(\n', error));
}

//Clear the previous node objects from the browser
function removeOldCardElements() {
  var oldCards = document.querySelectorAll('section#indexSection > div.container > div > div.col.mb-5');
  if (oldCards.length != 0) {
    for (let i = 0; i < oldCards.length; i++) {
      container.removeChild(oldCards[i]);
    }
  }
}

//Create new node objects for the new recipe list
function createNewCardElements(jsonData) {
  if (!jsonData) {
    var div = document.createElement('div');
    div.classList = 'text-center';
    div.innerHTML = '<h1>Sorry! We can\'t find recipes from the term you are looking for.</h1>';
    container.appendChild(div);
    // console.log(container)
  } else {
    for (let i = 0; i < jsonData.recipes.length; i++) {
      var newCardContainer = document.createElement('div');
      var newCard = document.createElement('div');
      var newCardImg = document.createElement('img');
      var newCardBody = document.createElement('div');
      var newCardBodyText = document.createElement('div');
      var newCardTitle = document.createElement('h5');
      var newCardFooter = document.createElement('div');
      newCardContainer.classList = 'col mb-5';
      newCard.classList = 'card h-100';
      newCardImg.classList = 'card-img-top';
      newCardBody.classList = 'card-body p-4 text-center';
      newCardBodyText.classList = 'text-center';
      newCardTitle.classList = 'fw-bolder';
      newCardFooter.classList = 'card-footer p-4 pt-0 border-top-0 bg-transparent d-flex justify-content-center';

      newCardImg.setAttribute('src', jsonData.recipes[i].image);
      // Google Icon
      newCardFooter.innerHTML = `<div class="text-center"><a class='btn btn-outline-dark mt-auto' target='_blank' href='${jsonData.recipes[i].spoonacularSourceUrl}' data-bs-toggle="tooltip" title="View the full cooking instruction." >Details</a></div><div class="text-center notDisplay addReviewDiv"><a class='btn btn-outline-dark mt-auto' href='/reviews/add/${jsonData.recipes[i].id}' data-bs-toggle="tooltip" title="Write a new review with this recipe.">Review</a></div><div class="notDisplay addShoppingNoteDiv"><a href='/notes/add/${jsonData.recipes[i].id}' data-bs-toggle="tooltip" title="Add this recipe to your shopping notes." ><span class="material-symbols-outlined">bookmark</span></a></div>`;
      newCardBodyText.innerHTML = "Ready in " + jsonData.recipes[i].readyInMinutes + " minutes";
      newCardTitle.innerHTML = jsonData.recipes[i].title;
      if (jsonData.recipes[i].glutenFree) {
        newCardBody.innerHTML += "<span class='badge bg-success' style='margin:1px;'>Gluten Free</span>";
      }
      if (jsonData.recipes[i].vegan) {
        newCardBody.innerHTML += "<span class='badge bg-success' style='margin:1px;'>Vegan</span>";
      }
      if (jsonData.recipes[i].vegetarian) {
        newCardBody.innerHTML += "<span class='badge bg-success' style='margin:1px;'>Vegetarian</span>";
      }
      if (jsonData.recipes[i].dairyFree) {
        newCardBody.innerHTML += "<span class='badge bg-success' style='margin:1px;'>Dairy Free</span>";
      }

      container.appendChild(newCardContainer);
      newCardContainer.appendChild(newCard);
      newCard.appendChild(newCardImg);
      newCard.appendChild(newCardBody);
      newCardBody.appendChild(newCardBodyText);
      newCardBodyText.appendChild(newCardTitle);
      newCard.appendChild(newCardFooter);

      //Make the write review btn visible, only when the user log in
      var loginUser = document.getElementById('loginUser');
      var reviewDivs = document.querySelectorAll('div.addReviewDiv');
      var shoppingNoteDivs = document.querySelectorAll('div.addShoppingNoteDiv');
      if (loginUser.textContent) {
        // console.log(reviewDivs)
        for (let i = 0; i < reviewDivs.length; i++) {
          reviewDivs[i].classList.remove('notDisplay');
        }
        for (let i = 0; i < shoppingNoteDivs.length; i++) {
          shoppingNoteDivs[i].classList.remove('notDisplay');
        }
      }
      // console.log(loginUser.textContent)
    }
  }
}


//Delete the item only when the user clicks the OK btn of the popup window
function confirmDeletion() {
  if (confirm('Are you sure you want to delete this?\r\nThis item will be deleted immediately. You can\'t undo this action.')) {
    return true;
  } else {
    return false;
  }
}