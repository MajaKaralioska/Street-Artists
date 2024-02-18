import { getCurrentArtist } from "../globals.js";
import {  items } from "../../data/data.js";
import { addNewItemFunction, cancelNewItem, resetInputValues } from "./addNewItem.js";
import {  startCountdown } from "../AuctionPage/auction.js";

//selectors
const artistTitle = document.querySelector('.title-items');
const container = document.getElementById('artist-items-container');
const overlay = document.querySelector('.confirm-screen-overlay');
const confirmPopUp = document.querySelector('.confirm-popup');

let itemID; // Define itemID globally

// get the current Artist chosen to be the title in the navbar
export function updateArtistItems() {
    const title = getCurrentArtist();
    artistTitle.textContent = title;
}
// in the page show only the items from the current artist
export function currentArtistItems() {
    const currentArtist = getCurrentArtist();
    const itemsArtist = items.filter(item => item.artist === currentArtist);
    console.log("Items to be rendered:", itemsArtist);

    container.innerHTML = '';

    itemsArtist.forEach(item => {
        const card = renderArtistCard(item);
        container.appendChild(card);
    });   
}

// function for rendering cards on the page and their looks and style
export function renderArtistCard(item, idx) {
    const formattedDate = new Date(item.dateCreated).toLocaleDateString('en-GB');
    const isDark = idx % 2 ? 'dark' : 'light';

    // Create the main card container
    const card = document.createElement('div');
    card.className = 'col-12 col-12 col-md-3 mb-4 mr-md-2 p-0 shadow artistItem';
    card.setAttribute('id', `${item.id}`)

    // Create the card content
    const cardContent = document.createElement('div');
    cardContent.className = `card card-bg-${isDark}`;

    // Create the image element
    const image = document.createElement('img');
    image.src = `${item.image}`;
    image.className = 'img-fluid';
    image.alt = item.id;

    // Create the card body container
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body row';

    // Create the left column with title and date
    const leftColumn = document.createElement('div');
    leftColumn.className = 'col-9';

    const title = document.createElement('p');
    title.className = 'item-title';
    title.textContent = item.title;

    const date = document.createElement('p');
    date.className = 'item-date';
    date.textContent = formattedDate;

    leftColumn.appendChild(title);
    leftColumn.appendChild(date);

    // Create the right column with price
    const rightColumn = document.createElement('div');
    rightColumn.className = 'col-3 text-right';

    const priceLink = document.createElement('a');
    priceLink.href = '#';
    priceLink.className = 'btn item-btn';
    priceLink.textContent = `${item.price}$`;

    rightColumn.appendChild(priceLink);

    // Create the description container
    const description = document.createElement('div');
    description.className = 'col-12 py-2';

    const descriptionText = document.createElement('p');
    descriptionText.className = 'card-text';
    descriptionText.textContent = item.description;

    description.appendChild(descriptionText);

    // Create the button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'col-12 bg-brown d-flex justify-content-around py-3';

    const sendToAuctionBtn = document.createElement('button');
    sendToAuctionBtn.className = 'btn btn-blue';
    sendToAuctionBtn.id = 'sendToAuctionbtn';
    sendToAuctionBtn.textContent = 'Send to Auction';
    sendToAuctionBtn.addEventListener('click', (e) => {
        e.target.classList.remove('btn-blue');
        e.target.classList.add('btn-primary');
        e.target.textContent = 'Item on Auction';
    }
    )
    const publishBtn = document.createElement('button');
    publishBtn.className = 'btn btn-success';
    publishBtn.id = 'publishBtn';
    if (!item.isPublished) {
        publishBtn.textContent = "Publish";
        publishBtn.classList.add('btn-light')
        } else {
        publishBtn.textContent = "Unpublish";
        }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-orange';
    removeBtn.id = 'removeBtn';
    removeBtn.textContent = 'Remove';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn card-bg-light';
    editBtn.id = 'editBtn';
    editBtn.textContent = 'Edit';

    buttonContainer.appendChild(sendToAuctionBtn);
    buttonContainer.appendChild(publishBtn);
    buttonContainer.appendChild(removeBtn);
    buttonContainer.appendChild(editBtn);

    // Append all created elements to the card
    card.appendChild(cardContent);
    cardContent.appendChild(image);
    cardContent.appendChild(cardBody);
    cardBody.appendChild(leftColumn);
    cardBody.appendChild(rightColumn);
    cardBody.appendChild(description);
    cardBody.appendChild(buttonContainer);

    const btn = card.querySelector('.btn');
    btn.classList.add(isDark === 'dark' ? 'card-bg-light' : 'card-bg-dark');

    return card;
}

let editNewItemBtn;

document.addEventListener('click', (e) => {
    const { target } = e;

    // Check if the clicked element is a button
    if (target.nodeName === 'BUTTON') {
        const actionItem = target.closest(".artistItem");
        const actionItemId = actionItem ? actionItem.id : null;
        const itemIndex = actionItemId ? items.findIndex(item => item.id === +actionItemId) : -1;

        if (target.matches("#removeBtn")) {
            overlay.classList.add("active");
            confirmPopUp.classList.add("active");
            itemID = actionItemId;
            console.log("Item ID to be removed:", itemID);
            // Log the element with the corresponding ID
            const itemToRemove = document.getElementById(itemID);
            console.log("Element to be removed:", itemToRemove);

        } else if (target.matches("#publishBtn")) {
            items[itemIndex].isPublished = !items[itemIndex].isPublished;
            if (items[itemIndex].isPublished) {
                target.textContent = "Unpublish";
                target.classList.remove('btn-light');
                target.classList.add('btn-success');
            } else {
                target.textContent = "Publish";
                target.classList.remove('btn-success');
                target.classList.add('btn-light');
            }
            const itemsLSString = localStorage.getItem('items_LS');
            const items_LS = JSON.parse(itemsLSString) || [];
            const isPublishedItemIndex = items_LS.findIndex(item => item.id === +actionItemId);

            if (isPublishedItemIndex !== -1) {
                items_LS[isPublishedItemIndex].isPublished = items[itemIndex].isPublished;
                localStorage.setItem('items_LS', JSON.stringify(items_LS));
            }
        }
        else if (target.matches('#sendToAuctionbtn')) {
          
        const noAuctionSnap = document.querySelector('.no-auction-snap');
        noAuctionSnap.style.display = 'none';

        // Get item details
        const artistItem = e.target.closest('.artistItem');
        const itemId = artistItem.id;
        const itemName = artistItem.querySelector('.item-title').textContent;
        const itemDateText = artistItem.querySelector('.item-date').textContent;
        const itemPrice = artistItem.querySelector('.item-btn').textContent;
        const itemImage = artistItem.querySelector('img').src;

        // Convert itemDateText to a Date object
        const itemDate = new Date(itemDateText);

        // Create an object to represent the item
        const itemToSendToAuction = {
            itemId: itemId,
            itemName: itemName,
            itemDate: itemDate,
            itemPrice: itemPrice,
            itemImage: itemImage,
            description: artistItem.querySelector('.card-text').textContent.trim(),
            type: item.type || "Default type",
            isPublished: item.isPublished || true,
            isAuctioning: true,
            dateSold: null,
            priceSold: null,
        };

        // Call the function to send the item to auction
        sendToAuction(itemToSendToAuction);
    } 
    else if (target.matches('#editBtn')) {
            location.hash = 'add-new-item';
        
            const addNewItem = document.getElementById('add-new-item');
            const artistItemsContainer = document.getElementById('artistsItems');
        
            // Show the edit mode form
            addNewItem.style.display = 'block';
            artistItemsContainer.style.display = 'none';
        
            // Retrieve the selected item based on the clicked item's ID
            const selectedItem = items.find(item => item.id === +actionItemId);
        
            if (!selectedItem) {
                console.error("Selected item not found.");
                return;
            }
        
            // Update the form fields with the selected item's data
            const mainTitle = document.querySelector('.main-title');
            const isPublished = document.getElementById('isPublished');
            const titleInput = document.getElementById('textInput');
            const description = document.getElementById('description');
            const selectType = document.getElementById('addType');
            const price = document.getElementById('addPrice');
            const capturedImage = document.querySelector('.captured-image');
            const date = document.querySelector('.item-date');
            const addBtn = document.getElementById('addBtn');
            const imageUrl = document.getElementById('imageUrl');
            const deleteBtn = document.querySelector('.del-img-btn');
            const trashImage = document.querySelector('.trashImage');
            const takeSnapshot = document.getElementById('takeShapshot');
            const snapShotImage = document.querySelector('.shapShotImage');
            const snapShotPara = document.querySelector('.mt-2.takeShapshotPara');
        
            mainTitle.textContent = 'Edit Item';
            isPublished.checked = selectedItem.isPublished;
            titleInput.value = selectedItem.title;
            description.value = selectedItem.description;
            selectType.value = selectedItem.type; // Pre-select the optionType
            price.value = selectedItem.price;
            date.textContent = new Date().toLocaleDateString('en-GB');
            imageUrl.value = selectedItem.image;
            deleteBtn.style.display = 'block';
            trashImage.style.display = 'block';
            takeSnapshot.style.display = 'none';
            snapShotImage.style.display = 'none';
            snapShotPara.style.display = 'none';
            capturedImage.src = selectedItem.image;
            capturedImage.style.display = 'block';
            capturedImage.style.height = '217px';
        
            addBtn.textContent = 'Save';

            deleteBtn.addEventListener('click', (event)=> {
                event.preventDefault();
                event.target.style.display = 'none';
                trashImage.style.display = 'none';
                capturedImage.style.display = 'none';
                
                takeSnapshot.style.display = 'block';
                snapShotImage.style.display = 'block';
                snapShotPara.style.display = 'block';
            
                // Set imageUrl input value to the captured image URL
                imageUrl.value = ''; //  clear the existing value
                capturedImage.src = ''; // clear the existing image source
            });
            
            editNewItemBtn = function () {
               
                if (!selectedItem) {
                    console.error("Selected item not found.");
                    return;
                }
            
                // Check if a new image is captured and update the imageUrl accordingly
                if (capturedImage.src) {
                    imageUrl.value = capturedImage.src;
                }
            
                updateEditedItem(selectedItem);
            
                location.hash = 'artistsItems';
                addNewItem.style.display = 'none';
                artistItemsContainer.style.display = 'block';
            
                resetInputValues();
            };
        
            function updateEditedItem(selectedItem) {
                selectedItem.isPublished = isPublished.checked;
                selectedItem.title = titleInput.value;
                selectedItem.description = description.value;
                selectedItem.type = selectType.value;
                selectedItem.price = price.value;
                selectedItem.image = imageUrl.value;
                selectedItem.date = new Date().toLocaleDateString('en-GB');
                // Update the displayed date in the UI
                date.textContent = selectedItem.date;
            
                const itemsLSString = localStorage.getItem('items_LS');
                const items_LS = JSON.parse(itemsLSString) || [];
                const itemIndex = items_LS.findIndex(item => item.id === +actionItemId);
            
                if (itemIndex !== -1) {
                    items_LS[itemIndex] = selectedItem;
                    localStorage.setItem('items_LS', JSON.stringify(items_LS));
                }
            
                const cardToUpdate = document.getElementById(actionItemId);
                if (cardToUpdate) {
                    // Assuming renderArtistCard updates the date in the card content
                    cardToUpdate.innerHTML = renderArtistCard(selectedItem);
                } else {
                    console.error("Card to update not found in the UI.");
                }
            }
                addBtn.removeEventListener('click', addNewItemFunction);
            if (addBtn.textContent === 'Save') {
                addBtn.addEventListener('click', editNewItemBtn);
            }
        }
    }});

export { editNewItemBtn }; // export the function so you can remove the event listener in addNewItemMode
 
    const addNewItemBtn = document.getElementById('addNewItemBtn')
    addNewItemBtn.addEventListener('click', () => {
        location.hash = 'add-new-item';
        const mainTitle = document.querySelector('.main-title');
        const addBtn = document.getElementById('addBtn');
        mainTitle.textContent = 'Add new Item';
        addBtn.textContent = 'Add new Item';
        addBtn.removeEventListener('click', editNewItemBtn)
        addBtn.addEventListener('click',addNewItemFunction ) 
    });

// Event listener for confirmation popup
confirmPopUp.addEventListener("click", (e) => {
    const { target } = e;
    const itemsLSString = localStorage.getItem('items_LS');
    const items_LS = JSON.parse(itemsLSString) || [];
    const itemIndex = items_LS.findIndex(item => item.id === +itemID);

    if (target.matches(".cancel")) {
        overlay.classList.remove("active");
        confirmPopUp.classList.remove("active");
    } else if (target.matches(".confirm")) {
        overlay.classList.remove("active");
        confirmPopUp.classList.remove("active");

        if (itemIndex !== -1 && items_LS[itemIndex]) {
            items_LS.splice(itemIndex, 1);
        }

        localStorage.setItem('items_LS', JSON.stringify(items_LS));

        // Remove the item from the rendered items
        const itemsArtist = items.filter(item => item.artist === getCurrentArtist());
        const updatedItemsArtist = itemsArtist.filter(item => item.id !== +itemID);

        // Render the updated items
        container.innerHTML = '';
        updatedItemsArtist.forEach(item => {
            const card = renderArtistCard(item);
            container.appendChild(card);
        });
    }
});


// Function to update the item in items_LS
function updateLocalStorageItem(updatedItem) {
    const existingItems = JSON.parse(localStorage.getItem('items_LS')) || [];
    const updatedItems = existingItems.map(item => (item.itemId === updatedItem.itemId ? updatedItem : item));
    localStorage.setItem('items_LS', JSON.stringify(updatedItems));
}


let isAuctionInProgress = false; // Variable to track auction status

function sendToAuction(item) {
    // Check if an auction is already in progress
    if (isAuctionInProgress) {
        alert('Auction is already in progress. Cannot start a new auction.');
        return;
    }

    // Set auction in progress flag
    isAuctionInProgress = true;

    // Hide the no-auction-snap element
    const noAuctionSnap = document.querySelector('.no-auction-snap');
    noAuctionSnap.style.display = 'none';

    // Create the auction item HTML
    const imageUrl = item.itemImage ? item.itemImage : 'fallback_image_url.jpg';
    const itemArtist = getCurrentArtist();

    const auctionItemHtml = `
        <div class="col-12 col-md-6 mb-4 mx-auto p-0 shadow auctionItem" id="${item.itemId}">
            <div class="card card-bg-light">
                <img src="${imageUrl}" class="img-fluid" alt="${item.itemId}">
                <div class="card-body row">
                    <div class="col-9">
                        <h4 class="card-artist h3">${item.itemName}</h4>
                    </div>
                    <div class="col-3 text-right ">
                        <a href="#" class="btn btn-brown">${item.itemPrice}</a>
                    </div>
                    <div class="col-12 text-center">
                        <h6>By ${itemArtist}</h6>
                    </div>
                </div>
            </div>
        </div>`;

    // Update the auction container with the HTML
    const auctionContainer = document.querySelector('.auction-item-container');
    auctionContainer.innerHTML = auctionItemHtml;

    // Display the bid content
    const bidContent = document.querySelector('.bid-content');
    bidContent.style.display = 'block';

    // Get existing items from Local Storage
    const existingItems = JSON.parse(localStorage.getItem('items_LS')) || [];

    // Update the isAuctioning property in the existing items
    const updatedItems = existingItems.map(existingItem => {
        if (existingItem.itemId === item.itemId) {
            return { ...existingItem, isAuctioning: true };
        }
        return existingItem;
    });

    // Store the updated items back in Local Storage
    localStorage.setItem('items_LS', JSON.stringify(updatedItems));

    // Update the item in Local Storage (call this function)
    updateLocalStorageItem({ ...item, isAuctioning: true });

     // Start the countdown
     startCountdown(2,0)
}













  

