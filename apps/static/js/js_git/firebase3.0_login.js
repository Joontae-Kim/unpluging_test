$(function() {  
  initApp();
  btmSetting();
  // $('#btnLogin').on("click", lgg);
  // $('#usrslogout').on('click',userout);
  // $('#btnFacebookLogin').on('click',fblogging);
  // $('#btnGoogleLogin').on('click',gglogging);
  // $('#newUsr').on('click',createMb);
});

// 페이스북 로그인 버튼 id - btnFacebookLogin
// 구글 로그인 버튼 id - btnGoogleLogin
// 이메일 로그인 버튼 id - btnLogin
// 로그아웃 버튼 id - usrslogout
// 계정생성 버튼 id - newUsr

// Function called when clicking the Login/Logout button. - buttoncallback
function toggleSignIn() {
  console.log("click")
  if (!firebase.auth().currentUser) {
    console.log('--------- toggleSignIn --------- ')
    console.log('로그인 시도하는 유저')
    var provider = new firebase.auth.FacebookAuthProvider(); //Facebook-Auth-Provider
    provider.addScope('user_likes'); // addscopes
    firebase.auth().signInWithRedirect(provider); // sign-in redirect
  } else {
    console.log('이미 로그인 한 유저')
    firebase.auth().signOut(); // signout
  }
  $('#btnFacebookLogin').attr('disabled',false)
}

// initApp() handles setting up UI event listeners and registering Firebase auth listeners:
function initApp() {
 // firebase.auth().getRedirectResult(): This promise completes when the user gets back from the auth redirect flow.
 // It is where you can get the OAuth access token from the IDP.
 // Result from Redirect auth flow.  - getidptoken
 console.log('--------- initApp --------- ')
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      var token = result.credential.accessToken; // get a Facebook Access Token. for accessing the Facebook API.
      console.log('result.credential oauthtoken = ' + token)
    } else {
      console.log('result.credential oauthtoken = null')
    }
    var user = result.user; // The signed-in user information.
    // Handle Errors here.
  }).catch(function(error) { 
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email; // The email of the user's account used.

    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential; 
    if (errorCode === 'auth/account-exists-with-different-credential') {
      alert('You have already signed up with a different auth provider for that email.');
      // If you are using multiple auth providers on your app you should handle linking the user's accounts here.
    } else {
      console.error(error);
    }
  });

  // firebase.auth().onAuthStateChanged - This listener is called when the user is signed in or out,
  // and that is where we update the UI.
  // Listening for auth state changes. - authstatelistener
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('--------- onAuthStateChanged --------- ')
    if (user) {

      // User is signed in.
      // i.e) get a user's data - user.xxxxxx
      // user.displayName, user.email, user.emailVerified,
      // user.isAnonymous, user.uid, user.providerData

      console.log('signed-in')
      console.log('next step : Log out')
      // console.log(JSON.stringify(user, null, '  '))
      // setTimeout(function() {
      //    window.location.replace("/");
      // }, 2000);
    } else {
      // User is signed out.
      console.log('sign-in-status : Signed out')
      console.log('Log in with Facebook')
      console.log('account-details : null')
      console.log('oauthtoken : null')
    }
    $('#btnFacebookLogin').attr('disabled',false);
  });
  // authstatelistener end
  // $('#btnFacebookLogin').unbind("click", toggleSignIn, false);
  $('#btnFacebookLogin').click(toggleSignIn);
  // document.getElementById('btnFacebookLogin').addEventListener('click', toggleSignIn, false);
  console.log('click')
}

function btmSetting(){
    var sw = screen.width;
    if(sw < 768){
      $('.footer').removeClass('navbar-fixed-bottom')
    } else (
      $('.footer').addClass('navbar-fixed-bottom')
    )
}