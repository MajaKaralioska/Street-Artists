import { getCurrentArtist } from "../globals.js";
import { itemTypes, items } from "../../data/data.js";
import { currentArtistItems } from "./artistItems.js";

// Global constants and variables
const title = document.querySelector('.title-add');
const select = document.getElementById('addType');
const isPublished = document.getElementById('isPublished');
const titleInput = document.getElementById('textInput');
const description = document.getElementById('description');
const selectType = document.getElementById('addType');
const price = document.getElementById('addPrice');
const capturedImage = document.querySelector('.captured-image');
const dateCreated = new Date().toLocaleDateString('en-GB');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const addNewItemForm = document.getElementById('add-new-item');
const artistItemsContainer = document.getElementById('artistsItems');
const imageUrl = document.getElementById('imageUrl');
const trashImage = document.querySelector('.trashImage');
const snapshotPopup = document.getElementById('snapshotPopup');
const takeSnapshotLink = document.getElementById('takeShapshot');
const snapShotImage = document.querySelector('.shapShotImage');
const takeSnapshotPara = document.querySelector('.takeShapshotPara');
const trashCan = document.querySelector('.del-img-btn');

export function updateTitle() {
    const navtitle = getCurrentArtist();
    title.textContent = navtitle;
}

export function chooseTypeDropdown() {
    // Populate the dropdown with itemTypes
    itemTypes.forEach(type => {
        const optionHidden = document.createElement('option');
        const option = document.createElement('option');
        option.value = 'Choose';
        optionHidden.setAttribute('hidden', true);
        optionHidden.textContent = 'Choose'
        option.value = type;
        option.textContent = type;
        select.appendChild(optionHidden);
        select.appendChild(option);
    });
}

export function addNewItemFunction() {

  const titleValue = titleInput.value;
  const descriptionValue = description.value;
  const typeValue = selectType.value;
  const isPublishedValue = isPublished.checked;
  const priceValue = price.value;
  
  // Check if the imageUrl input has a value
  const imageSource = imageUrl.value ? imageUrl.value : capturedImage.src;

  const newItem = {
      id: generateUniqueId(),
      image: imageSource,
      title: titleValue,
      description: descriptionValue,
      type: typeValue,
      isPublished: isPublishedValue,
      price: priceValue,
      artist: getCurrentArtist(),
      dateCreated: dateCreated,
      dateSold: null,
      priceSold: null,
      isAuctioning: false
  };

  const newItemHTML = `
      <div class="col-12 col-md-3 mb-4 mr-md-2 p-0 shadow artistItem" id=${newItem.id}>
          <div class="card card-bg-light">
              <img src="${newItem.image}" class="img-fluid" alt="${newItem.title}">
              <div class="card-body row">
                  <div class="col-9">
                      <p class="item-title">${newItem.title}</p>
                      <p class="item-date">${newItem.dateCreated}</p>
                  </div>
                  <div class="col-3 text-right">
                      <a href="#" class="btn item-btn card-bg-dark">${newItem.price}$</a>
                  </div>
                  <div class="col-12 py-2">
                      <p class="card-text">${newItem.description}</p>
                  </div>
                  <div class="col-12 bg-brown d-flex justify-content-around py-3">
                      <button class="btn btn-primary" id="sendToAuctionbtn">Send to Auction</button>
                      <button class="btn ${isPublishedValue ? 'btn-success' : 'btn-light'}" id="publishBtn">${isPublishedValue ? 'Unpublish' : 'Publish'}</button>
                      <button class="btn btn-orange" id="removeBtn">Remove</button>
                      <button class="btn card-bg-light" id="editBtn">Edit</button>
                  </div>
              </div>
          </div>
      </div>`;

  const itemsContainer = document.getElementById('artist-items-container');
  itemsContainer.innerHTML += newItemHTML;

  resetInputValues();
  addNewItemForm.style.display = 'none';
  artistItemsContainer.style.display = 'block';
  items.push(newItem);

  const storedItems = localStorage.getItem('items_LS');
  const existingItems = storedItems ? JSON.parse(storedItems) : [];

  existingItems.push(newItem);
  localStorage.setItem('items_LS', JSON.stringify(existingItems));
}

export function cancelNewItem() {
    resetInputValues();
    addNewItemForm.style.display = 'none';
    artistItemsContainer.style.display = 'block';
    currentArtistItems()
}

export function resetInputValues() {
    titleInput.value = '';
    description.value = '';
    selectType.value = 'Choose';
    isPublished.checked = true;
    price.value = '';
    imageUrl.value = ''; 

    // Reset the captured image UI
    capturedImage.src = '';
    capturedImage.style.display = 'none';
    trashImage.style.display = 'none';
    trashCan.style.display = 'none';
    takeSnapshotLink.style.display = 'block';
    snapShotImage.style.display = 'block';
    snapShotImage.style.textAlign = 'center';
    takeSnapshotPara.style.display = 'block';
    snapshotPopup.style.display = 'flex'; 
}

function generateUniqueId() {
    return new Date().getTime();
}
  
addBtn.textContent = 'Add new Item';
addBtn.addEventListener('click', addNewItemFunction)
cancelBtn.addEventListener('click', cancelNewItem);

