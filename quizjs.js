//Down buttons
//animation
setInterval('bounce(2)', 2000);

function bounce(Number) {
    for (var i = 0; i < Number; i++) {
        $('.down').animate({
            top: '-=30'
        }, 1000);
        $('.down').animate({
            top: '+=30'
        }, 1000);
        //    $('.up').animate({
        //        top: '+=30'}, 1000);
        //    $('.up').animate({
        //        top: '-=30'}, 1000);
    }
}
gbi('down1').addEventListener("click", function () {
    var target = gbi('topicContainer');
    target.style.display = "block";
    smoothScroll(target);
    setTimeout("gbi('welcome').style.display = 'none';", 650);
})

//Smooth scroll function
function smoothScroll(target) {
    var scrollContainer = target;
    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    scroll = function (c, a, b, i) {
            i++;
            if (i > 30) return;
            c.scrollTop = a + (b - a) / 30 * i;
            setTimeout(function () {
                scroll(c, a, b, i);
            }, 20);
        }
        // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}

// Get question files
function get(url) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        var time = new Date().getTime();
        req.open('GET', url + '?t=' + time);

        req.onload = function () {
            if (req.status == 200) {
                resolve(req.response);
            } else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(Error("Network Error"));
        }

        req.send();
    });
}

// Server request to pull questions then process functions
function importQuestions(grabbed) {
    var parseGrabbed = JSON.parse(grabbed);
    Array.prototype.push.apply(question, parseGrabbed);
}

// Answers Object
function answers(ua, ca, re) {
    this.userAnswer = ua;
    this.correctAnswer = ca;
    this.result = re;
}

// Arrays
var question = new Array();
var selectedQuestion = new Array();
var results = new Array();

var usersNumberOfQuestions = 0;

// Selection Page //
// Highlighting
var topicLength = gbc('topic').length;
for (var i = 0; i < topicLength; i++) {
    gbc('topic')[i].addEventListener("click", function () {
        if (this.className === "topic") {
            this.className = "topicHighlighted";
        } else {
            this.className = "topic";
        }
        checkSelections();
    })
}
var numQuestLength = gbc('numQuest').length;
for (var i = 0; i < numQuestLength; i++) {
    gbc('numQuest')[i].addEventListener("click", function () {
        addHighlight('numQuest', 'numQuestHighlighted', this);
        checkSelections();
    })
};

// Enable / Disable Confirm button check
function checkSelections() {
    if (gbc('topicHighlighted')[0] && gbc('numQuestHighlighted')[0]) {
        gbi('confirm').style.cssText += ';' + 'background-color: #77cc6c; cursor: pointer; opacity:1;';
    } else {
        gbi('confirm').style.cssText += ';' + 'background-color: rgba(121, 121, 121, 0.4); cursor: not-allowed; opacity: 0.5;';
    }
}

// Confirm Function
function confirm() {
    var topics = new Array();
    if (gbc('topicHighlighted')[0]) {
        if (gbc('numQuestHighlighted')[0]) {
            var topicHiglightedLength = gbc('topicHighlighted').length;
            for (var i = 0; i < topicHiglightedLength; i++) {
                topics[i] = 'questions/' + gbc('topicHighlighted')[i].innerHTML.toLowerCase() + '.txt';
            }
            var topicPromises = topics.map(get);
            var sequence = Promise.resolve();
            topicPromises.forEach(function (url) {
                url.then(function (gotten) {
                    var tempArray = JSON.parse(gotten);
                    Array.prototype.push.apply(question, tempArray);
                }).catch(function () {
                    alert('file could not be loaded');
                })

            })
            Promise.all(topicPromises).then(function (urls) {
                var numofQuests = parseInt(gbc('numQuestHighlighted')[0].innerHTML);
                populateSelectedArray(numofQuests);

                var questionMaster = gbi('questionMaster');
                questionMaster.style.display = "block";
                smoothScroll(questionMaster);
                setTimeout("gbi('topicContainer').style.display = 'none';", 650);



                createStacks(numofQuests);
                displayQuestion(0);

            }).catch(function () {
                alert("one or more of the question files could not be loaded");
            })
        } else {
            alert('Please select the number of questions!');
        }
    } else {
        alert("Please select at least one topic!");
        return;
    }
}

// Listen to the confirm button for press then prepare the quiz
gbi('confirm').addEventListener("click", function () {
    confirm();
})


// Populate Selected Questions Array which will be used in the quiz
function populateSelectedArray(numOfQuests) {
    usersNumberOfQuestions = numOfQuests;
    for (var i = 0; i < numOfQuests; i++) {
        do {
            selectedNumber = Math.floor(Math.random() * question.length);
        } while (question[selectedNumber].used === true);
        selectedQuestion[i] = question[selectedNumber];
        question[selectedNumber].used = true; // Stops the same question being added twice
        for (var j = 1; j < 5; j++) { // loop detects the multiple choice number of correct answer, changes number to  correct answer string.
            if (parseInt(selectedQuestion[i].correct) === j) {
                var test = selectedQuestion[i]['answer' + (j.toString())];
                selectedQuestion[i].correct = test;
                j = 5;
            }
        }
    }
}

// Display Question number x
function displayQuestion(number) {
    if (number < usersNumberOfQuestions) {
        if (selectedQuestion[number].type == "multi") {
            var ind = function (number) {
                return '<span class="indicator">' + number + "</span>"
            };
            gbi('answerWrap').style.display = "table";
            gbi('typeWrap').style.display = "none";
            gbi('question').innerHTML = selectedQuestion[number].quest;
            gbi('answerOne').innerHTML = ind(1) + selectedQuestion[number].answer1;
            gbi('answerTwo').innerHTML = ind(2) + selectedQuestion[number].answer2;
            gbi('answerThree').innerHTML = ind(3) + selectedQuestion[number].answer3;
            gbi('answerFour').innerHTML = ind(4) + selectedQuestion[number].answer4;
        } else if (selectedQuestion[number].type == "input") {
            gbi('answerWrap').style.display = "none";
            gbi('typeWrap').style.display = "flex";
            gbi('question').innerHTML = selectedQuestion[number].quest;
            // For the first question, need to wait for page animation to finish before focusing on the type_answer box. focus() has a bug which requires the setTimeout function to be set!
            if (number == 0){
                setTimeout("gbi('type_answer').focus();", 700);
            } else {
                setTimeout("gbi('type_answer').focus();", 1);
            }
        }
        var stack = gbc('stack');
        stack[number].style.color = "#ff2d2d";
        if (number >= 1) {
            stack[number - 1].style.color = "#696969";
            stack[number - 1].style.backgroundColor = "rgba(240, 248, 255, 0.125)";
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
function createStacks(numQuests) {
    var reqWidth = (200 / numQuests);
    while (reqWidth * (Math.ceil(numQuests / 2)) > 100) {
        reqWidth -= 0.1;
    }
    for (var i = 1; i < numQuests + 1; i++) {
        var testDiv = document.createElement("div");
        testDiv.appendChild(document.createTextNode('Q' + i));
        testDiv.style.width = reqWidth + '%';
        //    testDiv.style.fontSize = (5000/reqWidth) + '%'; //need to look at!
        gbi('questionStack').appendChild(testDiv);
        testDiv.className = "stack";
        testDiv.id = ("Q" + i)
    }
}


// Clear answer
function clearAnswer() {
    for (var j = 0; j < 4; j++) {
        if (gbc('answerHighlighted')[j]) {
            gbc('answerHighlighted')[j].className = "answer";
        }
    }
    if (gbi('type_answer')) {
        gbi('type_answer').value = "";
    }
}


// Click Answer Event Listener
for (var i = 0; i < 4; i++) {
    gbc('answer')[i].addEventListener('click', function () {
        clearAnswer();
        this.className = "answerHighlighted";
    })
}

// Click next function
function nextClicked() {
    gbi('next').className = "next-pressed";
    setTimeout("gbi('next').className = 'next-start';", 100);
    setTimeout("storeResult(displayQuestion);", 110); // If result is stored, displayedQuestion
}

//Next Button Event Listener
gbi('next').addEventListener('click', function () {
    nextClicked();
})

//Keyboard Event Listeners
//Enter
gbt('html')[0].onkeypress = function (e) {
    var code = e.keyCode;
    //Enter
    if (code == 13) {
        if (gbi('topicContainer').style.display !== "none") {
            confirm();
        } else if (gbi('questionMaster').style.display !== "none") {
            nextClicked();
        }

    }
    //Number 1
    else if (code == 49 || code == 97) {
        if (gbi('answerWrap').style.display !== "none") {
            clearAnswer();
            gbc('answer')[0].className = "answerHighlighted";
        }
    }
    //Number 2
    else if (code == 50 || code == 98) {
        if (gbi('answerWrap').style.display !== "none") {
            clearAnswer();
            gbc('answer')[1].className = "answerHighlighted";
        }
    }
    //Number 3
    else if (code == 51 || code == 99) {
        if (gbi('answerWrap').style.display !== "none") {
            clearAnswer();
            gbc('answer')[2].className = "answerHighlighted";
        }
    }
    //Number 4
    else if (code == 52 || code == 100) {
        if (gbi('answerWrap').style.display !== "none") {
            clearAnswer();
            gbc('answer')[3].className = "answerHighlighted";
        }
    } else {
        return true;
    }
}




// Create results Object
var currentQuestionNumber = 0;

function storeResult(callback) {
    var detectedAnswer;
    if (gbc('answerHighlighted')[0]) {
        detectedAnswer = gbc('answerHighlighted')[0].innerText;
        detectedAnswer = detectedAnswer.replace(/\d/, '');
    } else if (gbi('type_answer').value !== "") {
        detectedAnswer = gbi('type_answer').value;
    }
    if (detectedAnswer) {
        var userAns = detectedAnswer.toLowerCase();
        userAnsCleaned = userAns.replace(/\"/gi, "'");
        var correctAns = selectedQuestion[currentQuestionNumber].correct.toLowerCase();
        var result = correctOrWrong(userAnsCleaned, correctAns);
        if (result == "Correct!") {
            correctAns = userAns;
        }
        results[currentQuestionNumber] = new answers(userAns, correctAns, result);
        callback(currentQuestionNumber + 1);
        currentQuestionNumber++;
    } else {
        alert("Please select an answer");
    }
}


// compare answers and generate result
function correctOrWrong(uA, cA) {
    if (uA === cA) {
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


// Hover to show correct answer
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

// Play again
gbi('playagain').addEventListener("click", function(){
  location.reload();
})
