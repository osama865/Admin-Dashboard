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
    // console.log(change, change.doc.data());
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

var storage = firebase.storage();
var storageRef = firebase.storage().ref();

// const clickInput = evt => {
//   evt.preventDefault();
//   uploadHandler(evt);
//   document.querySelector("#file").click();
// };

let image = null;
let urls = [];

const handleChange = e => {
  if (e.target.files[0]) {
    image = e.target.files[0];
    uploadHandler(e);
  }
};

const uploadHandler = evt => {
  evt.preventDefault();
  const uploadTask = storage.ref(`images/${image.name}`).put(image);
  uploadTask.on(
    "state_changed",
    snapshot => {
      // const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      // setProgress(progress);
    },
    error => {
      console.log(error);
    },
    () => {
      storage
        .ref("images")
        .child(image.name)
        .getDownloadURL()
        .then(backedUrl => {
          // db.collection("recipes").update({ url: url });
          console.log(backedUrl);
          document.getElementById("button-sub").disabled = false;
          document.getElementsByClassName(".file").disabled = false;

          // url = backedUrl;
          urls.push(backedUrl);
        });
    }
  );
};

// const clickEdit = evt => {
//   evt.preventDefault();
//   document.querySelector("#file").click();
// };
// const editHandler = evt => {
//   evt.preventDefault();
//   const imgPath = evt.target.files[0];
//   console.log(imgPath.name);
//   storageRef
//     .put(imgPath)
//     .then(snapshot => {
//       snapshot.ref.getDownloadURL().then(function (url) {
//         console.log("File available at", url);
//         image = url;
//         db.collection("recipes").add({ url: url });
//       });
//     })
//     .catch(err => {});
// };

let oldData = {};
const form = document.querySelector("form");

form.addEventListener("submit", evt => {
  evt.preventDefault();
  console.log("submitted");
  const recipe = {
    title: form.title.value,
    discreption: form.discreption.value,
    price: form.price.value,
    urls: urls,
  };

  db.collection("recipes")
    .add(recipe)
    .catch(err => console.log(err));

  form.title.value = "";
  form.discreption.value = "";
  form.price.value = "";
  url = "";
  document.getElementById("button-sub").disabled = true;
  oldData = recipe;
});

/*
  when choce an img put its url inside Image lable
  put image lable value inside variable image
  (may i use event listener ?)
  if variable image is not empty then put its value inside the url imaged iat documents 


  and when we get our data put the url inside img src of the card chocen
*/

// delete recipe

const recipeContainer = document.querySelector(".recipes");

recipeContainer.addEventListener("click", evt => {
  evt.preventDefault();
  console.log(evt);
  if (evt.target.tagName === "I" && evt.target.textContent === "delete_outline") {
    const id = evt.target.getAttribute("data-id");
    console.log(id);
    db.collection("recipes").doc(id).delete();
    // console.log("hello");
  }
});

let updatedImg = null;
let updatedUrl = "";

const uHandleChange = e => {
  if (e.target.files[0]) {
    updatedImg = e.target.files[0];
  }
};

const updateHandler = evt => {
  evt.preventDefault();
  const uploadTask = storage.ref(`images/${image.name}`).put(updatedImg);
  uploadTask.on(
    "state_changed",
    snapshot => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      // setProgress(progress);
    },
    error => {
      console.log(error);
    },
    () => {
      storage
        .ref("images")
        .child(image.name)
        .getDownloadURL()
        .then(backedUrl => {
          // db.collection("recipes").update({ url: url });
          console.log(backedUrl);
          document.getElementById("button-sub").disabled = false;
          updatedUrl = backedUrl;
        });
    }
  );
};
// editing doc
const editedForm = document.querySelector("#side-edit-form");
recipeContainer.addEventListener("click", evt => {
  console.log(editedForm);
  evt.preventDefault();
  console.log(evt);
  if (evt.target.tagName === "I" && evt.target.textContent === "create") {
    const editedInfo = {
      title: editedForm.title.value,
      discreption: editedForm.discreption.value,
      price: editedForm.price.value,
      url: updatedUrl,
    };

    const id = evt.target.getAttribute("data-id");
    console.log(id, evt.target.textContent);
    var ref = db.collection("recipes").doc(id);
    return ref
      .update(editedInfo)
      .then(function () {
        editedForm.title.value = "";
        editedForm.discreption.value = "";
        editedForm.price.value = "";
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error(error);
      });
    // db.collection("recipes")
    //   .doc(id)
    //   .update({
    //     title: "updated title",
    //   })
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    // console.log("hello");
  }
});
