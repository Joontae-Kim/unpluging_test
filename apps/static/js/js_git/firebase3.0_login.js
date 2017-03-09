    /**
     * Function called when clicking the Login/Logout button.
     */
    function toggleSignIn() { // buttoncallback
      if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.FacebookAuthProvider(); //createprovider
        provider.addScope('user_likes'); // addscopes
        firebase.auth().signInWithRedirect(provider); // signin
      } else {
        firebase.auth().signOut(); // signout
      }
      $('#quickstart-sign-in').attr('disabled',false)
    }

    // initApp() handles setting up UI event listeners and registering Firebase auth listeners:
    function initApp() {
     // firebase.auth().getRedirectResult(): This promise completes when the user gets back from the auth redirect flow.
     // It is where you can get the OAuth access token from the IDP.
      firebase.auth().getRedirectResult().then(function(result) { // Result from Redirect auth flow.  [START getidptoken]
        if (result.credential) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          $('#quickstart-oauthtoken').text(token);
        } else {
          $('#quickstart-oauthtoken').text('null');
        }
        var user = result.user; // The signed-in user info.
      }).catch(function(error) { // Handle Errors here.
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
      });

      // firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or out,
      // and that is where we update the UI.
      // Listening for auth state changes. [START authstatelistener]
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
          $('#quickstart-sign-in-status').text('Signed in');
          $('#quickstart-sign-in').text('Log out');
          $('#quickstart-account-details').text(JSON.stringify(user, null, '  '));
        } else {
          // User is signed out.
          $('#quickstart-sign-in-status').text('Signed out');
          $('#quickstart-sign-in').text('Log in with Facebook');
          $('#quickstart-account-details').text('null');
          $('#quickstart-oauthtoken').text('null');
        }
        // document.getElementById('quickstart-sign-in').disabled = false;
        $('#quickstart-sign-in').attr('disabled',false);
      });
      // authstatelistener end
      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    }
    window.onload = function() {
      initApp();
    };