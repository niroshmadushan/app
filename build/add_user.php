<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Path to the user.txt file
$userFile = 'user.txt';

// Function to check if the email already exists
function emailExists($email, $userFile) {
    if (!file_exists($userFile)) {
        return false; // If the file doesn't exist, no email exists
    }

    $users = file($userFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($users as $user) {
        $userData = explode(',', $user);
        if (trim($userData[1]) === $email) {
            return true; // Email already exists
        }
    }
    return false;
}

// Get input from the request
$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$role = $input['role'] ?? 'User'; // Default role is 'User'
$password = 'User@12345'; // Default password

// Check if email is valid
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}

// Check if email already exists in user.txt
if (emailExists($email, $userFile)) {
    echo json_encode(['success' => false, 'message' => 'Email already exists.']);
    exit;
}

// If the file doesn't exist, create it
if (!file_exists($userFile)) {
    file_put_contents($userFile, ""); // Create the file if it doesn't exist
}

// Append the new user to user.txt
$id = count(file($userFile)) + 1; // Generate a new ID based on file line count
$newUser = "$id,$email,$password,$role" . PHP_EOL;
file_put_contents($userFile, $newUser, FILE_APPEND);

echo json_encode(['success' => true, 'message' => 'User added successfully.']);
?>
