    // Handles the sign in button press.
    function toggleSignIn() {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut(); signout
      } else {
        var email = $('#email').val();
        var password = $('#password').val();

        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass. - authwithemail
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          var errorCode = error.code; // Handle Errors here.
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          $('#quickstart-sign-in').attr('disabled', false);
        });
      }
      $('#quickstart-sign-in').attr('disabled', true);
    }

    // Handles the sign up button press.
    function handleSignUp() {
      var email = $('#email').val();
      var password = $('#password').val();
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass. - createwithemail
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
    }

    // Sends an email verification to the user.
    function sendEmailVerification() {
      firebase.auth().currentUser.sendEmailVerification().then(function() { // Sends an email verification to the user.
        alert('Email Verification Sent!'); // Email Verification sent!
      });
    }

    function sendPasswordReset() {
      var email = document.getElementById('email').value;
      // sendpasswordemail
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        alert('Password Reset Email Sent!');
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
      });
    }

    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */

    function initApp() {
      // Listening for auth state changes. - authstatelistener
      firebase.auth().onAuthStateChanged(function(user) {
        document.getElementById('quickstart-verify-email').disabled = true;
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
          $('#quickstart-sign-in').text('Sign out');
          $('#quickstart-account-details').text(JSON.stringify(user, null, '  '));
          if (!emailVerified) {
            $('#quickstart-verify-email').attr('disabled', false;)
          }
        } else {
          // User is signed out.
          $('#quickstart-sign-in-status').text('Signed out');
          $('#quickstart-sign-in').text('Sign in');
          $('#quickstart-account-details').text('null');
        }
        $('#quickstart-sign-in').attr('disabled', false);
      });
      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
      document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
      document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
      document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
    }
    window.onload = function() {
      initApp();
    };