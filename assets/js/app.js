function initApp() {  
  // initialize firebase app 
  let config = {
    apiKey: "AIzaSyBcX9LCQWUodHJkDUMXEd-_pIC77-t7qdE",
    authDomain: "train-scheduler-3d241.firebaseapp.com",
    databaseURL: "https://train-scheduler-3d241.firebaseio.com",
    storageBucket: "train-scheduler-3d241.appspot.com",
    messagingSenderId: "1011356143104"
  };
  firebase.initializeApp(config);
   
  // initialize database
  let database = firebase.database();

  // gather user input and submit to database
  $('.train-form').on('submit', function(event) {
    event.preventDefault();

    // data from input fields
    let trainName = $('#train-name').val().trim();
    let destination = $('#destination').val().trim();
    let firstTrainTime = $('#first-train-time').val().trim();
    let frequency = $('#frequency').val().trim();

    // clear form input fields
    $('#train-name').val('');
    $('#destination').val('');
    $('#first-train-time').val('');
    $('#frequency').val('');

    // create new object with data from input fields
    database.ref().push({
      trainName,
      destination,
      firstTrainTime,
      frequency
    });
  });

  // get snapshot of train data every time 
  // train data is added to database
  database.ref().on('child_added', function(snapshot) {

    // store values from object added to database
    let trainName = snapshot.val().trainName;
    let destination = snapshot.val().destination;
    let firstTrainTime = snapshot.val().firstTrainTime;
    let frequency = snapshot.val().frequency;

    // determine arrival time and minutes away
    let firstTrainTimeConverted = moment(firstTrainTime, "hh:mm");
    let currentTime = moment();
    let timeDiff = currentTime.diff(firstTrainTimeConverted, "minutes"); 

    let minutesAway = frequency - timeDiff % frequency 
    let arrivalTime = moment().add(minutesAway, "minutes").format("h:mm A");
    
    console.log(minutesAway);
    console.log(arrivalTime);

    // add values to table
    $('.train-data').append(`
      <tr>
        <td>${trainName}</td>
        <td>${destination}</td>
        <td>${frequency}</td>
        <td>${arrivalTime}</td>
        <td>${minutesAway}</td>
      </tr>
    `);
  });
}
 
// initialize application
$(document).ready(function() {
  initApp(); 
});
