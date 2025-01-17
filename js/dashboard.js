const addRecipeNav = document.getElementById('nav-add-recipe');
const recipeFormContainer = document.getElementById('add-recipe-form-container');
const recipeForm = document.getElementById('recipe-form');
const searchBar = document.querySelector('.search-bar input[type="text"]');

document.addEventListener('DOMContentLoaded', () => {
  applyStyles();
});

function applyStyles() {
  // General Styles
  applyToElement(document.body, {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f6f9f8',
    color: '#333'
  });

  // Topbar Styles
  const topbar = document.querySelector('.topbar');
  applyToElement(topbar, {
    backgroundColor: '#edf4ef',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
  });

  const topbarTitle = topbar.querySelector('h1');
  applyToElement(topbarTitle, {
    fontSize: '1.5em',
    color: '#28a745'
  });

  const searchBar = document.querySelector('.search-bar');
  applyToElement(searchBar, {
    flexGrow: '1',
    margin: '0 20px',
    display: 'flex',
    justifyContent: 'center'
  });

  const searchInput = searchBar.querySelector('input[type="text"]');
  applyToElement(searchInput, {
    width: '60%',
    padding: '10px',
    fontSize: '1em',
    border: '1px solid #ccc',
    borderRadius: '5px'
  });

  const navLinks = topbar.querySelectorAll('nav a');
  navLinks.forEach(link => {
    applyToElement(link, {
      textDecoration: 'none',
      color: '#333',
      fontSize: '1em'
    });
    link.addEventListener('mouseover', () => (link.style.color = '#28a745'));
    link.addEventListener('mouseout', () => (link.style.color = '#333'));
  });

  // Banner Styles
  const banner = document.querySelector('.banner');
  applyToElement(banner, {
    backgroundColor: '#e8f5e9',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  });

  const bannerHeading = banner.querySelector('h2');
  applyToElement(bannerHeading, {
    fontSize: '2.5em',
    color: '#28a745'
  });

  const bannerParagraph = banner.querySelector('p');
  applyToElement(bannerParagraph, {
    margin: '10px 0',
    color: '#666'
  });

  const bannerImage = banner.querySelector('img');
  applyToElement(bannerImage, {
    maxWidth: '50%',
    borderRadius: '10px'
  });

  // Form Styles
  const labels = document.querySelectorAll('label');
  labels.forEach(label => {
    label.style.color = '#28a745';
  });

  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    applyToElement(input, {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      width: '100%',
      marginBottom: '10px'
    });
  });

  const addButton = document.querySelector('button[type="submit"]');
  applyToElement(addButton, {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  });
  addButton.addEventListener('mouseover', () => (addButton.style.backgroundColor = '#218838'));
  addButton.addEventListener('mouseout', () => (addButton.style.backgroundColor = '#28a745'));
}

// Helper function for applying styles
function applyToElement(element, styles) {
  Object.assign(element.style, styles);
}


// Helper functions for localStorage
function getRecipes() {
  return JSON.parse(localStorage.getItem('recipes')) || { Breakfast: [], Lunch: [], Dinner: [] };
}

function saveRecipes(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Render recipes from localStorage
function renderRecipes(filter = '') {
  const recipes = getRecipes();

  for (const category in recipes) {
    const listGroup = document.getElementById(category).querySelector('.list-group');
    listGroup.innerHTML = ''; // Clear existing recipes

    const filteredRecipes = recipes[category].filter(recipe =>
      recipe.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredRecipes.length === 0 && filter) {
      listGroup.innerHTML = '<li class="list-group-item text-muted">No recipes found</li>';
    } else {
      filteredRecipes.forEach(recipe => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = recipe.name;
        listItem.style.cursor = 'pointer';

        listItem.addEventListener('click', () => {
          showRecipeModal(recipe, category); // Show the recipe details in a modal
        });

        listGroup.appendChild(listItem);
      });
    }
  }
}

// Show/hide the form when clicking "Add Recipe" in navbar
addRecipeNav.addEventListener('click', (e) => {
  e.preventDefault();
  recipeFormContainer.style.display = recipeFormContainer.style.display === 'none' || recipeFormContainer.style.display === '' ? 'block' : 'none';
});

// Handle recipe form submission
recipeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const recipeName = document.getElementById('recipe-name').value.trim();
  const description = document.getElementById('recipe-description').value.trim();
  const ingredients = document.getElementById('recipe-ingredients').value.trim();
  const steps = document.getElementById('recipe-steps').value.trim();
  const category = document.getElementById('category').value;

  if (!recipeName || !description || !ingredients || !steps) {
    alert('Please fill in all the fields.');
    return;
  }

  const recipes = getRecipes();

  // Check for duplicate recipe names within the same category
  if (recipes[category].some(recipe => recipe.name.toLowerCase() === recipeName.toLowerCase())) {
    alert('A recipe with this name already exists in the selected category.');
    return;
  }

  const newRecipe = {
    name: recipeName,
    description,
    ingredients,
    steps,
  };

  recipes[category].push(newRecipe);
  saveRecipes(recipes);

  alert('Recipe added successfully!');
  renderRecipes();
  recipeForm.reset();
  recipeFormContainer.style.display = 'none';
});

// Load and render recipes on page load
document.addEventListener('DOMContentLoaded', () => {
  recipeFormContainer.style.display = 'none';
  renderRecipes();
});

// Search and filter recipes
searchBar.addEventListener('input', (e) => {
  const filter = e.target.value;
  renderRecipes(filter);
});

// Selected recipe for delete/edit operations
let selectedRecipe = null;
let selectedCategory = null;

// Function to show recipe details in a modal
function showRecipeModal(recipe, category) {
  selectedRecipe = recipe;
  selectedCategory = category;

  document.getElementById('modal-recipe-name').textContent = recipe.name;
  document.getElementById('modal-recipe-description').textContent = recipe.description;

  const ingredientsList = document.getElementById('modal-recipe-ingredients');
  ingredientsList.innerHTML = '';
  recipe.ingredients.split(',').forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient.trim();
    ingredientsList.appendChild(li);
  });

  const stepsList = document.getElementById('modal-recipe-steps');
  stepsList.innerHTML = '';
  recipe.steps.split('\n').forEach(step => {
    const li = document.createElement('li');
    li.textContent = step.trim();
    stepsList.appendChild(li);
  });

  const recipeModal = new bootstrap.Modal(document.getElementById('recipeDetailsModal'));
  recipeModal.show();
}

// Delete Recipe
document.getElementById('delete-recipe').addEventListener('click', () => {
  if (confirm("Are you sure you want to delete this recipe?")) {
    const recipes = getRecipes();
    const categoryRecipes = recipes[selectedCategory];
    const updatedRecipes = categoryRecipes.filter(r => r.name !== selectedRecipe.name);

    recipes[selectedCategory] = updatedRecipes;
    saveRecipes(recipes);
    renderRecipes();

    const recipeModal = bootstrap.Modal.getInstance(document.getElementById('recipeDetailsModal'));
    recipeModal.hide();
  }
});

// Edit Recipe
document.getElementById('edit-recipe').addEventListener('click', () => {
  const modalBody = document.querySelector('.modal-body');

  modalBody.innerHTML = `
    <div class="mb-3">
      <label for="edit-recipe-name" class="form-label">Recipe Name</label>
      <input type="text" id="edit-recipe-name" class="form-control" value="${selectedRecipe.name}">
    </div>
    <div class="mb-3">
      <label for="edit-recipe-description" class="form-label">Description</label>
      <textarea id="edit-recipe-description" class="form-control">${selectedRecipe.description}</textarea>
    </div>
    <div class="mb-3">
      <label for="edit-recipe-ingredients" class="form-label">Ingredients</label>
      <textarea id="edit-recipe-ingredients" class="form-control">${selectedRecipe.ingredients}</textarea>
    </div>
    <div class="mb-3">
      <label for="edit-recipe-steps" class="form-label">Cooking Steps</label>
      <textarea id="edit-recipe-steps" class="form-control">${selectedRecipe.steps}</textarea>
    </div>
  `;

  document.querySelector('.modal-footer').innerHTML = `
    <button id="save-edits" type="button" class="btn btn-success">Save</button>
    <button id="cancel-edits" type="button" class="btn btn-secondary">Cancel</button>
  `;

  document.getElementById('save-edits').addEventListener('click', () => {
    const editedRecipe = {
      name: document.getElementById('edit-recipe-name').value,
      description: document.getElementById('edit-recipe-description').value,
      ingredients: document.getElementById('edit-recipe-ingredients').value,
      steps: document.getElementById('edit-recipe-steps').value,
    };

    if (!editedRecipe.name || !editedRecipe.description || !editedRecipe.ingredients || !editedRecipe.steps) {
      alert('Please fill in all the fields.');
      return;
    }

    const recipes = getRecipes();
    const categoryRecipes = recipes[selectedCategory];
    const recipeIndex = categoryRecipes.findIndex(r => r.name === selectedRecipe.name);

    categoryRecipes[recipeIndex] = editedRecipe;
    recipes[selectedCategory] = categoryRecipes;
    saveRecipes(recipes);
    renderRecipes();

    alert('Recipe updated successfully!');

    const recipeModal = bootstrap.Modal.getInstance(document.getElementById('recipeDetailsModal'));
    recipeModal.hide();
  });

  document.getElementById('cancel-edits').addEventListener('click', () => {
    const recipeModal = bootstrap.Modal.getInstance(document.getElementById('recipeDetailsModal'));
    recipeModal.hide();
    renderRecipes();
  });
});
