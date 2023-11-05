<?php
$data = [
    ['id' => 1, 'name' => 'Entry 1', 'datetime' => '2023-11-05 12:00:00'],
    ['id' => 2, 'name' => 'Entry 2', 'datetime' => '2023-11-05 14:30:00'],
    // Add more data as needed
];

// Handle POST requests for adding, editing, or deleting entries
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['action'] === 'add') {
        // Mock adding a new entry
        $newId = max(array_column($data, 'id')) + 1;
        $newEntry = [
            'id' => $newId,
            'name' => $_POST['name'],
            'datetime' => date('Y-m-d H:i:s'),
        ];
        $data[] = $newEntry;
        echo json_encode(['id' => $newId, 'datetime' => $newEntry['datetime']]);
    } elseif ($_POST['action'] === 'edit') {
        // Mock editing an entry
        $id = $_POST['id'];
        $name = $_POST['name'];
        foreach ($data as &$entry) {
            if ($entry['id'] == $id) {
                $entry['name'] = $name;
                break;
            }
        }
        echo json_encode(['success' => true]);
    } elseif ($_POST['action'] === 'delete') {
        // Mock deleting an entry
        $id = $_POST['id'];
        foreach ($data as $key => $entry) {
            if ($entry['id'] == $id) {
                unset($data[$key]);
                break;
            }
        }
        echo json_encode(['success' => true]);
    }
} else {
    // Handle GET request to fetch initial data
    echo json_encode($data);
}
