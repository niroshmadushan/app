<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$userFile = 'user.txt';

// Decode the JSON input
$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'];
$email = $input['email'];
$role = $input['role'];
$active = $input['active'] ? 'active' : 'inactive';

// Read the user file
$users = file($userFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$updatedUsers = [];
$userFound = false;

// Loop through each user, find the matching ID, and update the details
foreach ($users as $user) {
    list($userId, $storedEmail, $storedPassword, $storedRole, $storedActive) = explode(',', $user);
    
    if ($userId == $id) {
        // Update the user with new details
        $updatedUsers[] = "$userId,$email,$storedPassword,$role,$active";
        $userFound = true;
    } else {
        // Keep the other users as they are
        $updatedUsers[] = $user;
    }
}

// If user found, update the file
if ($userFound) {
    file_put_contents($userFile, implode(PHP_EOL, $updatedUsers) . PHP_EOL);
    echo json_encode(['success' => true, 'message' => 'User updated successfully', 'users' => $updatedUsers]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}
?>
