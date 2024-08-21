<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    hello world!
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

        // Prepare the SQL statement
        $stmt = $pdo->prepare("SELECT * FROM users");

        // Execute the prepared statement
        $stmt->execute();

        // Fetch all the rows
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Iterate and print the fetched rows
        foreach ($users as $user) {
            print_r($user);
        }
    } catch (PDOException $e) {
        // Handle any errors
        echo "Error: " . $e->getMessage();
    }
    ?>

</body>

</html>