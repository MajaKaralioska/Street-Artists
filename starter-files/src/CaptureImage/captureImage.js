import { getCurrentArtist } from "../globals.js";

//selectors
const liveStreamVideo = document.querySelector('#liveStream');
const captureStreamCanvas = document.querySelector('#captureCanvas');
const captureImageBtn = document.querySelector('#captureImageBtn');
const capturedImageImg = document.querySelector('.captured-image');
const takesnapshot = document.getElementById('takeShapshot')
const trashImage = document.querySelector('.trashImage')

export function getArtistNameCapture (){
    const titleCapture = document.querySelector('.title-capture');
    const title = getCurrentArtist();
    titleCapture.textContent = title
}

capturedImageImg.style.display = 'none'; // by default it shoud be none
captureStreamCanvas.style.display = 'none';

export const initArtistCaptureCamera = () => {
    // navigator MDN
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: {
                ideal: 'environment'
            },
            width: { ideal: 378 },
            height: { ideal: 217 }
        }
    }).then(stream => {
        liveStreamVideo.srcObject = stream;
    }).catch(err => {
        console.log(err);
    });

    liveStreamVideo.addEventListener('canplay', function () {
        captureStreamCanvas.width = liveStreamVideo.videoWidth;
        captureStreamCanvas.height = liveStreamVideo.videoHeight;
    });

    captureImageBtn.addEventListener('click', function () {
        const addNewItem = document.getElementById('add-new-item');
        const captureArtist = document.getElementById('artist-capture');
        const takeSnapShotPara = document.querySelector('.takeShapshotPara');
        const takeSnap = document.getElementById('takeShapshot');
        const snapShotImage = document.querySelector('.shapShotImage');
        const trashCan = document.querySelector('.del-img-btn');
        const ctx = captureStreamCanvas.getContext('2d');
        ctx.drawImage(liveStreamVideo, 0, 0);

        const imgUrl = captureStreamCanvas.toDataURL('image/png');
       
        capturedImageImg.src = imgUrl;

        captureArtist.style.display = 'none';
        takeSnapShotPara.style.display = 'none';
        takeSnap.style.display = 'none';
        snapShotImage.style.display = 'none';
        addNewItem.style.display = 'block';
        capturedImageImg.style.display = 'block';
        trashCan.style.display = 'block';
        trashImage.style.display = 'block';
    });

    const trashImage = document.querySelector('.trashImage');

// Function to handle the click event for trashImage
function handleTrashImageClick(event) {
    if (event.target.tagName === 'IMG') {
        const capturedImageImg = document.querySelector('.captured-image');
        const takeSnapShotPara = document.querySelector('.takeShapshotPara');
        const takeSnap = document.getElementById('takeShapshot');
        const snapShotImage = document.querySelector('.shapShotImage');
        const trashCan = document.querySelector('.del-img-btn');

        // Hide the current image and related elements
        capturedImageImg.style.display = 'none';
        event.target.style.display = 'none';
        trashCan.style.display = 'none';
        takeSnap.style.display = 'block';
        snapShotImage.style.display = 'block';
        takeSnapShotPara.style.display = 'block';

        // Show the capture section elements
        const addNewItem = document.getElementById('add-new-item');
        const captureArtist = document.getElementById('artist-capture');
        
        // Show the capture section and hide others
        captureArtist.style.display = 'block';
        addNewItem.style.display = 'none';
    }
}

// Attach the event listener to trashImage
trashImage.addEventListener('click', handleTrashImageClick);

// Assuming you have a click event for the captured image to go back to the capture section
takesnapshot.addEventListener('click', () => {
    const addNewItem = document.getElementById('add-new-item');
    const captureArtist = document.getElementById('artist-capture');
    
    // Show the capture section and hide others
    captureArtist.style.display = 'block';
    addNewItem.style.display = 'none';
});
}