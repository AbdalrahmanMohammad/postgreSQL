<?php
// Database connection parameters
$host = "localhost";
$user = "postgres";
$port = 5432;
$password = "admin";
$database = "endeavor";

try {
    // Create a new PDO instance
    $dsn = "pgsql:host=$host;port=$port;dbname=$database";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    function getAllUsers($pdo)
    {
        $sql = "SELECT * FROM users ORDER BY id ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $results;
    }

    // Check if the form is submitted using POST
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Retrieve form data
        $operation = $_POST['operation'];
        $id = $_POST['id'] ?? null;
        $name = $_POST['name'] ?? null;
        $address = $_POST['address'] ?? null;
        $newName = $_POST['new-name'] ?? null;
        $newAddress = $_POST['new-address'] ?? null;

        $sql = '';
        $conditions = [];

        // Build the SQL query based on the operation
        if ($operation == "insert") {
            $sql = "INSERT INTO users (name, address) VALUES (:name, :address);";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['name' => $name, 'address' => $address]);
            $results = getAllUsers($pdo);
            echo json_encode($results);
        }

        if ($operation == "select") {
            $sql = "SELECT * FROM users";

            $conditions = [];
            if ($name) {
                $conditions[] = "name = :name";
            }
            if ($address) {
                $conditions[] = "address = :address";
            }

            if (count($conditions) > 0) {
                $sql .= " WHERE " . implode(" AND ", $conditions);
            }

            $sql .= " ORDER BY id ASC";
            $stmt = $pdo->prepare($sql);

            // Bind parameters dynamically
            if ($name) {
                $stmt->bindParam(':name', $name);
            }
            if ($address) {
                $stmt->bindParam(':address', $address);
            }

            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($results);
            exit;
        }

        if ($operation == "delete") {
            $sql = "DELETE FROM users";

            if ($name) {
                $conditions[] = "name = :name";
            }
            if ($address) {
                $conditions[] = "address = :address";
            }
            if ($id) {
                $conditions[] = "id = :id";
            }

            if (count($conditions) > 0) {
                $sql .= " WHERE " . implode(" AND ", $conditions);
            }

            $sql .= ";";
            $stmt = $pdo->prepare($sql);

            // Bind parameters dynamically
            if ($name) {
                $stmt->bindParam(':name', $name);
            }
            if ($address) {
                $stmt->bindParam(':address', $address);
            }
            if ($id) {
                $stmt->bindParam(':id', $id);
            }

            $stmt->execute();
            $results = getAllUsers($pdo);
            echo json_encode($results);
        }

        if ($operation === "update") {
            $updates = [];

            // Check and add new values to the update statement
            if ($newName) {
                $updates[] = "name = :newName";
            }
            if ($newAddress) {
                $updates[] = "address = :newAddress";
            }

            // Check and add conditions to the WHERE clause
            if ($name) {
                $conditions[] = "name = :name";
            }
            if ($address) {
                $conditions[] = "address = :address";
            }
            if ($id) {
                $conditions[] = "id = :id";
            }

            if (count($updates) === 0) {
                echo "No new values provided for update.";
                return;
            }

            $sql = "UPDATE users SET " . implode(", ", $updates);

            if (count($conditions) > 0) {
                $sql .= " WHERE " . implode(" AND ", $conditions);
            } else {
                echo "No conditions provided for update.";
                return;
            }

            $sql .= ";";
            $stmt = $pdo->prepare($sql);

            // Bind parameters dynamically
            if ($newName) {
                $stmt->bindParam(':newName', $newName);
            }
            if ($newAddress) {
                $stmt->bindParam(':newAddress', $newAddress);
            }
            if ($name) {
                $stmt->bindParam(':name', $name);
            }
            if ($address) {
                $stmt->bindParam(':address', $address);
            }
            if ($id) {
                $stmt->bindParam(':id', $id);
            }

            $stmt->execute();
            $results = getAllUsers($pdo);
            echo json_encode($results);
        }
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>