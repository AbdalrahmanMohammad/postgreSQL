let inputs = document.querySelectorAll("form input:not([type='submit']),#cities");
let operation = document.querySelector("select#menu");
let form = document.querySelector("form");
let table = document.querySelector("table");

const postData = async (url = '', data) => {
    // console.log(data)
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        body: (data), // body data type must match "Content-Type" header        
    });

    try {
        const newData = await response.json();
        return newData
    } catch (error) {
        console.log("error", error);
    }
}

operation.addEventListener('change', function (event) {
    // Get the selected value from the event
    controlInputs(event.target.value);
});

// Function to control inputs based on the selected value
async function controlInputs(selectedValue) {
    // Disable and hide all inputs
    inputs.forEach(input => {
        input.value = "";
        disableAndHide(input);
    });

    // Enable and show specific inputs based on the selected value
    if (selectedValue === "select") {
        let result;

        try {
            result = await postData('../get_cities.php', {});
            console.log('Server response:', result);
        } catch (error) {
            console.error('Error sending SQL statement:', error);
        }

        inputs.forEach(input => {
            if (input.id === "name" || input.id === "cities") {
                enableAndShow(input);
            }
        });

        let citiesSelect = document.querySelector("#cities");
        citiesSelect.innerHTML = `<option value="">All cities</option>`;
        result.forEach(item => {
            const option = document.createElement("option");
            option.textContent = item.address;
            option.value = item.address;
            citiesSelect.appendChild(option);
        });
    } else if (selectedValue === "delete") {
        inputs.forEach(input => {
            if (input.id === "name" || input.id === "id" || input.id === "address") {
                enableAndShow(input);
            }
        });
    } else if (selectedValue === "update") {
        inputs.forEach(input => {
            if (input.id === "name" || input.id === "id" || input.id === "address" || input.id === "new-name" || input.id === "new-address") {
                enableAndShow(input);
            }
        });
    } else if (selectedValue === "insert") {
        inputs.forEach(input => {
            if (input.id === "name" || input.id === "address") {
                enableAndShow(input);
            }
        });
    }

    // console.log('Selected value:', selectedValue);
}

controlInputs("insert");// choose insert the the page load ( the default chicked option )

function disableAndHide(element) {
    if (element) {
        element.disabled = true;
        element.style.display = 'none';
    } else {
        console.error('Element not found or invalid');
    }
}
function enableAndShow(element) {
    if (element) {
        element.disabled = false;
        element.style.display = '';
    } else {
        console.error('Element not found or invalid');
    }
}


// Add an event listener to the form element
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Create a FormData object from the form element
    const formData = new FormData(form);

    try {
        const response = await fetch('../process_form.php', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            const result = await response.text();
                showInTable(JSON.parse(result))
        } else {
            console.error('Server error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }

    console.log(operation.value);

});

function showInTable(values) {
    const tbody = document.querySelector('table tbody');

    // Clear existing rows
    tbody.innerHTML = '';

    // Check if values is an array and has elements
    if (Array.isArray(values) && values.length > 0) {
        values.forEach(row => {
            // Create a new row
            const tr = document.createElement('tr');

            // Create and append cells
            const idCell = document.createElement('td');
            idCell.textContent = row.id || '';
            tr.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = row.name || '';
            tr.appendChild(nameCell);

            const addressCell = document.createElement('td');
            addressCell.textContent = row.address || '';
            tr.appendChild(addressCell);

            // Append the row to the table body
            tbody.appendChild(tr);
        });
    } else {
        console.log('No data available or data format is incorrect.');
    }
}
