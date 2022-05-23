// executes after the DOM fully loads
window.onload=function(){

    // add item button
    const addNewItemButton = document.getElementById('addItemButton');
    addNewItemButton.addEventListener('click', addNewItemButtonHandler);

    // edit item button 
    const editNewItemButton = document.getElementById('editItemButton');
    editNewItemButton.addEventListener('click', editNewItemButtonHandler);
}

function addNewItemButtonHandler() {
    console.log('The add item button is clicked');

    const name = document.getElementById('addItemName').value;
    const quantity = document.getElementById('addItemQuantity').value;

    const data = {
        name: name,
        quantity: quantity
    };

    const options = {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }

    // use fetch API to trigger a PUT request
    fetch(document.location.pathname, options)
        .then(function(response) {
        if(response.ok) {
            console.log('New item is added');
            return;
        }
        throw new Error('Request failed.');
        })
        .catch(function(error) {
        console.log(error);
        });
};

function editNewItemButtonHandler(event) {
    console.log('The edit item button is clicked');

    const originalName = selectedItem;
    debugger;

    const name = document.getElementById('editItemName').value;
    const quantity = document.getElementById('editItemQuantity').value;

    const data = {
        name: name,
        quantity: quantity
    };

    const options = {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }

    // use fetch API to trigger a PUT request
    fetch(document.location.pathname + '/' + name, options)
        .then(function(response) {
        if(response.ok) {
            console.log('The item is updated');
            return;
        }
        throw new Error('Request failed.');
        })
        .catch(function(error) {
        console.log(error);
        });
}