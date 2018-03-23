// Set up variables
var val_1, operator, val_2, result;
var operators = ['+', '-', '*', '/'];
var status = 'easy';
var point = 0;
var bestScore = 0 ;
var gameState = 'choosing'; // choosing, started, gameover
var maxTime = 15, timeLeft;
var math_it_up = {
    '+': function (x, y) { return x + y },
    '-': function (x, y) { return x - y },
    '*': function (x, y) { return x * y },
    '/': function (x, y) { return x / y }
};
var person = 'Yourname', highestPerson = '';

// On the game start
gameInit();

// On the game ready
$(document).ready(function() {
  $("#wrong-button").on("click", function() {
    if (gameState == "choosing" || gameState == "gameover"){
      window.open("https://juantorres.co");
    } else
      onWrongButton();
  });
  $("#right-button").on("click", function() {
    if (gameState == "choosing"){
      onGameStart();
    } else if (gameState == "gameover"){
      gameInit();
      gameState = "choosing";
    } else
      onRightButton();
  });
  $("#easy-button").on("click", function() {
    if (gameState == 'choosing' || gameState == 'gameover')
      onOptionButton('easy');
  });
  $("#normal-button").on("click", function() {
    if (gameState == 'choosing' || gameState == 'gameover')
      onOptionButton('normal');
  });
  $("#hard-button").on("click", function() {
    if (gameState == 'choosing' || gameState == 'gameover')
      onOptionButton('hard');
  });
  $(".answer").on("click", function() {
    if (gameState == 'choosing' || gameState == 'gameover')
      var temp = prompt("Please enter your name", "Your name");
      if (temp != null) {
       person=temp.substring(0, 20);
       $(".answer").html(person); 
      }
  });
});

//Game Init
function gameInit(){
  point = 0;
  timeLeft = maxTime;
  updateNameAndHighscore();
  $('.question').html('Crazy Math');
  $('#right-button').html('Start');
  $('#wrong-button').html('Quit');
  $('.answer').fadeIn(10).html(person);
  $('.point').html('Best: ' + bestScore);
  
  onOptionButton(status);
}

// Generate questions
function generateRandomQuestion(option){
 
  if (option === "easy"){
    val_1 = getRandomInt(-10, 10);
    val_2 = getRandomInt(-10, 10);
    operator = operators[getRandomInt(0, 1)];
  } else if (option === "normal"){
    val_1 = getRandomInt(-20, 20);
    val_2 = getRandomInt(-20, 20);
    operator = operators[getRandomInt(0, 2)];
  } else {
    val_1 = getRandomInt(-50, 50);
    val_2 = getRandomInt(-50, 50);
    operator = operators[getRandomInt(0, 3)];
  }
  
//Get result
  if (getRandomInt(0, 1))
    result = math_it_up[operator](val_1, val_2) + getRandomInt(-10, 10);
  else 
    result = math_it_up[operator](val_1, val_2);
  //Diplay the equation
  $('.question').html(val_1 + '<span class="operator">' + operator + '</span>' + val_2 + '<span class="equal">=</span>' + Number(result.toFixed(2)));
}

// On Right Chosen
function onRightButton(){
  if (result == math_it_up[operator](val_1, val_2)){
    point++;
    timeLeft = maxTime;
    generateRandomQuestion(status);
    
    $(".point").html(point);
    $(".answer").html('<i class="fa fa-check" aria-hidden="true"></i>');
  } else {
    $(".answer").html('<i class="fa fa-times" aria-hidden="true"></i>');
    onGameOver();
  }
  $(".answer").fadeIn(200, function(){
      $(".answer").fadeOut(300);
  });

}

// On Wrong Chosen
function onWrongButton(){
  if (result != math_it_up[operator](val_1, val_2)){
    point++;

    $(".point").html(point);
    timeLeft = maxTime;
    $(".answer").html('<i class="fa fa-check" aria-hidden="true"></i>');
    generateRandomQuestion(status);
  } else  {
    $(".answer").html('<i class="fa fa-times" aria-hidden="true"></i>');
    onGameOver();
  }
  $(".answer").fadeIn(200, function(){
      $(".answer").fadeOut(300);
  });
}

function onOptionButton(_status){
  $('#easy-button').removeClass("button-active");
  $('#normal-button').removeClass("button-active");
  $('#hard-button').removeClass("button-active");
  $('#'+_status+'-button').addClass("button-active");
  status = _status;
}

function onGameStart(){
  gameState = "start";
  generateRandomQuestion(status);
  $('#right-button').html('Right');
  $('#wrong-button').html('Wrong');
  $('#right-button').html('Right').css("width", "50%").css("font-size", "35px").css("text-transform", "capitalize");
  $('#wrong-button').html('Wrong').css("display", "initial").css("width", "50%").css("padding", "15px");
  $('.point').html(point);
  $('.answer').html('');
}

function onGameOver(){
  gameState = "gameover";
  if (point>bestScore){
      bestScore = point;
      putData(person, bestScore);
      highestPerson = person;
  };
  
  $('.question').html('Score: ' + point).fadeIn(1000);
  $('.point').html(highestPerson +': ' + bestScore);
  $('#right-button').html('Again').css("width", "100%").css("font-size", "45px").css("text-transform", "uppercase");
  $('#wrong-button').html('Quit').css("display", "none");
  // $('#right-button').html('Again').css("background-color","#417164");
  // $('#wrong-button').html('Quit').css("background-color","#e46651");
}

//get random result
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Update the count down every 1 second
setInterval(function() {
  if (gameState == 'start'){
    timeLeft -= 0.5;
    if (timeLeft >= 0)
     $('.time-slider').css('width', 100 * timeLeft/maxTime +'%');
    else 
      onGameOver();
  } else {
    $('.time-slider').css('width', '100%');
  }
    
}, 500);


function updateNameAndHighscore(){
  //Get json
  $.getJSON( "https://crazy-math-thunghiem.c9users.io/get", function(data) {
    //alert(data.name + ': ' + data.point );
    highestPerson = data[0].name;
    bestScore = data[0].point;
    if (gameState == 'choosing')
      $('.point').html('Best: ' + bestScore);
  });
}
//putData("Thu", 1);
function putData(name, point){
 
  //  $.getJSON( "https://crazy-math-thunghiem.c9users.io/" + name +'/'+point, function(data) {
  //   //alert(data[0].name + ': ' + data[0].point );
  //   updateNameAndHighscore();
  // });
  $.post( "https://crazy-math-thunghiem.c9users.io/create", { name: name, point: point })
  .done(function( data ) {
    console.log("Post");
  });
  
}