/* Loads the information table and disables placement button on start*/

$( document ).ready(function() {
  console.log( "ready!" );
  $('#my-table').dynatable();
  document.getElementById("togglee").disabled = true;
});


/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */

function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

/* Variables used to hold specific values from the fetch request to display as graph */

let address = "https://carepulseuk-development.herokuapp.com/api/skills_assessment/?limit=1655"
let total = 0;
let vacant = 0; 
let closed = 0;
let occupiedValue = 0;
let occupiedDifference = 0;
let count = 0;
let vacantIDs = [];
let idVal = 0;
let currentVacancy = 0;
let extra = [];
let currentid = 0;

/* Fetch request used to load json file from the /address endpoint */

fetch(address)
.then(res => Promise.all([res.status, res.json()]))
.then(([status, jsonData]) => {
  console.log(jsonData);
  console.log(status);
  
  for (let i = 0;i < 1655;i++){
    total += (jsonData.results[i].no_beds);

    vacant += (jsonData.results[i].vacant_beds);

    if (jsonData.results[i].closed == true){
      closed++;
    }

    if (jsonData.results[i].vacant_beds > 0){
      vacantIDs.push(jsonData.results[i].id);
    }



  }
/* Calculation of a section of the pie chart to display */
  
  occupiedValue = (Math.floor((((total - vacant) / total) * 100)));
  occupiedDifference = (100 - occupiedValue);
  countVal = jsonData.count;
  console.log(occupiedValue + " " + occupiedDifference);
  console.log(closed)

  let modifiedJSON = jsonData
  delete modifiedJSON.results.provider;

  
  console.log(modifiedJSON);
  
/* Calling the dynatable method to generate a table with data from the database */
  $('#my-final-table').dynatable({
    dataset: {
      records: jsonData.results
    }


  });




/* Data from the database is plotted*/
  
  BedPlot = document.getElementById('Bed');
  let data = [{
  //occupied value && occupied difference 
  values: [Number(occupiedValue), Number(occupiedDifference)],
  labels: ['Occupied', 'Vacant'],
  type: 'pie'
}];

let layout = {
  title: 'The percentage of all occupied beds',
  height: 310,
  width: 310
};

/* Data from the database is plotted*/
  
Plotly.newPlot(BedPlot, data, layout, {responsive: true});

/* Animation is used to display a count up to a value using a timer*/
  
$('.text').find('span.s').text(total);
$('.s').each(function () {
  $(this).prop('Counter',0).animate({
    Counter: $(this).text()
  }, {
    duration: 4000,
    easing: 'swing',
    step: function (now) {
      $(this).text(Math.ceil(now));
    }
  });
});
  
/* Animation is used to display a count up to a value using a timer*/
  
$('.text2').find('span.s2').text(closed);
$('.s2').each(function () {
  $(this).prop('Counter',0).animate({
    Counter: $(this).text()
  }, {
    duration: 4000,
    easing: 'swing',
    step: function (now) {
      $(this).text(Math.ceil(now));
    }
  });
});
  
  /* Animation is used to display a count up to a value using a timer*/
  
$('.text3').find('span.s3').text(vacant);
$('.s3').each(function () {
  $(this).prop('Counter',0).animate({
    Counter: $(this).text()
  }, {
    duration: 4000,
    easing: 'swing',
    step: function (now) {
      $(this).text(Math.ceil(now));
    }
  });
});
  
/* Other chart is plotted using variables from the json loaded from the fetch call*/
  
let closedValue = (closed / 1655 * 100);
ClosedPlot = document.getElementById('Closed');
let data2 = [{
  values: [Number(closedValue), Number((100 - closedValue))],
  labels: ['Closed', 'Open'],
  type: 'pie'
}];

let layout2 = {
  title: 'The percentage of closed care homes',
  height: 310,
  width: 310
};

Plotly.newPlot(ClosedPlot, data2, layout2, {responsive: true});
});   

/* A call is provided whenever an input is done on the search bar and makes a request to the database.
This allows for dynamic fetching of data and responsive output as an option to make a placement.
*/

$("#txt_Search").keyup( function() {
  let searchQuery = $("#txt_Search").val();
  let newAddress = 'https://carepulseuk-development.herokuapp.com/api/skills_assessment/'
  let addressConcat = newAddress.concat(searchQuery);
  idVal = searchQuery;
  fetch(addressConcat)
  .then(res => Promise.all([res.status, res.json()]))
  .then(([status2, jsonData2]) => {
    console.log(jsonData2);
    console.log(status2);

     /* Vacant checkbox is locked so the event always occurs, but a check is done to check 
     if the number of vacant beds is more than 0, if not- no information will be displayed
     and the make placement feature will be kept locked.
    */
   
    
    if($('#Vacant').prop('checked')) {
      if (jsonData2.vacant_beds > 0 && jsonData2.vacant_beds != null){
        $('.text4').find('span.s4').text('There is a vacant bed available. Make a placement?');
        document.getElementById("togglee").disabled = false;

        if($('#Over65').prop('checked')) {
         extra = jsonData2.service_user_bands;
         currentid = 1;
         if (checkExists() == true){
          $('.text4').find('span.s4').text('There is vacancy and caring for over 65.');
          document.getElementById("togglee").disabled = false;
        } else {
          $('.text4').find('span.s4').text('There is vacancy but no caring for over 65.');
          document.getElementById("togglee").disabled = true; 
        }
      }
      
         /* If any fruther requirements are selected, a check is done on those checkboxes 
    to ensure that particular ID has an ID value for service bands that exists.
    */

      if($('#Dementia').prop('checked')) {
       extra = jsonData2.service_user_bands;
       currentid = 3;
       if (checkExists() == true){
        $('.text4').find('span.s4').text('There is vacancy and caring for Dimentia. Make placement?');
        document.getElementById("togglee").disabled = false;
      } else {
        $('.text4').find('span.s4').text('There is vacancy but no caring for Dimentia.');
        document.getElementById("togglee").disabled = true;
      }
    }

    if($('#Learning').prop('checked')) {
     extra = jsonData2.service_user_bands;
     currentid = 7;
     if (checkExists() == true){
      $('.text4').find('span.s4').text('There is vacancy and caring for Learning Difficulties. Make placement?');
      document.getElementById("togglee").disabled = false;
    } else {
      $('.text4').find('span.s4').text('There is vacancy but no caring for Learning Difficulties.');
      document.getElementById("togglee").disabled = true;
    }
  }

}

else {
  $('.text4').find('span.s4').text('There are no beds available.');
  document.getElementById("togglee").disabled = true;
  /* A stub for further ideas*/
  $('.text5').find('span.s5').text('');

}
}

});
});

 /* 
 Make placement uses a fetch call to get the details of a particular ID's regarding current vacency whose endpoint lies in 
 /api/skills_assessment/id. This value is then decreased by one and another ajax call is used to patch the value.

This function ?(makePlacement()) can only be called given the fetch conditions from earlier is met (vacant_beds >0)
so no further checks are needed to decrement the value past as values can't be decreased past 0.
    */

function makePlacement(){

  let url= 'https://carepulseuk-development.herokuapp.com/api/skills_assessment/'
  let urlNew = url.concat(idVal)
  

  fetch(urlNew)
  .then(res => Promise.all([res.status, res.json()]))
  .then(([status3, jsonData3]) => {
    console.log(jsonData3);
    console.log(status3);
    let currentVacancy = jsonData3.vacant_beds;
    let newVacancy = (currentVacancy - 1);
    

    var patch = {
      "vacant_beds" : newVacancy
    }

    $.ajax({
     type: 'PATCH',
     url: urlNew,
     accept: 'application/json',
     contentType: 'application/json',
     data: JSON.stringify(patch), dataType: "json",
     contentType: 'application/json; charset=utf-8',
     'success': function(data) {
      console.log('success');
      $('.text4').find('span.s4').text('Sucessful placement made to id: ' + idVal );
      document.getElementById("togglee").disabled = false;
    },
      'error': function(jqXHR, textStatus, errorThrown) {
        $('.text4').find('span.s4').text('Unsuccessfull placement');
        alert(' Error in processing! '+textStatus + 'error: ' + errorThrown);
      },
      /* success and error handling omitted for brevity */



    });
  });

}

 /* 
 This function is used to traverse through the different criteria required per care home.
 A true value returned means that there is a value such as ("id":1) which matches for both 
 the query data and the desired result. 
    */

function checkExists(){
  var hasMatch =false;
  for (var index = 0; index < extra.length; ++index) {

    var test = extra[index];
    console.log("test: " + test);
    if(test.id == currentid){
     hasMatch = true;
     break;
   }
 }
 console.log(hasMatch + "has match");
 return hasMatch;
}

/* Clears the input box if the checkbox was pressed to recall the function by keypress on input*/

function clearInputBox(){
   $("#txt_Search").val('');
}






