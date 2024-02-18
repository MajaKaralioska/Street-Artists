import { items } from "../data/data.js";
import { initVisitorListing, changeFontFamily} from "../src/VisitorListing/visitorListing.js";
import { getData } from "../src/LandingPage/landingPage.js";
import { getArtistName, renderArtist } from "../src/ArtistsHomePage/artist.js";
import { currentArtistItems, updateArtistItems } from "../src/ArtistsItemsPage/artistItems.js";
import { chooseTypeDropdown, updateTitle} from "../src/ArtistsItemsPage/addNewItem.js";
import { initArtistCaptureCamera, getArtistNameCapture } from "../src/CaptureImage/captureImage.js";
import { removeCurrentArtist } from "../src/VisitorHomePage/visitor.js";
import { initAuctionPage } from "../src/AuctionPage/auction.js";

//selectors

const landingPage = document.getElementById('landingPage');
const artistHomePage = document.getElementById('artists');
const visitorHomePage = document.getElementById('visitor');
const visitorListing = document.getElementById('visitorListing');
const artistItems = document.getElementById('artistsItems');
const liveAuction = document.getElementById('auction');
const filters = document.getElementById('filters-section');
const visitorListingContent = document.querySelector('.visitor-listing-content');
const addNewItem = document.getElementById('add-new-item');
const cameraCapture = document.getElementById('artist-capture');



const onRouteHandler =  () => {
    const hash = location.hash;

    switch (hash) {
        case '':
          landingPage.style.display = 'block';
          artistHomePage.style.display = 'none';
          visitorHomePage.style.display = 'none';
          visitorListing.style.display = 'none';
          artistItems.style.display = 'none';
          liveAuction.style.display = 'none';
          filters.style.display = 'none';
          addNewItem.style.display = 'none';
            cameraCapture.style.display = 'none';
          getData();
            break;

        case '#landingPage':
            landingPage.style.display = 'block';
            artistHomePage.style.display = 'none';
            visitorHomePage.style.display = 'none';
            visitorListing.style.display = 'none';
            artistItems.style.display = 'none';
            liveAuction.style.display = 'none';
            filters.style.display = 'none';
            addNewItem.style.display = 'none';
            cameraCapture.style.display = 'none';
            
            getData();
          
            break
        case '#artists':
          landingPage.style.display = 'none';
          artistHomePage.style.display = 'block';
          visitorHomePage.style.display = 'none';
          visitorListing.style.display = 'none';
          artistItems.style.display = 'none';
          liveAuction.style.display = 'none';
          filters.style.display = 'none';
          addNewItem.style.display = 'none';
          cameraCapture.style.display = 'none';
          getArtistName();
          renderArtist();
       
            break;
        case '#visitor':
            landingPage.style.display = 'none';
            artistHomePage.style.display = 'none';
            visitorHomePage.style.display = 'block';
            visitorListing.style.display = 'none';
            artistItems.style.display = 'none';
            liveAuction.style.display = 'none';
            filters.style.display = 'none';
            addNewItem.style.display = 'none';
            cameraCapture.style.display = 'none';
            removeCurrentArtist();
            break;
         case '#visitorListing':
            landingPage.style.display = 'none';
            artistHomePage.style.display = 'none';
            visitorHomePage.style.display = 'none';
            visitorListing.style.display = 'block';
            artistItems.style.display = 'none';
            liveAuction.style.display = 'none';
            filters.style.display = 'none';
            addNewItem.style.display = 'none';
            cameraCapture.style.display = 'none';
           
            initVisitorListing();
           
            break;   
         case '#filters-section':
                landingPage.style.display = 'none';
                artistHomePage.style.display = 'none';
                visitorHomePage.style.display = 'none';
                visitorListingContent.style.display = 'none';
                artistItems.style.display = 'none';
                liveAuction.style.display = 'none';
                filters.style.display = 'block';
                addNewItem.style.display = 'none';
                cameraCapture.style.display = 'none';
                
                changeFontFamily();
            break;
        case '#artistsItems':
                landingPage.style.display = 'none';
                artistHomePage.style.display = 'none';
                visitorHomePage.style.display = 'none';
                visitorListing.style.display = 'none';
                artistItems.style.display = 'block';
                liveAuction.style.display = 'none';
                filters.style.display = 'none';
                addNewItem.style.display = 'none';
                cameraCapture.style.display = 'none';
                updateArtistItems();
                currentArtistItems();   
            break;
        case '#add-new-item':
                landingPage.style.display = 'none';
                artistHomePage.style.display = 'none';
                visitorHomePage.style.display = 'none';
                visitorListing.style.display = 'none';
                artistItems.style.display = 'none';
                liveAuction.style.display = 'none';
                filters.style.display = 'none';
                addNewItem.style.display = 'block';
                cameraCapture.style.display = 'none';
                updateTitle();
                chooseTypeDropdown();
            break;
        case '#artist-capture':
                landingPage.style.display = 'none';
                artistHomePage.style.display = 'none';
                visitorHomePage.style.display = 'none';
                visitorListing.style.display = 'none';
                artistItems.style.display = 'none';
                liveAuction.style.display = 'none';
                filters.style.display = 'none';
                addNewItem.style.display = 'none';
                cameraCapture.style.display = 'block';
                getArtistNameCapture();
                initArtistCaptureCamera();
            break;    
        case '#auction':
            landingPage.style.display = 'none';
            artistHomePage.style.display = 'none';
            visitorHomePage.style.display = 'none';
            visitorListing.style.display = 'none';
            artistItems.style.display = 'none';
            liveAuction.style.display = 'block';
            filters.style.display = 'none';
            addNewItem.style.display = 'none';
            cameraCapture.style.display = 'none';
            initAuctionPage();
            break;
        
        default:
            // Handle default route or unrecognized hash
            console.log('Unrecognized route or default behavior');
            break;
    }
};

// Call the function on page load and whenever the hash changes
window.addEventListener('load', onRouteHandler);
window.addEventListener('hashchange', () => {
    const itemsLSString = localStorage.getItem('items_LS');

    // Check if items_LS exists and is not an empty array
    if (!itemsLSString || (itemsLSString && JSON.parse(itemsLSString).length === 0)) {
        localStorage.setItem('items_LS', JSON.stringify(items));
    } 
    onRouteHandler();
});



