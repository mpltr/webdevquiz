<?php  
    $dest = $_POST['dest'];
    $data = $_POST['data'];
    $exist = file_get_contents("../questions/" . $dest . ".txt");
    $tempArray = json_decode($exist);
    	// var_dump($tempArray) . '<br><br>';
    $incomingArray = json_decode($data);
    	// var_dump($incomingArray);
    $mergedArray = array_merge_recursive($tempArray, $incomingArray);
    $writeArray = json_encode($mergedArray);
    var_dump($writeArray);
    file_put_contents("../questions/" . $dest . ".txt", $writeArray);
?>