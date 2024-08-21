let inputs = document.querySelectorAll("form input:not([type='submit']),#cities");
let operation = document.querySelector("select#menu");
let form = document.querySelector("form");
let table = document.querySelector("table");

const postData = async (url = '', data = {}) => {
    // console.log(data)
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header        
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
            result = await postData('../get_cities.php', { });
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


form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // console.log(`Form ${operation.value} submitted with values:`);
    inputs.forEach(input => {
        if (input.disabled == false && input.value != "")
            console.log(`${input.id}: ${input.value}`);
    });

    const inputValues = {};

    inputs.forEach(input => {
        inputValues[input.id] = input.value;
    });
    console.log(inputValues);

    const formData = new FormData(event.target);

    try {
        const result = await postData('../process_form.php', { formData });
        // if (operation.value == "select")
        //     showInTable(result.result)
        // else {
        //     sql = 'SELECT * FROM users ORDER BY id ASC;';

        //     const result = await postData('/execute', { sql });
        //     showInTable(result.result)
        // }
        console.log('Server response:', result);
    } catch (error) {
        console.error('Error sending SQL statement:', error);
    }


    // let sql = '';
    // if (operation.value == "insert") {
    //     sql = `INSERT INTO users (name, address) VALUES ('${inputValues.name}', '${inputValues.address}'); `;
    //     console.log(sql);
    // }
    // if (operation.value == "select") {
    //     sql = 'SELECT * FROM users ';
    //     const conditions = [];

    //     if (inputValues.name) {
    //         conditions.push(`name = '${inputValues.name}'`);
    //     }
    //     if (inputValues.cities) {
    //         conditions.push(`address = '${inputValues.cities}'`);
    //     }

    //     if (conditions.length > 0) {
    //         sql += ' WHERE ' + conditions.join(' AND ');
    //     }
    //     sql += " ORDER BY id ASC;";
    //     console.log(sql);
    // }
    // if (operation.value == "delete") {
    //     sql = `delete from users`;

    //     const conditions = [];

    //     if (inputValues.name) {
    //         conditions.push(`name = '${inputValues.name}'`);
    //     }
    //     if (inputValues.address) {
    //         conditions.push(`address = '${inputValues.address}'`);
    //     }
    //     if (inputValues.id) {
    //         conditions.push(`id = '${inputValues.id}'`);
    //     }

    //     if (conditions.length > 0) {
    //         sql += ' WHERE ' + conditions.join(' AND ');
    //     }

    //     sql += ";";
    //     console.log(sql);
    // }
    // if (operation.value === "update") {
    //     sql = 'UPDATE users SET';
    //     const updates = [];
    //     const conditions = [];

    //     // Check and add new values to the update statement
    //     if (inputValues['new-name']) {
    //         updates.push(`name = '${inputValues['new-name']}'`);
    //     }
    //     if (inputValues['new-address']) {
    //         updates.push(`address = '${inputValues['new-address']}'`);
    //     }

    //     // Check and add conditions to the WHERE clause
    //     if (inputValues['name']) {
    //         conditions.push(`name = '${inputValues['name']}'`);
    //     }
    //     if (inputValues['address']) {
    //         conditions.push(`address = '${inputValues['address']}'`);
    //     }
    //     if (inputValues['id']) {
    //         conditions.push(`id = ${inputValues['id']}`);
    //     }

    //     // Ensure there's at least one update to make
    //     if (updates.length === 0) {
    //         console.error('No new values provided for update.');
    //         return;
    //     }

    //     // Append updates to the SQL query
    //     sql += ' ' + updates.join(', ');

    //     // Ensure there's at least one condition for the WHERE clause
    //     if (conditions.length > 0) {
    //         sql += ' WHERE ' + conditions.join(' AND ');
    //     } else {
    //         console.error('No conditions provided for update.');
    //         return;
    //     }

    //     sql += ";";
    //     console.log(sql);
    // }
    // console.log("***************");
    // try {
    //     const result = await postData('/execute', { sql });
    //     if (operation.value == "select")
    //         showInTable(result.result)
    //     else {
    //         sql = 'SELECT * FROM users ORDER BY id ASC;';

    //         const result = await postData('/execute', { sql });
    //         showInTable(result.result)
    //     }
    //     console.log('Server response:', result);
    // } catch (error) {
    //     console.error('Error sending SQL statement:', error);
    // }
    // console.log("***************");

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
