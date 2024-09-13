<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Load users from user.txt
$userFile = 'user.txt';
$users = file($userFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

$userList = [];
foreach ($users as $user) {
    $userData = explode(',', $user);
    $userList[] = [
        'id' => trim($userData[0]),
        'email' => trim($userData[1]),
        'role' => trim($userData[3]),
        'active' => true // You can update this based on actual user status if needed
    ];
}

echo json_encode($userList);
?>
