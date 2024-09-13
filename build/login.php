<?php
// Allow requests from any origin (you can restrict this to a specific origin if needed)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Continue with login logic
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'];
$password = $input['password'];

// Path to the user.txt file
$userFile = 'user.txt';

// Check if the user file exists
if (!file_exists($userFile)) {
    echo json_encode(['success' => false, 'message' => 'User file not found']);
    exit;
}

// Read the user file and find the matching user
$users = file($userFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
foreach ($users as $user) {
    list($id, $storedEmail, $storedPassword, $role) = explode(',', $user);

    // Check if email and password match
    if ($storedEmail === $email && $storedPassword === $password) {
        // Return success with user data
        echo json_encode([
            'success' => true,
            'user' => [
                'email' => $storedEmail,
                'role' => $role
            ]
        ]);
        exit;
    }
}

// If no match found, return error
echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
exit;
?>
