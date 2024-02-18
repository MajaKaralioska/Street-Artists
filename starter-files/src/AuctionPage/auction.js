let countdownTimer; 

// Function to start the countdown timer 
export function startCountdown(minutes, seconds) {
    const timeElement = document.getElementById('time');
    countdownTimer = setInterval(function () {
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                clearInterval(countdownTimer);
                timeElement.innerHTML = 'Auction Ended';
            }
        }
        timeElement.innerHTML = `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
    }, 1000);
}

const bidContent = document.querySelector('.bid-content');
bidContent.style.display = 'none';

// Function to initialize the auction page
export const initAuctionPage = () => {
    const bidBtn = document.querySelector('.bidBtn');
    const bidInput = document.querySelector('.bidAmount');
    const yourBidsList = document.querySelector('.yourBids');
    const otherBidsList = document.getElementById('otherBidsList'); // Added ID
    const currentBidElement = document.getElementById('currentBid');
    const currentArtist = localStorage.getItem('currentArtist');
    const backBtn = document.querySelector('.back-btn');

// location hash behavier for backbtn.. if you are arttist it taes you to artist page, else in visitor
    backBtn.addEventListener('click', () => {
        if (currentArtist){
            location.hash = 'artistsItems';
        } else {
            location.hash = 'visitor';
        }
    })
 // only visitors can bid... if there is currentArtiist the button is disabled
    if (currentArtist) {
        bidBtn.disabled = true;
        bidBtn.innerText = 'Disabled for artists'
        return;
    } else {
        bidBtn.disabled = false;
        bidBtn.innerText = 'Place your bid'
    }
    let itemId;
    bidBtn.addEventListener('click', function (event) {
        event.preventDefault();

        const myBidFormData = new FormData();
        myBidFormData.set('amount', bidInput.value);

        fetch('https://projects.brainster.tech/bidding/api', {
            method: 'POST',
            body: myBidFormData
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            const isBidding = data.isBidding;

            if (isBidding === true) {
                // Update "Other Bids" list with bid from API 
                yourBidsList.innerHTML += `<li class="YourBid list-group-item">Your Bid: ${bidInput.value}$</li>`;

                // Add the bid to the "Other Bids" list
                const newBidItem = `<li class="otherBid list-group-item">Other Bid: ${data.bidAmount}$</li>`;
                otherBidsList.innerHTML += newBidItem;

                // Highlight the highest bid in the "Other Bids" list
                highlightHighestBid(otherBidsList);

                bidInput.value = parseFloat(data.bidAmount) + 50; // Adjust as needed

                // Update the current bid element
                currentBidElement.textContent = `Current Bid: $${data.bidAmount}`;

                // Reset Timer to 2:00 for each bid
                clearInterval(countdownTimer);
                startCountdown(2, 0);
            } else {
            
                // Retrieve the original item from Local Storage using its ID
                const existingItems = JSON.parse(localStorage.getItem('items_LS')) || [];
                const originalItem = existingItems.find(item => item.id === parseInt(itemId));
            
                // Find the highest bid from the "Other Bids" list
                const highestBidElement = document.querySelector('.highestBid');
                const highestBid = highestBidElement ? parseFloat(highestBidElement.textContent.replace('Other Bid: ', '').replace('$', '')) : 0;
                
                clearInterval(countdownTimer)
                const timeElement = document.getElementById('time');
                timeElement.textContent = `Auction has ended. Item sold for $ ${highestBid}`;
            
                if (originalItem) {
                    const updatedItem = {
                        itemId: originalItem.id,
                        itemName: originalItem.title,
                        itemDate: originalItem.dateCreated,
                        itemPrice: originalItem.price,
                        itemImage: originalItem.image,
                        description: originalItem.description,
                        type: originalItem.type,
                        isPublished: originalItem.isPublished,
                        isAuctioning: false,
                        dateSold: new Date().toLocaleDateString('en-GB'),
                        priceSold: highestBid,
                    };
            
                    // Update the item in the auction page and Local Storage
                    handleAuctionEnd(updatedItem);
            
                    // Clear the bid input field
                    bidInput.value = '';
                    currentBidElement.textContent = `Currently unavailable`;
                    // Reset localStorage when the auction ends
                    localStorage.removeItem('countdownStarted');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error
        });
    });
}

// Function to handle the auction logic when it ends
function handleAuctionEnd(updatedItem) {
    
    // Reset the auction status after handling the auction end
    isAuctionInProgress = false;

    const noAuctionSnap = document.querySelector('.no-auction-snap');
    const auctionContainer = document.querySelector('.auction-item-container');
    const bidContent = document.querySelector('.bid-content');
    noAuctionSnap.style.display = 'block';
    auctionContainer.innerHTML = '';
    bidContent.style.display = 'none';

    // Update the item in items_LS
    updateLocalStorageItem(updatedItem);

    // Update the item in the auction page
    updateAuctionItem(updatedItem);
}

// Function to handle the auction logic when it ends
function updateAuctionItem(updatedItem) {
    const auctionItemElement = document.getElementById(updatedItem.itemId);

    if (auctionItemElement) {
        // Update the auction status after handling the auction end
        isAuctionInProgress = false;
        // Update the price
        const itemPriceElement = auctionItemElement.querySelector('.item-btn');
        itemPriceElement.textContent = updatedItem.itemPrice;
    }
}

// Function to update the item in items_LS
function updateLocalStorageItem(updatedItem) {
    const existingItems = JSON.parse(localStorage.getItem('items_LS')) || [];
    const updatedItems = existingItems.map(item => (item.itemId === updatedItem.itemId ? updatedItem : item));
    localStorage.setItem('items_LS', JSON.stringify(updatedItems));
}

// Function to highlight the highest bid in the "Other Bids" list
function highlightHighestBid(otherBidsList) {
    const bidItems = otherBidsList.querySelectorAll('.otherBid');
    
    let highestBid = 0;
    let highestBidElement = null;

    bidItems.forEach(bidItem => {
        const bidAmount = parseFloat(bidItem.textContent.replace('Other Bid: ', '').replace('$', ''));
        if (bidAmount > highestBid) {
            highestBid = bidAmount;
            highestBidElement = bidItem;
        }
    });
    // Remove existing highlighting
    bidItems.forEach(bidItem => {
        bidItem.classList.remove('highestBid');
    });
    // Highlight the highest bid
    if (highestBidElement) {
        highestBidElement.classList.add('highestBid');
    }
}

