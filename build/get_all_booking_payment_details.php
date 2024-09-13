<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Paths to the booking and payment files
$bookingFile = 'book.txt';
$paymentFile = 'payments.txt';

// Function to read a file and return the data as an array of associative arrays
function readFileToArray($filePath, $keys) {
    if (!file_exists($filePath)) {
        return [];
    }
    
    $fileContents = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $data = [];

    foreach ($fileContents as $line) {
        $values = explode(',', $line);
        $data[] = array_combine($keys, $values);
    }

    return $data;
}

// Define the keys for booking and payment records
$bookingKeys = [
    'bookingId', 'guestName', 'guestPhone', 'guestEmail', 'address', 'idPassport',
    'checkInDate', 'checkOutDate', 'roomType', 'numRooms', 'numGuests', 'specialRequests',
    'arrivalTime', 'arrivalMeal', 'departureTime', 'departureMeal'
];

$paymentKeys = [
    'paymentId', 'bookingId', 'paymentMethod', 'amountPaid', 'balanceDue', 'paymentDate', 'paymentStatus'
];

// Read booking and payment data
$bookingData = readFileToArray($bookingFile, $bookingKeys);
$paymentData = readFileToArray($paymentFile, $paymentKeys);

// Return both booking and payment data as JSON
echo json_encode(['bookingData' => $bookingData, 'paymentData' => $paymentData]);
?>
