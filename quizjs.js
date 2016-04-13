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
var grabQuestions = new HttpRequest("/questions.txt", importQuestions);
function importQuestions(grabbed){
	var parseGrabbed = JSON.parse(grabbed);	
	question = parseGrabbed;
	populateSelectedArray();
	displayQuestion(0);            //Display the first question
}
grabQuestions.send();

// Populate Selected Array
function populateSelectedArray(){
    for (var i =0; i < 20; i++) { //This needs changing once the questions are 20+
        do {
            selectedNumber = Math.floor(Math.random()*question.length);
        } while (question[selectedNumber].used === true);
        selectedQuestion[i] = question[selectedNumber];
        question[selectedNumber].used = true; // Stops the same question being added twice
        for (var j=1; j <5; j++) {  // loop detects number of correct answer, changes number to  correct answer string.
            if (selectedQuestion[i].correct === j){
                selectedQuestion[i].correct = selectedQuestion[i]['answer' + (j.toString())];
            }
        }
    }
}
//Display Question +
function displayQuestion(number) {
gbi('question').innerText = selectedQuestion[number].quest;
gbi('answerOne').innerText = selectedQuestion[number].answer1;
gbi('answerTwo').innerText = selectedQuestion[number].answer2;
gbi('answerThree').innerText = selectedQuestion[number].answer3;
gbi('answerFour').innerText = selectedQuestion[number].answer4;
var stack = gbc('stack');
stack[number].style.color = "red";
if (number >= 1){
    stack[number -1].style.color = "grey";
}
clearAnswer();   
//    stack[(number+1)].COL = "white";
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
        var userAns = detectedAnswer.value;                                 //| Set properties
        var correctAns = selectedQuestion[currentQuestionNumber].correct;   //| for creating 
        var result = function(){                    
            if (userAns === correctAns){
                return "Correct!";
            } else {
                return "Wrong";
            }
        }                                      //| answer object
        results[currentQuestionNumber] = new answers(userAns, correctAns, result);
        callback(currentQuestionNumber + 1);
        currentQuestionNumber++;
    }else{
        alert("Please select an answer");
    }
}

// Display the Results 
function displayResults(){
        for(var i = 0; i < usersAnswers.length; i++){  
            gbi("resultsTable").insertRow(-1);
            var rows = gbi("resultsTable").rows;
            var lastRow = rows[rows.length - 1];
            lastRow.className += " tableRow";
            lastRow.insertCell(0);
            lastRow.insertCell(1);
            lastRow.insertCell(2);

            lastRow.cells[0].innerHTML = usersAnswers[i];
            lastRow.cells[1].innerHTML = correctAnswers[i];
            lastRow.cells[2].innerHTML = COW[i];
                
                    
                    
            }
        
    }



//
//var usersAnswers = new Array();
//function processAnswer(){
//	if(gbc('answerHighlighted')[0]){
//		usersAnswers.push(gbc('answerHighlighted')[0].innerText);
//		gbc('answerHighlighted')[0].className = "answer";
//        compareAnswer(currentQuestionNumber-1);
//        gbi('Q' + currentQuestionNumber).style.color = "#9b9b9b";
//        currentQuestionNumber++;
//        if (usersAnswers.length < 4){ //changed for testing, orig val 19
//        gbi('Q' + currentQuestionNumber).style.color = "red"; 
//        displayQuestion(currentQuestionNumber-1);
//        } else {
//            gbi('questionMaster').style.display = "none";
//            gbi('results').style.display = "block";
//            displayResults();
//        }
//	} else {
//		alert("Please select an answer");
//	}
//}
//
//var correctAnswers = new Array();
//function collectCorrectAnswer() {
//	for(var i=0; i<4; i++){
//		for(var j=1; j<5; j++){
//			if (selectedQuestion[i].correct === j){
//				var answerNum = j.toString();
//				correctAnswers.push(selectedQuestion[i]['answer'+ answerNum]);
//				
//			}
//		}
//	}
//}
//
//var COW = new Array();
//function compareAnswer(questnum) {
//	if (usersAnswers[questnum] === correctAnswers[questnum]){
//		COW.push("Correct!");
//	}else{
//		COW.push("Wrong!");
//	}
//}