const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const clearBtn = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

//Function to display items from storage
function displayItems(){
    const itemsFromStorage = getItemsFromLocalStorage();
    itemsFromStorage.forEach(item => addItemToDom(item));

    checkUI();
}


// Function foe adding item to ul

function onAddItemSubmit(e){
    e.preventDefault();
    const newItem =itemInput.value;

    //Validate Input
    if (newItem === ''){
     alert('Please add an item');
     return;
    }

    //Check for edit mode
    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemsFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if(checkIfItemExists(newItem)){
            alert('That item already exists !');
            return;
        }
    }

    // Adding new element to DOM
    addItemToDom(newItem);
   
    // Add item to local storage
    addItemToLocalStorage(newItem);
    
    checkUI();
    itemInput.value = '';

}

//Function to add items to dom
function addItemToDom (item){

   // Creating new list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

//Function to add items to local storage

function addItemToLocalStorage (item){
    let itemsFromStorage = getItemsFromLocalStorage();
    //Add new item to array
    itemsFromStorage.push(item);

    // Convert to JSON string and set to local storage
    localStorage.setItem('items' , JSON.stringify(itemsFromStorage));
}

//Function to get elements from Local storage
function getItemsFromLocalStorage (){
    
    if(localStorage.getItem('items')===null){
        itemsFromStorage = [];
    }
    else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
   return itemsFromStorage;
}


//Function to create button
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

//Function to create icon of button
function createIcon(classes){
    const icon = document.createElement('i');
    icon.className=classes;
    return icon;
}

// Function to create on click item
function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeListItem(e.target.parentElement.parentElement);
    }
    else{
        setItemToEdit (e.target);
    }
}

//Function to check if item already exists
function checkIfItemExists (item){
    const itemsFromStorage = getItemsFromLocalStorage();
    return itemsFromStorage.includes(item);
}

//Function to set item to Edit
function setItemToEdit(item){
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
    formBtn.style.backgroundColor = 'green';
    itemInput.value = item.textContent;

}

//Function to remove list item by clicking button
function removeListItem(item){
    //Remove Item from DOM
    item.remove();

    //Remove Item from Local Storage
   removeItemsFromStorage(item.textContent);

   checkUI();
}

//Function to Remove items from Storage
function removeItemsFromStorage (item) {
 let itemsFromStorage = getItemsFromLocalStorage();

 //Filter out Items to be removed
 itemsFromStorage = itemsFromStorage.filter((i) => i != item);
 //Re-Set local storage
 localStorage.setItem('items' , JSON.stringify(itemsFromStorage));
}

//Function to clear all list items
function clearAllListItems(){
    alert('Are you sure you want to remove all Items ?');
 while(itemList.firstChild){
    itemList.removeChild(itemList.firstChild);
 }

 //Clear all items from Local storage
 localStorage.removeItem('items');
 checkUI();

}

//Function to filter list items
function filterList(e){
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text)!=-1){
            item.style.display = 'flex';
        } else{
            item.style.display = 'none';
        }
    });
}

//Function to reset UI
function checkUI() {
    itemInput.value = '';
  
    const items = itemList.querySelectorAll('li');
  
    if (items.length === 0) {
      clearBtn.style.display = 'none';
      itemFilter.style.display = 'none';
    } else {
      clearBtn.style.display = 'block';
      itemFilter.style.display = 'block';
    }
  
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
  
    isEditMode = false;
  }

//Initilize App
function init(){
    checkUI();
     // Event Listeners
    itemForm.addEventListener('submit' , onAddItemSubmit);
    itemList.addEventListener('click' , onClickItem);
    clearBtn.addEventListener('click' , clearAllListItems);
    itemFilter.addEventListener('input' , filterList);
    document.addEventListener('DOMContentLoaded', displayItems);
}

init();
