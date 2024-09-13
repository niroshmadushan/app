<?php
// Allow requests from any origin (for CORS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight (CORS preflight request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set content type to JSON
header('Content-Type: application/json');

// Retrieve start and end dates from POST request
$startDate = isset($_POST['startDate']) ? $_POST['startDate'] : null;
$endDate = isset($_POST['endDate']) ? $_POST['endDate'] : null;

// Function to filter data by date range
function filterDataByDate($filePath, $dateFieldIndex, $startDate, $endDate) {
    $entries = [];
    $startDateTime = strtotime($startDate);
    $endDateTime = strtotime($endDate . ' 23:59:59'); // Include the whole day

    if (file_exists($filePath)) {
        $file = fopen($filePath, 'r');
        while (($line = fgets($file)) !== false) {
            $fields = explode(',', trim($line));
            $entryDate = strtotime(trim($fields[$dateFieldIndex]));

            if ($entryDate >= $startDateTime && $entryDate <= $endDateTime) {
                $entries[] = [
                    'id' => $fields[0],
                    'product' => $fields[1],
                    'quantity' => $fields[2],
                    'unitPrice' => $fields[3],
                    'total' => $fields[4],
                    'date' => date('Y-m-d H:i:s', $entryDate)
                ];
            }
        }
        fclose($file);
    }
    return $entries;
}

// Fetch and filter GRN, GON, and Current Stock entries based on date range
$grnEntries = filterDataByDate('grn.txt', 5, $startDate, $endDate);
$gonEntries = filterDataByDate('gon.txt', 4, $startDate, $endDate);
$currentStock = filterDataByDate('currentstock.txt', 4, $startDate, $endDate);

// Return the filtered data as JSON
echo json_encode([
    'success' => true,
    'grnEntries' => $grnEntries,
    'gonEntries' => $gonEntries,
    'currentStock' => $currentStock
]);
?>

