$(function() {  
  initApp();
  btmSetting();
});

function email_SignIn() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut(); signout
  } else {
    var email = $('#usermebersEmail').val();
    var password = $('#usermebersPw').val();

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
      $('#btnLogin').attr('disabled', false);
    });
  }
  $('#btnLogin').attr('disabled', true);
};

// Facebook login
function facebook_SignIn() {
  console.log("click")
  if (!firebase.auth().currentUser) {
    console.log('--------- facebook_SignIn --------- ')
    console.log('로그인 시도하는 유저')
    var provider = new firebase.auth.FacebookAuthProvider(); //Facebook-Auth-Provider
    firebase.auth().signInWithRedirect(provider); // sign-in redirect
  } else {
    console.log('이미 로그인 한 유저')
    firebase.auth().signOut(); // signout
  }
  $('#btnFacebookLogin').attr('disabled',false)
};

// Google login
function google_SignIn() {
  if (!firebase.auth().currentUser) {
    var provider = new firebase.auth.GoogleAuthProvider(); // createprovider
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithRedirect(provider); // start signin by Google
    provider.addScope('email'); // addscopes
    provider.addScope('profile');
  } else {
    console.log('이미 로그인 한 유저')
    firebase.auth().signOut(); // signout
  }
  $('#quickstart-sign-in').attr('disabled',true);
};

// Handles the sign up button press.
function email_handleSignUp() {
  var email = $('#rgtrEmail').val();
  var name = $('#rgtrName').val();
  var password = $('#rgtrPassword').val();
  var password_confirm = $('#rgtrConfirm').val();
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  if (password === password_confirm) {
    console.log('right')
  } else {
    alert('비밀번호가 틀립니다.')
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

function initApp() {
 console.log('--------- initApp --------- ')
  firebase.auth().getRedirectResult().then(function(result) {
    // firebase.auth().getRedirectResult()
    if (result.credential) {
      // get a Facebook or Google Access Token. for accessing a Facebook or Google API.
      var token = result.credential.accessToken; 
      console.log('result.credential oauthtoken = ' + token)
    } else {
      console.log('result.credential oauthtoken = null')
    }
    var user = result.user; // The signed-in user information.
  }).catch(function(error) { // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email; // The email of the user's account used.
    var credential = error.credential; // Handle Errors here.
    if (errorCode === 'auth/account-exists-with-different-credential') {
      alert('You have already signed up with a different auth provider for that email.');
      // If you are using multiple auth providers on your app you should handle linking the user's accounts here.
    } else {
      console.error(error);
    }
  });


  // firebase.auth().onAuthStateChanged // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('--------- onAuthStateChanged --------- ')
    if (user) {
      console.log('signed-in')
      console.log('next step : Log out')
      var user = firebase.auth().currentUser;
      if (user != null) {
        user.providerData.forEach(function (profile) {
          console.log("Email: "+profile.email);
          console.log("Provider-specific UID (same a previous ID): "+profile.uid);
          console.log("Name: "+profile.displayName);
          console.log("Sign-in provider: "+profile.providerId);
          console.log('User UID = ' + user.uid)
        });
      }
    } else {
      // 로그아웃 상태
      console.log('sign-in-status : Signed out')
      console.log('account-details : null')
      console.log('oauthtoken : null')
    }
  }); 
  // authstatelistener end
  console.log('initApp - End')
  // [페이스북 로그인 버튼]에 [페이스북 로그인 함수] 할당
  $('#btnFacebookLogin').click(facebook_SignIn);
  $('#btnGoogleLogin').click(google_SignIn);
  $('#btnLogin').click(email_SignIn);
  $('#newUsr').click(email_handleSignUp);
}

function btmSetting(){
    var sw = screen.width;
    if(sw < 768){
      $('.footer').removeClass('navbar-fixed-bottom')
    } else (
      $('.footer').addClass('navbar-fixed-bottom')
    )
}