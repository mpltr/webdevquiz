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

// Answers Object
function answers(ua, ca, re){
    this.userAnswer = ua;
    this.correctAnswer = ca;
    this.result = re;
}

// Arrays
var question = new Array();
var selectedQuestion = new Array();
var results = new Array();

// Server request to pull questions then process functions
var grabQuestions = new HttpRequest("questions.txt", importQuestions);
function importQuestions(grabbed){
	var parseGrabbed = JSON.parse(grabbed);	
	question = parseGrabbed;
	populateSelectedArray();
	displayQuestion(0);            //Display the first question
}
grabQuestions.send();

// Populate Selected Array
function populateSelectedArray(){
    for (var i =0; i < 20; i++) { 
        do {
            selectedNumber = Math.floor(Math.random()*question.length);
        } while (question[selectedNumber].used === true);
        selectedQuestion[i] = question[selectedNumber];
        question[selectedNumber].used = true; // Stops the same question being added twice
        for (var j=1; j <5; j++) {  // loop detects number of correct answer, changes number to  correct answer string.
            if (parseInt(selectedQuestion[i].correct) === j){
                var test = selectedQuestion[i]['answer' + (j.toString())];
                selectedQuestion[i].correct = test;
                j = 5;
            }
        }
    }
}
//Display Question +
function displayQuestion(number) {
	if (number < 20){ // Change to change number of questions before going to results page
gbi('question').innerHTML = selectedQuestion[number].quest;
gbi('answerOne').innerHTML = selectedQuestion[number].answer1;
gbi('answerTwo').innerHTML = selectedQuestion[number].answer2;
gbi('answerThree').innerHTML = selectedQuestion[number].answer3;
gbi('answerFour').innerHTML = selectedQuestion[number].answer4;
var stack = gbc('stack');
stack[number].style.color = "#ff2d2d";
if (number >= 1){
    stack[number -1].style.color = "grey";
}
clearAnswer();   
	} else {
		gbi('questionMaster').style.display = "none";
		gbi('results').style.display = "block";
		displayResults();
		listenToRows();
	}

}

// Create question Number container (STACKS)
for (var i=1; i < 21; i++) {
	var testDiv = document.createElement("div");
	testDiv.appendChild(document.createTextNode('Q' + i));
	gbi('questionStack').appendChild(testDiv);
	testDiv.className = "stack";
	testDiv.id = ("Q" + i)
}

// Clear answer
function clearAnswer(){
    for (var j=0; j<4; j++){
        if(gbc('answerHighlighted')[j]){
            gbc('answerHighlighted')[j].className = "answer";
        }
    }
}

// Click Answer Event Listener
for (var i =0; i<4; i++){
	gbc('answer')[i].addEventListener('click', function(){
        clearAnswer();
		this.className = "answerHighlighted";
	})
}

//Next Button Event Listener
gbi('next').addEventListener('click', function(){
    storeResult(displayQuestion); // If result is stored, displayedQuestion 
})

// Create results Object
var currentQuestionNumber = 0;
function storeResult (callback) {
    var detectedAnswer = gbc('answerHighlighted')[0];
    if(detectedAnswer){   
        var userAns = detectedAnswer.innerHTML;                                 //| Set properties
        var correctAns = selectedQuestion[currentQuestionNumber].correct;   //| for creating 
        var result = correctOrWrong(userAns, correctAns);
            
            
                                             //| answer object
        results[currentQuestionNumber] = new answers(userAns, correctAns, result);
        callback(currentQuestionNumber + 1);
        currentQuestionNumber++;
    }else{
        alert("Please select an answer");
    }
}

// compare answers and generate result
function correctOrWrong(uA, cA){                    
    if (uA === cA){
        return "Correct!";
    } else {
        return "Wrong!";
    }
}

// Display the Results 
function displayResults(){
        for(var i = 0; i < results.length; i++){  
            gbi("resultsTable").insertRow(-1);
            var rows = gbi("resultsTable").rows;
            var lastRow = rows[rows.length - 1];
            lastRow.className += " tableRow";
            lastRow.insertCell(0);
            lastRow.insertCell(1);
            lastRow.insertCell(2);
            lastRow.insertCell(3);
			lastRow.insertCell(4);
            
            lastRow.cells[0].innerHTML = i+1;
			lastRow.cells[1].innerHTML = selectedQuestion[i].quest;
			lastRow.cells[2].innerHTML = results[i].userAnswer;
			lastRow.cells[3].innerHTML = results[i].correctAnswer;
			lastRow.cells[3].style.display = "none";
			lastRow.cells[3].className = "correct";
            
            if (results[i].result === "Correct!"){
                lastRow.className = "correct";
                lastRow.cells[4].innerHTML = '<img src="correct.png">';  
            } else {
                lastRow.className = "wrong";
                lastRow.cells[4].innerHTML = '<img src="wrong.png">';  
            }
        }
	var totalWrong = gbc('wrong').length; //dodgy maths. Could throw up bugs
	var totalQuestions = gbi('resultsTable').rows.length - 1;
	var totalCorrect = totalQuestions - totalWrong;
}

function listenToRows(){
	for (var j=1; j < results.length+ 1 ; j++){
gbi('resultsTable').rows[j].addEventListener('mouseenter',function(){
	this.cells[3].style.display = "table-cell";
	this.cells[2].style.display = "none";
})
gbi('resultsTable').rows[j].addEventListener('mouseleave',function(){
	this.cells[3].style.display = "none";
	this.cells[2].style.display = "table-cell";
})
	}
}