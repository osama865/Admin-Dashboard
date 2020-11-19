// offline persistence
db.enablePersistence().catch(err => {
  if (err.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a time.
    // ...
    console.log("persistence failed");
  } else if (err.code == "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
    console.log("persistence is not available");
  }
});

// real time listener
db.collection("recipes").onSnapshot(function (snapshot) {
  // console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(function (change) {
    console.log(change, change.doc.data());
    switch (change.type) {
      case "added":
        // add doc data to UI
        renderRecipe(change.doc.data(), change.doc.id);
        break;
      case "removed":
        // remove doc data from UI
        removeRecipe(change.doc.id);
        break;
      case "modified":
        updateRecipe(change.doc.id, change.doc.data());
        break;
      default:
        break;
    }
  });
});

const form = document.querySelector("form");

form.addEventListener("submit", evt => {
  evt.preventDefault();
  console.log("submitted");
  const recipe = {
    title: form.title.value,
    discreption: form.discreption.value,
    price: form.price.value,
  };

  db.collection("recipes")
    .add(recipe)
    .catch(err => console.log(err));

  form.title.value = "";
  form.discreption.value = "";
  form.price.value = "";
});

/*
  when choce an img put its url inside Image lable
  put image lable value inside variable imgUrl
  (may i use event listener ?)
  if variable imgUrl is not empty then put its value inside the url filed iat documents 


  and when we get our data put the url inside img src of the card chocen
*/

// form.addEventListener("submit", evt => {
//   evt.preventDefault();
//   console.log("submitted");
//   const recipe = {
//     title: form.title.value,
//     discreption: form.discreption.value,
//     price: form.price.value,
//   };

//   db.collection("recipes")
//     .add(recipe)
//     .catch(err => console.log(err));

//   form.title.value = "";
//   form.discreption.value = "";
//   form.price.value = "";
// });

// delete recipe

const recipeContainer = document.querySelector(".recipes");

recipeContainer.addEventListener("click", evt => {
  console.log(evt);
  if (evt.target.tagName === "I" && evt.target.textContent === "delete_outline") {
    const id = evt.target.getAttribute("data-id");
    console.log(id);
    db.collection("recipes").doc(id).delete();
    // console.log("hello");
  }
});

// editing doc
recipeContainer.addEventListener("click", evt => {
  console.log(evt);
  if (evt.target.tagName === "I" && evt.target.textContent === "create") {
    const id = evt.target.getAttribute("data-id");
    console.log(id, evt.target.textContent);
    db.collection("recipes")
      .doc(id)
      .update({
        title: "updated title",
      })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    // console.log("hello");
  }
});
