    /**
     * Function called when clicking the Login/Logout button.
     */

    // [START buttoncallback]
    function toggleSignIn() {
      if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.FacebookAuthProvider(); // [START createprovider]
        provider.addScope('user_likes'); // [START addscopes]
        firebase.auth().signInWithRedirect(provider); // [START signin]
      } else {
        firebase.auth().signOut();
      }
      document.getElementById('quickstart-sign-in').disabled = true; // [START_EXCLUDE]
    }

    // [END buttoncallback]
    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     *  - firebase.auth().getRedirectResult(): This promise completes when the user gets back from
     *    the auth redirect flow. It is where you can get the OAuth access token from the IDP.
     */

    function initApp() {
      // Result from Redirect auth flow.
      firebase.auth().getRedirectResult().then(function(result) { // [START getidptoken]
        if (result.credential) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          document.getElementById('quickstart-oauthtoken').text = token; // [START_EXCLUDE]
        } else {
          document.getElementById('quickstart-oauthtoken').text = 'null';
        }
        var user = result.user; // The signed-in user info.
      }).catch(function(error) {
        var errorCode = error.code; // Handle Errors here.
        var errorMessage = error.message;
        var email = error.email; // The email of the user's account used.
        var credential = error.credential; // The firebase.auth.AuthCredential type that was used.        
        if (errorCode === 'auth/account-exists-with-different-credential') { // [START_EXCLUDE]
          alert('You have already signed up with a different auth provider for that email.');
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
      });
      
      // Listening for auth state changes.
      firebase.auth().onAuthStateChanged(function(user) { // [START authstatelistener]
        if (user) {
          var displayName = user.displayName; // User is signed in.
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          document.getElementById('quickstart-sign-in-status').text = 'Signed in';
          document.getElementById('quickstart-sign-in').text = 'Log out';
          document.getElementById('quickstart-account-details').text = JSON.stringify(user, null, '  ');
        } else {
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed out'; // User is signed out.
          document.getElementById('quickstart-sign-in').textContent = 'Log in with Facebook';
          document.getElementById('quickstart-account-details').textContent = 'null';
          document.getElementById('quickstart-oauthtoken').textContent = 'null';
        }
        document.getElementById('quickstart-sign-in').disabled = false;
      });
      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    }
    window.onload = function() {
      initApp();
    };