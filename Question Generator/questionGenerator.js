function tempQuestion (ty, qu, a1, a2, a3, a4, c1){
    this.type = ty;
	this.quest = qu,
	this.answer1 = a1,
	this.answer2 = a2,
	this.answer3 = a3,
	this.answer4 = a4;
	this.used = false;
	this.correct = c1;
}

function gbi(id) {
	return document.getElementById(id);
}

function gbc(cl) {
	return document.getElementsByClassName(cl);
}

function gbt(ta) {
	return document.getElementsByTagName(ta);
}

var tempArray = new Array();

gbi('create').addEventListener('click', function(){
    var typeSplit           = gbi('type').value.split('\n');
    var questionSplit       = gbi('question').value.split('\n');
    var firstAnswerSplit    = gbi('answerOne').value.split('\n');
    var secondAnswerSplit   = gbi('answerTwo').value.split('\n');
    var thirdAnswerSplit    = gbi('answerThree').value.split('\n');
    var fourthAnswerSplit   = gbi('answerFour').value.split('\n');
    var correctAnswerSplit  = gbi('correct').value.split('\n');
    
    for (var i = 0; i < questionSplit.length; i++){
        var ty = typeSplit[i];
        var qu = questionSplit[i];
        var a1 = firstAnswerSplit[i];
        var a2 = secondAnswerSplit[i];
        var a3 = thirdAnswerSplit[i];
        var a4 = fourthAnswerSplit[i];
        var c1 = correctAnswerSplit[i];
        tempArray[tempArray.length] = new tempQuestion (ty, qu, a1, a2, a3, a4, c1);
    }
    var data    = JSON.stringify(tempArray);
    var dest    = gbi('topicSelect').value;
    var params  = 'data=' + data + '&dest=' + dest;
    var url     = 'addQuestions.php'; 
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST",url,true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("Content-length", params.length);
    xmlhttp.setRequestHeader("Connection", "close");
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			 alert("Exported!")
            alert(xmlhttp.responseText);
		}
	}
	xmlhttp.send(params);
})

var displayQuestions = new XMLHttpRequest();
displayQuestions.open("GET", "../questions/github.txt", true);
displayQuestions.onreadystatechange=function(){
    if (displayQuestions.readyState==4 && displayQuestions.status==200){
        var preParse = displayQuestions.responseText;
        var parsed = JSON.parse(preParse);
        createTableFromObjectArray(parsed, 'tempTable', 'body');
        for(var i = 0; i < parsed.length; i++){
            gbi('type').value += parsed[i].type + '\n';
            gbi('question').value += parsed[i].quest + '\n';
            gbi('answerOne').value += parsed[i].answer1 + '\n';
            gbi('answerTwo').value += parsed[i].answer2+ '\n';
            gbi('answerThree').value += parsed[i].answer3+ '\n';
            gbi('answerFour').value += parsed[i].answer4 + '\n';
            gbi('correct').value += parsed[i].correct + '\n';
        }
    }
}
displayQuestions.send(null);






