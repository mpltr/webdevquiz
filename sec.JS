function gbi(id) {
    return document.getElementById(id);
} //Get by ID Shortcut
function gbc(cl) {
    return document.getElementsByClassName(cl);
} //Get by Class Shortcut
function gbt(tag) {
    return document.getElementsByTagName(tag);
} //Get by Tagname Shortcut
function caps(string) {
    if(string == ""){
        return "N/A";
    } else {
    var seperate = string.split("");
    seperate[0] = seperate[0].toUpperCase();
    return seperate.join("");
    }
} //Capitalises first letter of a string
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
                    alert(tempRequest.status);
                }
            }
        }
        this.request.onreadystatechange = reqReadyStateChange;
} 
HttpRequest.prototype.send = function () {
    this.request.send(null);
};
function createTableFromObjectArray(arrayName, tableName, appendTo){
    var createdTable = document.createElement('table');
    createdTable.id = tableName;
    createdTable.insertRow(0);
    createdTable.rows[0].id = tableName + "Header";
    gbi(appendTo).appendChild(createdTable);
    var keyCounter = 0;
    for (var key in arrayName[0]){
            createdTable.rows[0].insertCell(keyCounter);
            createdTable.rows[0].cells[keyCounter].innerHTML = key;
            keyCounter++;
    }
    var arrayLength = arrayName.length;
    for (var i = 1; i < arrayLength; i++){
        createdTable.insertRow(i);
        createdTable.rows[i].className = tableName + "Rows";
        keyCounter = 0;
        for (var key in arrayName[i]){
                createdTable.rows[i].insertCell(keyCounter);
                var keyVal = arrayName[i][key];
                createdTable.rows[i].cells[keyCounter].innerHTML = keyVal;
                keyCounter++;
        }
    }
} //Takes array of objects and lays them out in a table then attaches them to selected element.
function fillTableWithArray(arrayName, tableID){
    var table = gbi(tableID);
    var arrayLength = arrayName.length;
    for (var i = 1; i < arrayLength + 1; i++){
        table.insertRow(i);
        table.rows[i].className = tableID + "Rows";
        var keyCount = 0;
        for (var key in arrayName[i-1]){
            if (key != "hidden"){
                table.rows[i].insertCell(keyCount);
                table.rows[i].cells[keyCount].className = tableID + "Cells";
                table.rows[i].cells[keyCount].innerHTML = arrayName[i-1][key];
                keyCount++;
            }
        }
    }
} // If Table Header is set first
function fillTableWithArrayEditable(arrayName, tableID){
    var table = gbi(tableID);
    var arrayLength = arrayName.length;
    for (var i = 1; i < arrayLength + 1; i++){
        table.insertRow(i);
        table.rows[i].className = tableID + "Rows";
        var keyCount = 0;
        for (var key in arrayName[i-1]){
            if (key != "hidden"){
                table.rows[i].insertCell(keyCount);
                table.rows[i].cells[keyCount].contentEditable = true;
                table.rows[i].cells[keyCount].className = tableID + "Cells";
                table.rows[i].cells[keyCount].innerHTML = arrayName[i-1][key];
                keyCount++;
            }
        }
        table.rows[i].insertCell(keyCount);
        table.rows[i].cells[keyCount].className = tableID + "Cells";
        table.rows[i].cells[keyCount].innerHTML = "<input type='checkbox' class='delCheck'>";
    }
} //Same as above but cells are ContentEditable and contains checkboxes
function clearTable(tableID){
    while(gbi(tableID).rows[1]){
        gbi(tableID).deleteRow(1);
    }
} //Clears a table apart from header    
function searchArrayObjects(searchboxID, arrayName, resultsArray){
    var searchBoxValue = gbi(searchboxID).value.toLowerCase();
    if (searchBoxValue === ""){
        var searchCriteria = searchBoxValue.match(/.*/);
    } else {
        var searchCriteria = searchBoxValue.match(/\w+/g);
    }
    var arrayLength = arrayName.length;
    for (var i=0; i < arrayLength; i++){
        breakout:
        for(var key in arrayName[i]){      
            var searchExp = new RegExp(searchCriteria[0]);
            var keyValue = arrayName[i][key].toString().toLowerCase();
            var tryForMatch = searchExp.test(keyValue);
            if(tryForMatch == true){
                for(var key in arrayName[i]){      
                    var searchExp = new RegExp(searchCriteria[1]);
                    var keyValue = arrayName[i][key].toString().toLowerCase();
                    var tryForMatch = searchExp.test(keyValue);
                    if(tryForMatch == true){
                        resultsArray.push(arrayName[i]);
                        break breakout;
                    }
                }
            }
        }
    }
} //Searches an array of objects for 1-2 key words and passes them to another array.
function addHighlight(selectedClass, highlightClass, target) {
    if (gbc(highlightClass)[0]){
    gbc(highlightClass)[0].className = selectedClass;
    }
    target.className = highlightClass;
} //Puts a chosen highlightClass onto a clicked item and clears any highlights on items in the same selectedClass
function sortObjectArray(sortArray, sortByKey) {
    sortArray.sort(function(a,b){
        var alc = a[sortByKey].toLowerCase(); 
        var blc = b[sortByKey].toLowerCase();
        return alc > blc ? 1 : alc < blc ? -1 : 0;
    }); 
} // Copied, needs research. Sort Object Array by specified key
function monitorTopRow(tableID, callFunction) {
    var numOfCols = gbi(tableID).rows[0].cells.length;
    for (var i = 0; i < numOfCols; i++){
        gbi(tableID).rows[0].cells[i].addEventListener("click", function(){
            callFunction(this);
        })
    }
} //Monitor top row of table with tableID and process callFunction when cell is clicked