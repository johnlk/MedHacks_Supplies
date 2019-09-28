var firebaseConfig = {
  apiKey: "AIzaSyCCA2iLuHqNJ--qvqUCsMsC4givdKKz6gE",
  authDomain: "medhacksupplies.firebaseapp.com",
  databaseURL: "https://medhacksupplies.firebaseio.com",
  projectId: "medhacksupplies",
  storageBucket: "medhacksupplies.appspot.com",
  messagingSenderId: "19611715392",
  appId: "1:19611715392:web:77061f39b6f099037fdca5"
};

firebase.initializeApp(firebaseConfig);

//global variable for db reference
var database = firebase.firestore();
