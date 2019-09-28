function isValidEmail(email){
  return email.includes("@") && ( email.includes(".com") || email.includes(".edu") );
}

function createUser(email, password){
  return new Promise((resolve, reject) => {

    if(email == '')          reject('email is null');
    if(password == '')       reject('password is null');
    if(!isValidEmail(email)) reject('invalid email');
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => resolve('success'))
      .catch((error) => reject(error.message));
  });
}

function login(email, password){
  return new Promise((resolve, reject) => {

    if(email == '')          reject('email is null');
    if(password == '')       reject('password is null');
    if(!isValidEmail(email)) reject('invalid email');
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => resolve('success'))
      .catch((error) => reject(error.message));
  });
}

function isUserSignedIn(){
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) resolve('success');
      else     reject('not signed in');
    });
  });
}

function signOutUser(){
  return new Promise((resolve, reject) => {
    firebase.auth().signOut()
      .then(() => resolve('success'))
      .catch((error) => reject(error.message));
  });
}