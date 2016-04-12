// shortcuts
function gbi(id) {
    return document.getElementById(id);
}

function gbc(cl) {
    return document.getElementsByClassName(cl);
}
    
function gbt(ta) {
    return document.getElementsByTagName(ta);
}

function HttpRequest(url, callback) {
	this.request = new XMLHttpRequest();
	this.request.open("GET", url);
	var tempRequest = this.request;
	function reqReadyStateChange() {
		if (tempRequest.readyState == 4) {
			if (tempRequest.status == 200) {
				callback(tempRequest.responseText);
			} else {
				alert("An error occurred trying to contact the server.");
			}
		}
	}
	this.request.onreadystatechange = reqReadyStateChange;
}
HttpRequest.prototype.send = function () {
	this.request.send(null);
};

// Question Object
function qanda (qu, a1, a2, a3, a4){
    this.quest = qu,
    this.answer1 = a1,
    this.answer2 = a2,
    this.answer3 = a3,
    this.answer4 = a4;
    this.used = false;
}

// Question Array
var question = new Array();
var selectedQuestion = new Array();
var grabQuestions = new HttpRequest("/questions.txt", importQuestions);
function importQuestions(grabbed){
	var parseGrabbed = JSON.parse(grabbed);	
	question = parseGrabbed;
	populateSelectedArray();
	displayQuestion(0);
	collectCorrectAnswer();
}
grabQuestions.send();

// Selected questions Array
function populateSelectedArray(){
	for (var i =0; i < 20; i++) { //This needs changing once the questions are 20+
		do {
			selectedNumber = Math.floor(Math.random()*question.length);
		} while (question[selectedNumber].used === true);
		selectedQuestion[i] = question[selectedNumber];
		question[selectedNumber].used = true;
	}
}


// Create question container
for (var i=1; i < 21; i++) {
	var testDiv = document.createElement("div");
	testDiv.appendChild(document.createTextNode('Q' + i));
	gbi('questionStack').appendChild(testDiv);
	testDiv.className = "stack";
	testDiv.id = ("Q" + i)
}

////Default Selection
function displayQuestion(number) {
gbi('question').innerText = selectedQuestion[number].quest;
gbi('answerOne').innerText = selectedQuestion[number].answer1;
gbi('answerTwo').innerText = selectedQuestion[number].answer2;
gbi('answerThree').innerText = selectedQuestion[number].answer3;
gbi('answerFour').innerText = selectedQuestion[number].answer4;
}

gbi('Q1').style.backgroundColor = "red";

////Next Button
var currentQuestionNumber = 1;
gbi('next').addEventListener('click', function(){
	processAnswer();
	compareAnswer(currentQuestionNumber-1);
	gbi('Q' + currentQuestionNumber).style.backgroundColor = "#b6ff12";
	currentQuestionNumber++;
	gbi('Q' + currentQuestionNumber).style.backgroundColor = "red";
	displayQuestion(currentQuestionNumber-1);
	alert(COW);
})

// Testing for answer selection
for (var i =0; i<4; i++){
	gbc('answer')[i].addEventListener('click', function(){
		for (var j=0; j<4; j++){
			if(gbc('answerHighlighted')[j]){
				gbc('answerHighlighted')[j].className = "answer";
			}
		}
		this.className = "answerHighlighted";
	})
}

var usersAnswers = new Array();
function processAnswer(){
	if(gbc('answerHighlighted')[0]){
		usersAnswers.push(gbc('answerHighlighted')[0].innerText);
		gbc('answerHighlighted')[0].className = "answer";
	} else {
		alert("you haven't selected an answer");
	}
}

var correctAnswers = new Array();
function collectCorrectAnswer() {
	for(var i=0; i<3; i++){
		for(var j=1; j<5; j++){
			if (selectedQuestion[i].correct === j){
				var answerNum = j.toString();
				correctAnswers.push(selectedQuestion[i]['answer'+ answerNum]);
				
			}
		}
	}
}

var COW = new Array();
function compareAnswer(questnum) {
	if (usersAnswers[questnum] === correctAnswers[questnum]){
		COW.push("Correct!");
	}else{
		COW.push("Wrong!");
	}
}

























// Random Question
//var randomQuestion = question[Math.floor(Math.random()*question.length)]

// Display question
//function displayQuestion() {
//gbi('question').innerText = randomQuestion.quest;
//gbi('answerOne').innerText = randomQuestion.answer1;
//gbi('answerTwo').innerText = randomQuestion.answer2;
//gbi('answerThree').innerText = randomQuestion.answer3;
//gbi('answerFour').innerText = randomQuestion.answer4;
//}

// Tested Selecting questions by clicking
//for (var i=1; i < 20; i++) {
//	gbi('Q' + i).addEventListener('click', function(){
//		for(var j=1; j <20; j++) {
//			gbi('Q' + j).style.backgroundColor = "#b6ff12";
//		}
//		var splitID = this.id;
//		var splitVal = splitID[1] + splitID[2];
//		gbi('question').innerText = selectedQuestion[splitVal].quest;
//		gbi('answerOne').innerText = selectedQuestion[splitVal].answer1;
//		gbi('answerTwo').innerText = selectedQuestion[splitVal].answer2;
//		gbi('answerThree').innerText = selectedQuestion[splitVal].answer3;
//		gbi('answerFour').innerText = selectedQuestion[splitVal].answer4;
//		this.style.backgroundColor = "red";
//	})
//}



