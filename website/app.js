let inputs = document.querySelectorAll("form input:not([type='submit']),#cities");
let operation = document.querySelector("select#menu");

operation.addEventListener('change', function(event) {
    // Get the selected value from the event
    controlInputs(event.target.value);
});

// Function to control inputs based on the selected value
function controlInputs(selectedValue) {
    // Disable and hide all inputs
    inputs.forEach(input => {
        disableAndHide(input);
    });

    // Enable and show specific inputs based on the selected value
    if (selectedValue === "select") {
        inputs.forEach(input => {
            if (input.id === "name" || input.id === "cities") {
                enableAndShow(input);
            }
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

    console.log('Selected value:', selectedValue);
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

