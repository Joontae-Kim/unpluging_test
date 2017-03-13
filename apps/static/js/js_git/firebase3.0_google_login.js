/**
 * Function called when clicking the Login/Logout button.
 */
function toggleSignIn() {
  if (!firebase.auth().currentUser) {
    // [START createprovider]
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithRedirect(provider); // start signin by Google
  } else {
    firebase.auth().signOut(); // signout
  }
  document.getElementById('quickstart-sign-in').disabled = true;
}

function initApp() {
  // Result from Redirect auth flow. // getidptoken
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      document.getElementById('quickstart-oauthtoken').textContent = token;
    } else {
      document.getElementById('quickstart-oauthtoken').textContent = 'null';
    }
    // The signed-in user info.
    var user = result.user;
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email; // The email of the user's account used.
    var credential = error.credential; // The firebase.auth.AuthCredential type that was used.
    // [START_EXCLUDE]
    if (errorCode === 'auth/account-exists-with-different-credential') {
      alert('You have already signed up with a different auth provider for that email.');
      // If you are using multiple auth providers on your app you should handle linking
      // the user's accounts here.
    } else {
      console.error(error);
    }
    // [END_EXCLUDE]
  });
  // Listening for auth state changes. // authstatelistener
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      document.getElementById('quickstart-sign-in').textContent = 'Sign out';
      document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
    } else {
      // User is signed out.
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-sign-in').textContent = 'Sign in with Google';
      document.getElementById('quickstart-account-details').textContent = 'null';
      document.getElementById('quickstart-oauthtoken').textContent = 'null';
    }
    document.getElementById('quickstart-sign-in').disabled = false;
  });
  // authstatelistener
  document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}
window.onload = function() {
  initApp();
};