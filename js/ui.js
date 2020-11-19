const recipes = document.querySelector(".recipes");
document.addEventListener("DOMContentLoaded", function () {
  // nav menu
  const menus = document.querySelectorAll(".side-menu");
  M.Sidenav.init(menus, { edge: "right" });
  // add recipe form
  const forms = document.querySelectorAll(".side-form");
  M.Sidenav.init(forms, { edge: "left" });
  // edit form
  const editForms = document.querySelectorAll(".side-edit-form");
  M.Sidenav.init(editForms, { edge: "left" });
});

// render recipe data
const renderRecipe = (data, id) => {
  const html = `
      <div class="card-panel recipe white row" data-id ="${id}">
        <img id="imgUrl" src="./img/dish.png" alt="recipe thumb" />
        <div class="recipe-details">
          <div class="recipe-title">${data.title}</div>
          <div class="recipe-discreption">${data.discreption}</div>
          <div class="recipe-price">${data.price}</div>
        </div>
        <div class="center">
      <a class="btn-floating btn-small btn-large add-btn sidenav-trigger" data-target="side-edit-form">
        <i class="material-icons">create</i>
      </a>
    </div>
        <div class="recipe-delete">
          <i class="material-icons" data-id ="${id}">delete_outline</i>
        </div>
      </div>
  `;

  recipes.innerHTML += html;
};

const removeRecipe = id => {
  const recipe = document.querySelector(`.recipe[data-id=${id}]`);
  recipe.remove();
};
const updateRecipe = (id, updatedData) => {
  const recipe = document.querySelector(`.recipe[data-id=${id}]`);

  const html = `
      <div class="card-panel recipe white row" data-id ="${id}">
        <img src="./img/dish.png" alt="recipe thumb" />
        <div class="recipe-details">
          <div class="recipe-title">${updatedData.title}</div>
          <div class="recipe-discreption">${updatedData.discreption}</div>
          <div class="recipe-price">${updatedData.price}</div>
        </div>
        <div class="recipe-edit">
          <i class="material-icons" data-id ="${id}">create</i>
        </div>
        <div class="recipe-delete">
          <i class="material-icons" data-id ="${id}">delete_outline</i>   
        </div>
      </div>
  `;

  removeRecipe(id);
  recipes.innerHTML += html;
};
