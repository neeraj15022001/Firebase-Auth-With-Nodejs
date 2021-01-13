const userDetailContainer = document.getElementById("userDetails");

var provider = new firebase.auth.GoogleAuthProvider();
const intializeApp = () => {
  var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
};
