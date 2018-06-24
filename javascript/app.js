// Initialize Firebase
var config = {
    apiKey: "AIzaSyB31t9zKLFRV9R7uE57VIY2CHJzqlNeamg",
    authDomain: "trainscheduler-3b1da.firebaseapp.com",
    databaseURL: "https://trainscheduler-3b1da.firebaseio.com",
    projectId: "trainscheduler-3b1da",
    storageBucket: "",
    messagingSenderId: "670791995115"
  };
  
  firebase.initializeApp(config);
  
  var trainData = firebase.database();
  
  // This function will store the user input in firebase
  $("#add-train-btn").on("click", function() {
  
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
  
    // object in firebase
    var newTrain = {
  
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
  
    trainData.ref().push(newTrain);
  
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  
    // text boxes will clear after info is submitted
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  
    return false;
  });
  
  trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
  
    console.log(childSnapshot.val());
  
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;
    var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;
  
    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {
  
      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);


    // New rows are appended to the table
    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
            tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td><td>" + "<input type='submit' value='Remove' class='remove-train btn btn-sm'>" + "</td></tr>");

            // This function will remove the table row when "remove" button is clicked
            $(".remove-train").click(function(){
              $(this).parents('tr').first().remove();
          });

  });


  
