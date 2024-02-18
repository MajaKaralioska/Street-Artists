export const removeCurrentArtist = () =>{
    if (location.hash === '#visitor') {
        // If the location hash is '#visitor', remove currentArtist from local storage
         localStorage.removeItem('currentArtist');
    }
}
// with this logic, when an item is on auction,helps to make a difference if the user is visitor or artist