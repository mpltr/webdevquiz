function tempQuestion (qu, a1, a2, a3, a4, c1){
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
	var qu = gbi('question').value;
	var a1 = gbi('answerOne').value;
	var a2 = gbi('answerTwo').value;
	var a3 = gbi('answerThree').value;
	var a4 = gbi('answerFour').value;
	var c1 = gbi('correct').value;
	tempArray[tempArray.length] = new tempQuestion (qu, a1, a2, a3, a4, c1);
	var stringedTempArr = JSON.stringify(tempArray);
	gbi('results').innerHTML = stringedTempArr;
})