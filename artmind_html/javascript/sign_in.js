// --- ArtMind Javascript ---

// --- EVENT LISTENERS ---
// Source: https://firebase.google.com/docs/auth/web/anonymous-auth
// Date: 5/20/18
$("#loginAnonymouslyButton").click(function() {
  // Source: https://www.tutorialspoint.com/firebase/firebase_anonymous_authentication.htm
  // Date: 5/20/18
  firebase
    .auth()
    .signInAnonymously()
    .then(function() {
      console.log("Logged in as Anonymous!");
      window.open("index.html", "_self");
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
});
