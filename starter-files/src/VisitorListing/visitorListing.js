import { items } from "../../data/data.js";
import { itemTypes } from "../../data/data.js";

//selectors 
let titleInput = document.getElementById('item');
let artistSelect = document.querySelector('.choose-artist-select');
let minPriceInput = document.getElementById('min-price');
let maxPriceInput = document.getElementById('max-price');
let typeSelect = document.querySelector('.choose-type-select');
const noItemsOverlay = document.querySelector('.no-items-screen-overlay');
const noItemsPopup = document.querySelector('.no-items-popup');
const visitorFilters = document.querySelectorAll('.filters, .filter-h1, #filters-section select, .choose-option, .choose-artist-select .filter-h1, input, label');

//function to render cards on screen
export function renderCard(item, idx) {
    const isDark = idx % 2 ? 'dark' : 'light';

    const card = document.createElement('div');
    card.className = 'col-12 col-md-3 mb-4 mr-md-2 shadow cards';
    card.innerHTML = `
        <div class="card card-bg-${isDark}">
            <img src="${item.image}" class="img-fluid" alt="${item.id}">
            <div class="card-body row">
                <div class='col-9'>
                    <h4 class="card-artist h3">${item.artist}</h4>
                </div>
                <div class='col-3 text-right'>
                    <a href="#" class="btn">${item.price}$</a>
                </div>
                <div class='col-12'>
                    <h6>${item.title}</h6>
                    <p class="card-text">${item.description}</p>
                </div>
            </div>
        </div>
    `;

    const btn = card.querySelector('.btn');
    btn.classList.add(isDark === 'dark' ? 'card-bg-light' : 'card-bg-dark');

    const cardContainer = document.querySelector('.card-container');
    cardContainer.appendChild(card);
}

// fuction to filter items
export const initVisitorListing = () => {
    const cardContainer = document.querySelector('.card-container');

// filter onky the items that are published
    const publishedItems = items.filter(item => item.isPublished);

    let title = titleInput.value.trim();
    let artist = artistSelect.value.trim();
    let minPrice = parseInt(minPriceInput.value, 10) || 0;
    let maxPrice = parseInt(maxPriceInput.value, 10) || 0;
    let type = typeSelect.value.trim();

    const filtered = publishedItems.filter(item =>
        (title ? item.title.includes(title) : true) &&
        (artist ? item.artist === artist : true) &&
        (minPrice ? item.price >= minPrice : true) &&
        (maxPrice ? item.price <= maxPrice : true) &&
        (type ? item.type === type : true)
    );
    cardContainer.innerHTML = '';
    filtered.forEach(renderCard);

// Toggle the overlay and popup based on whether there are matching items
    const hasMatchingItems = filtered.length > 0;
    noItemsOverlay.classList.toggle('active', !hasMatchingItems);
    noItemsPopup.classList.toggle('active', !hasMatchingItems);
    document.body.classList.toggle('no-items', !hasMatchingItems);
};

//add event listener to the filter btn
const filterBtn = document.getElementById('filterBtn');
filterBtn.addEventListener('click', () => {

    noItemsOverlay.classList.remove('active');
    noItemsPopup.classList.remove('active');
   
    document.body.classList.add('filters-open');
    document.body.classList.remove('filters-closed');

 //clear the input fields if you go on the filters page
       titleInput.value = '';
       artistSelect.value = '';
       minPriceInput.value = '';
       maxPriceInput.value = '';
       typeSelect.value = '';
})

// Additional styles for filters section
export const changeFontFamily = () => {
    visitorFilters.forEach(el => {
        el.style.fontFamily = 'Roboto';
        el.style.color = '#edd5bb';
    });
};

// Function to populate artist dropdown
function populateArtistDropdown() {
    const artistSelect = document.querySelector('.choose-artist-select');

    // Get unique artists from items
    const uniqueArtists = [...new Set(items.map(item => item.artist))];

    // Populate the dropdown
    uniqueArtists.forEach(artist => {
        const option = document.createElement('option');
        option.value = artist;
        option.textContent = artist;
        artistSelect.appendChild(option);
    });
}

// Function to populate type dropdown
function populateTypeDropdown() {
    // Populate the dropdown with itemTypes
    itemTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });
}

// callback functions for two event listeners
const showVisitorListing = () => {
    const visitorListingContent = document.querySelector('.visitor-listing-content');
    visitorListingContent.style.display = 'block';
}

const toggleFilters = () => {
    document.body.classList.add('filters-closed');
    document.body.classList.remove('filters-open');
}
// Add event listener for filter check button
const checkBtn = document.getElementById('checkBtn');
checkBtn.addEventListener('click', () => {
    
    toggleFilters();
    showVisitorListing();
    initVisitorListing();
   
});

const closeBtn = document.getElementById('closeBtn'); 
closeBtn.addEventListener('click', () => {
    toggleFilters();
    initVisitorListing();
    showVisitorListing();
});

// Populate artist and type dropdowns when the page loads
document.addEventListener('DOMContentLoaded', () => {
    populateArtistDropdown();
    populateTypeDropdown();
});

