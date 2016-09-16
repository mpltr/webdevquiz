function tempQuestion (ty, qu, a1, a2, a3, a4, c1, to){
    this.type = ty;
	this.quest = qu,
	this.answer1 = a1,
	this.answer2 = a2,
	this.answer3 = a3,
	this.answer4 = a4;
	this.used = false;
	this.correct = c1;
    this.topic = to;
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

var topicArray = ['css', 'html', 'javascript', 'jquery', 'php', 'powershell'];
var capTopicArray = ['CSS', 'HTML', 'JavaScript', 'jQuery', 'PhP', 'PowerShell'];
var topicArrayLength = topicArray.length;
gbi('create').addEventListener('click', function(){
    var typeSplit           = gbi('type').value;
    var questionSplit       = gbi('question').value;
    var firstAnswerSplit    = gbi('answerOne').value;
    var secondAnswerSplit   = gbi('answerTwo').value;
    var thirdAnswerSplit    = gbi('answerThree').value;
    var fourthAnswerSplit   = gbi('answerFour').value;
    var correctAnswerSplit  = gbi('correct').value;
    var topic               = gbi('topicSelect').value
        var ty = typeSplit;
        var qu = questionSplit;
        var a1 = firstAnswerSplit;
        var a2 = secondAnswerSplit;
        var a3 = thirdAnswerSplit;
        var a4 = fourthAnswerSplit;
        var c1 = correctAnswerSplit;
        var to = null;
        for (var i = 0; i < topicArrayLength; i++){
            if(topic === topicArray[i]){
                to = capTopicArray[i];
            }
        }
        tempArray[tempArray.length] = new tempQuestion (ty, qu, a1, a2, a3, a4, c1, to);
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
            location.reload();
		}
	}
	xmlhttp.send(params);
})







