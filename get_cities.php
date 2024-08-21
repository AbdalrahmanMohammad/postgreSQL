<?php
// Database connection parameters
$host = "localhost";
$user = "postgres";
$port = 5432;
$password = "admin";
$database = "endeavor";

// Create a new PDO instance
try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$database";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    // Return a JSON error response if the connection fails
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}

// Prepare and execute SQL query to get all distinct cities
$sql = "SELECT DISTINCT address FROM users ORDER BY address ASC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the result as JSON
    echo json_encode($result);
} catch (PDOException $e) {
    // Return a JSON error response if the query fails
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
}
?>