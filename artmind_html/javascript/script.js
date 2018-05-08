// --- ArtMind Javascript ---
const baseURI_getObjectInformation =
  "https://hackathon.philamuseum.org/api/v0/collection/object/";
const baseURI_getObjectsForLocation =
  "https://hackathon.philamuseum.org/api/v0/collection/object/location/";
let ObjectID = "59198"; // Prometheus Bound: 104468
let tempObjectID;
// ***** TO FIX: someplace more secure to store this key!  Noted 5/6/18.
// https://support.google.com/cloud/answer/6310037
// ARTMIND_DEV_PMA_TOKEN
// # .bashrc
let token = "YOUR-KEY-GOES-HERE";
let objectIDs = []; // objectIDs
let votes = []; // did you like it (1=yes, -1=no, 0=noVote)
// let galleries = [111, 116];
let galleries = [111, 116, 155, 161, 201, 204, 226, 244, 265, 283, 299];
let objectsInGalleries = [];
let objectIDs_recommended = [101, 102, 103];

// --- EVENT LISTENERS ---
$(document).ready(function() {
  arrayPop(2); // 1 for "random" or 2 for static 10
  // var phptest = <?php echo "hello php world"; ?>;
  // var phptest = <?php echo json_encode($my_var); ?>;
  // alert(phptest);
  // alert(<?php echo "hello php world" ?>);
  // alert(<?php echo $_ENV["ARTMIND_DEV_PMA_TOKEN"]; ?>);
});

$("#artGet_previous").click(function() {
  stepThroughArtworks(objectIDs.length, objectIDs, 0);
});

$("#artGet_next").click(function() {
  stepThroughArtworks(1, objectIDs, 0);
});

// $("#artGet_previous_recommended").click(function() {
//   stepThroughArtworks(objectIDs_recommended.length, objectIDs_recommended, 1);
// });

$("#artGet_next_recommended").click(function() {
  stepThroughArtworks(1, objectIDs_recommended, 1);
});

function stepThroughArtworks(steps, array, recommended) {
  // Steps key:  1 == next, (arrayLength-1) == previous.
  console.log(steps);
  var strURI = getURI_getObjectInformation(steps, array);
  console.log(strURI);
  $("#artGet_form").attr("action", strURI);
  callPMA_getObjectInformation(strURI, recommended);
  if (recommended === 0) {
    voteDisplay(voteValue());
  }
  // alert(voteValue());
}

// $("body").on("mousemove mouseover mouseenter", "#downvote", function() {
//   $("#downvote").attr("src", "./images/Thumbs-Down-Picked-75px_chosen.png");
// });
//
// $("body").on("mouseup mouseleave dragstart", "#downvote", function() {
//   $("#downvote").attr("src", "./images/Thumbs-Down-Picked-75px.png");
// });
//
// $("body").on("mousemove mouseover mouseenter", "#0vote", function() {
//   $("#0vote").attr("src", "./images/0vote_chosen.png");
// });
//
// $("body").on("mouseup mouseleave dragstart", "#0vote", function() {
//   $("#0vote").attr("src", "./images/0vote.png");
// });
//
// $("body").on("mousemove mouseover mouseenter", "#upvote", function() {
//   $("#upvote").attr("src", "./images/Thumbs-Up-Picked-75px_chosen.png");
// });
//
// $("body").on("mouseup mouseleave dragstart", "#upvote", function() {
//   $("#upvote").attr("src", "./images/Thumbs-Up-Picked-75px.png");
// });

// Artmind Match
$("#button_rec").click(function() {
  var strURI;
  // // --- Write data to Firebase ---
  // var database = firebase.database();
  // firebase
  //   .database()
  //   .ref("users/" + firebase.auth().currentUser.uid)
  //   .set({
  //     username: firebase.auth().currentUser.displayName
  //     // username: name,
  //     // email: email,
  //     // profile_picture : imageUrl
  //   });
  // objectIDs.forEach(function(currentValue, index) {
  //   if (currentValue !== 999) {
  //     firebase
  //     .database()
  //     .ref(
  //       "likes/" +
  //       firebase.auth().currentUser.uid +
  //       "_" +
  //       currentValue +
  //       "_" +
  //       Date.now()
  //     )
  //     .set({
  //       uid: firebase.auth().currentUser.uid,
  //       objectid: currentValue,
  //       rating: votes[index],
  //       time: Date.now()
  //     });
  //   }
  // });

  // // --- Alert user that their preferences have been saved
  // alert(
  //   "Thank you! Your preferences have been saved to the database. Artmind's recommendations are not yet working - please check back later for an update."
  // );

  // --- Process results (recommendations)
  // choose objects
  // --- ADD THE PYTHON CODE HERE ---
  objectIDs_recommended = [101687, 307378, 55686];
  tempObjectID = ObjectID;
  ObjectID = objectIDs_recommended[0];
  // processing...
  strURI = getURI_getObjectInformation(0, objectIDs_recommended);
  console.log(objectIDs_recommended);
  callPMA_getObjectInformation(strURI, 1);  // OK

  // --- Show results (recommendations)
  $(".content").toggle();
  $(".results").toggle();
});

$("#button_previousPage").click(function() {
  $(".content").toggle();
  $(".results").toggle();
  ObjectID = tempObjectID;
  console.log("clicked.");
});

$("#downvote").click(function() {
  // alert("downvote");
  voteValue(-1);
  $("#votes").text(votes);
  voteDisplay(-1);
  stepThroughArtworks(1, objectIDs, 0);
});

// $("#0vote").click(function() {
//   // alert("downvote");
//   voteValue(0);
//   $("#votes").text(votes);
//   voteDisplay(0);
// });

$("#upvote").click(function() {
  // alert("upvote");
  voteValue(1);
  $("#votes").text(votes);
  voteDisplay(1);
  stepThroughArtworks(1, objectIDs, 0);
});

$("#loginButton").click(function() {
  window.open("sign_in.html", "_self");
  // Handler for .ready() called.
});

$("#logoutButton").click(function() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });
  // alert("signout button clicked");
  // Handler for .ready() called.
});

// Set an authentication state observer and get user data
// https://firebase.google.com/docs/auth/web/start?authuser=0
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    // Boilerplate
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
    // Me trying stuff
    // $(".signedIn").toggle();
    // $(".signedOut").toggle();
    document.getElementById("loginButton").disabled = true;
    document.getElementById("logoutButton").disabled = false;
    document.getElementsByClassName("signedIn")[0].style.display = "visible";
    document.getElementsByClassName("signedIn")[1].style.display = "visible";
    document.getElementsByClassName("signedIn")[2].style.display = "none";
    document.getElementsByClassName("signedOut")[0].style.display = "none";
    document.getElementsByClassName("signedOut")[1].style.display = "none";
    signedInMessage(user.email);
  } else {
    // User is signed out.
    // ...
    // Me trying stuff
    // $(".signedIn").toggle();
    // $(".signedOut").toggle();
    document.getElementById("loginButton").disabled = false;
    document.getElementById("logoutButton").disabled = true;
    document.getElementsByClassName("signedIn")[0].style.display = "none";
    document.getElementsByClassName("signedIn")[1].style.display = "none";
    document.getElementsByClassName("signedIn")[2].style.display = "none";
    document.getElementsByClassName("signedOut")[0].style.display = "visible";
    document.getElementsByClassName("signedOut")[1].style.display = "visible";
    signedOutMessage();
  }
});

function signedInMessage(email) {
  $("#loginState").text("Welcome, " + email + "!");
  // if (user) {
  //   $("#loginState").append(user.displayName);
  // }
  // return null;
}

// --- FUNCTIONS ---
function voteDisplay(vote) {
  $(".voteButton").removeClass("voteButtonChosen");
  $("#downvote").attr("src", "./images/Thumbs-Down-Picked-75px.png");
  $("#0vote").attr("src", "./images/0vote.png");
  $("#upvote").attr("src", "./images/Thumbs-Up-Picked-75px.png");
  // alert($("#downvote").hasClass("voteButtonChosen"));
  switch (Number(vote)) {
    case -1:
      $("#downvote").addClass("voteButtonChosen");
      $("#downvote").attr("src", "./images/Thumbs-Down-Picked-75px_chosen.png");
      // alert("-1 chosen   " + $("#downvote").hasClass("voteButtonChosen"));
      break;
    case 0:
      $("#0vote").addClass("voteButtonChosen");
      $("#0vote").attr("src", "./images/0vote_chosen.png");
      break;
    case 1:
      $("#upvote").addClass("voteButtonChosen");
      $("#upvote").attr("src", "./images/Thumbs-Up-Picked-75px_chosen.png");
      break;
    default:
      $("#0vote").addClass("voteButtonChosen");
  }
}

function voteValue(newVote) {
  // returns voteValue for a given object ID. Also updates the vote value if included.
  // -1 = dislike, 0 = neutral, 1 = like
  // alert(objectIDs.indexOf(Number(ObjectID)));
  let indexVal = objectIDs.indexOf(Number(ObjectID));
  if (newVote == -1 || newVote == 0 || newVote == 1) {
    votes[indexVal] = newVote;
  }
  return votes[indexVal];
}

function arrayPop(method) {
  // For method #1
  let strURI;
  let galleriesN = galleries.lengh;
  // For method #2
  let artmind10 = [
    59198,
    102763,
    130164,
    308014,
    42394,
    84635,
    55399,
    102943,
    42253,
    46130
  ];

  if (method === 1) {
    // --- #1 "RANDOM" method. Picking 10 items at random from selected galleries. ---
    // get list of all objectIDs in all selected galleries
    galleries.forEach(function(currentValue, index) {
      // for all galleries
      console.log(index + " - " + currentValue);
      strURI = getURI_getObjectsForLocation(galleries[index]);
      console.log("strURI - " + strURI);
      // callPMA_getObjectsForLocation(getURI_getObjectsForLocation(currentValue)); // get objects in gallery
      // callback functions because of GetJSON API call is asynchronous
      callPMA_getObjectsForLocation(
        getURI_getObjectsForLocation(currentValue),
        function(arrayObjectsForLocation) {
          arrayObjectsForLocation.forEach(function(val) {
            objectsInGalleries.push(val);
          });
          console.log(index);
          if (index === 10) {
            // last time through, do my processing
            console.log(index + " - " + arrayObjectsForLocation);
            console.log(objectsInGalleries);
            console.log(objectsInGalleries.length);
            // choose 10 random index numbers in that whole list & push them to random10[]
            random10 = getRandomArray(10, 0, objectsInGalleries.length);
            console.log(random10);
            // push them to objectIDs
            random10.forEach(function(currentValue) {
              objectIDs.push(objectsInGalleries[currentValue]); // push object IDs to array objectIDs[]
              votes.push(999); // 999 means no value chosen; it is the default value
            });
            console.log(objectIDs);
            docReady();
          }
        }
      );
    });
  } else if (method === 2) {
    // --- #2 "CURATED" method. 10 pieces picked by hand. ---
    artmind10.forEach(function(currentValue) {
      objectIDs.push(currentValue);
      votes.push(999); // 999 means no value chosen
    });
    docReady();
  }
  return null;
  // alert(objectIDs);
}

function callPMA_getObjectsForLocation(strURI, callback) {
  // var strURI = "https://hackathon.philamuseum.org/api/v0/collection/object/location/?name=111&api_token=YOUR-TOKEN-HERE";
  $.getJSON(strURI, function(data) {
    var keys = []; // key name, e.g. "Artist"
    var values = []; // value associated with key, e.g. "Monet"
    let arrayObjectsForLocation = [];
    $.each(data, function(key, val) {
      keys.push(key);
      values.push(val);
    });
    values[keys.indexOf("ObjectIDs")].forEach(function(val) {
      arrayObjectsForLocation.push(val);
    });
    callback(arrayObjectsForLocation);
  });
}

function getURI_getObjectsForLocation(galleryID) {
  var strURI =
    baseURI_getObjectsForLocation + popCall_getObjectsForLocation(galleryID);
  return strURI;
}

function popCall_getObjectsForLocation(galleryID) {
  // returns output like "?name=GALLERY_ID&api_token=MY_TOKEN"
  var strText;
  strText = "?name=" + galleryID + "&api_token=" + token;
  return strText;
}

function getURI_getObjectInformation(indexChange, array) {
  console.log(indexChange + " - " + array);
  var strURI =
    baseURI_getObjectInformation +
    popCall_getObjectInformation(indexChange, array);
  return strURI;
  console.log(strURI);
}

function popCall_getObjectInformation(indexChange, array) {
  // returns output like "?query=OBJECT_ID&api_token=MY_TOKEN"
  console.log(indexChange + " - " + array);
  var index, strText;
  index = array.indexOf(Number(ObjectID));
  index += indexChange;
  index %= array.length;
  strText = "?query=" + array[index] + "&api_token=" + token;
  ObjectID = array[index];
  return strText;
}

function callPMA_getObjectInformation(strURI, recommended) {
  // "Returns collection information data for one specific object."
  // https://hackathon.philamuseum.org/documentation
  // Starter code from: https://api.jquery.com/jQuery.getJSON/
  // Copied/pasted on 4/27/18
  // console.log(strURI);
  // console.log(recommended);
  $.getJSON(strURI, function(data) {
    var items = []; // text list of key + item combinations returned, e.g. "Artist - Monet"
    var keys = []; // key name, e.g. "Artist"
    var values = []; // value associated with key, e.g. "Monet"
    var loc;
    $.each(data, function(key, val) {
      items.push("<li id='" + key + "'>" + key + " - " + val + "</li>");
      keys.push(key);
      if (key === "Thumbnail") {
        values.push(httpsIt(val));
      } else {
        values.push(val);
      }
      if (key === "Location") {
        loc = val;
      }
    });

    if (recommended === 0) {
      // var Thumbnail, Title, SocialTags, Classification,
      // var Style, Dated, Artist, Geography
      $("#artworkCaption").text(values[keys.indexOf("Title")]);
      $("#artworkCaption").append("<br>");
      $("#artworkCaption").append(values[keys.indexOf("Artist")]);
      $("#artworkCaption").append("<br>");
      $("#artworkCaption").append(values[keys.indexOf("Dated")]);
      $("#artworkCaption").append("<br>");
      $("#artworkCaption").append("@ ");
      $("#artworkCaption").append(loc.Gallery);
      // console.log(loc.Gallery);
      // console.log(values[keys.indexOf("Location")]);
      // console.log(items);
      // $("#artworkCaption").append("<br>");
      // $("#artworkCaption").append("<br>");
      // $("#artworkCaption").append(values[keys.indexOf("Classification")]);
      // $("#artworkCaption").append("<br>");
      // $("#artworkCaption").append(values[keys.indexOf("Style")]);
      // $("#artworkCaption").append("<br>");
      // $("#artworkCaption").append(values[keys.indexOf("Geography")]);
      // $("#artworkCaption").append("<br>");
      // $("#artworkCaption").append(values[keys.indexOf("SocialTags")]);
      $("#artwork").attr("src", values[keys.indexOf("Thumbnail")]);
      // https://api.jquery.com/load/
      $("#artwork").load(location.href + " #artwork", "");
    } else if (recommended === 1) {
      // var Thumbnail, Title, SocialTags, Classification,
      // var Style, Dated, Artist, Geography
      $("#artworkCaption_recommended").text(values[keys.indexOf("Title")]);
      $("#artworkCaption_recommended").append("<br>");
      $("#artworkCaption_recommended").append(values[keys.indexOf("Artist")]);
      $("#artworkCaption_recommended").append("<br>");
      $("#artworkCaption_recommended").append(values[keys.indexOf("Dated")]);
      $("#artworkCaption_recommended").append("<br>");
      $("#artworkCaption_recommended").append("@ ");
      $("#artworkCaption_recommended").append(loc.Gallery);
      // console.log(loc.Gallery);
      // console.log(values[keys.indexOf("Location")]);
      // $("#artworkCaption_recommended").append("<br>");
      // $("#artworkCaption_recommended").append("<br>");
      // $("#artworkCaption_recommended").append(values[keys.indexOf("Classification")]);
      // $("#artworkCaption_recommended").append("<br>");
      // $("#artworkCaption_recommended").append(values[keys.indexOf("Style")]);
      // $("#artworkCaption_recommended").append("<br>");
      // $("#artworkCaption_recommended").append(values[keys.indexOf("Geography")]);
      // $("#artworkCaption_recommended").append("<br>");
      // $("#artworkCaption_recommended").append(values[keys.indexOf("SocialTags")]);
      $("#artwork_recommended").attr("src", values[keys.indexOf("Thumbnail")]);
      // https://api.jquery.com/load/
      $("#artwork_recommended").load(location.href + " #artwork_recommended", "");
    }
  });
}

function httpsIt(thisString) {
  //replace http:// with https:// if present
  // https://stackoverflow.com/questions/5491196/rewriting-http-url-to-https-using-regular-expression-and-javascript#5491311
  // April 29, 2018
  return thisString.replace(/^http:\/\//i, "https://");
}

function signedOutMessage() {
  $("#loginState").text("Thank you for visiting.");
  // if (user) {
  //   $("#loginState").append(user.displayName);
  // }
  // return null;
}

// https://firebase.google.com/docs/database/web/read-and-write?authuser=0
function writeUserData(userId, name) {
  // userId, name, email, imageUrl
  firebase
    .database()
    .ref("users/" + userId)
    .set({
      username: name
      // username: name,
      // email: email,
      // profile_picture : imageUrl
    });
}

function docReady() {
  var strURI;
  $("#votes").text(votes);
  ObjectID = objectIDs[0];
  strURI = getURI_getObjectInformation(0, objectIDs);
  $("#artGet_form").attr("action", strURI);
  callPMA_getObjectInformation(strURI, 0);
}

function getRandomInt(min, max) {
  // return 1 random integer between min and max
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// https://github.com/jcoffeepot/LottoSim
function getRandomArray(num_elements, min, max) {
  // return 1 array of n random integers between min and max
  var randArray = [];
  var temp, match;
  for (i = 0; i < num_elements; i++) {
    temp = getRandomInt(min, max); // generate new number
    match = 0;
    randArray.forEach(function(element, j) {
      if (temp == randArray[j]) {
        match += 1;
      }
    });
    if (match == 0) {
      // push if no match yet
      randArray.push(temp);
    } else {
      i--;
    }
  }
  randArray.sort((a, b) => a - b);
  return randArray;
}
