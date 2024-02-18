import { setCurrentArtist } from "../globals.js";
import { getArtistName } from "../ArtistsHomePage/artist.js";

// selectors
const select = document.querySelector(".join-artist-select");

export async function getData() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();

        // Preserve the existing "Choose" option
        const chooseOption = select.querySelector('.choose-artist');
        chooseOption.setAttribute('hidden', true);

        // Clear existing options, excluding the "Choose" option
        select.innerHTML = "";
        select.appendChild(chooseOption);

        // Create options based on the data
        data.forEach(user => {
            const option = document.createElement("option");
            option.value = user.name;
            option.textContent = user.name;
            option.style.fontFamily = "Roboto";
            select.appendChild(option);
        });

        // add event listener to select options to redirect you to the artist home Page
        select.addEventListener('change', async (e) => {
            const selectedOption = e.currentTarget.value; // Use e.currentTarget.value to get the selected option's value

            // Check if the selected option is not the "Choose" option
            if (selectedOption !== "Choose") {
                location.hash = '#artists';
                setCurrentArtist(selectedOption);
                await getArtistName(); // Wait for getArtistName to complete
            } else {
                // If the selected option is "Choose" (visitor), remove currentArtist from local storage
                localStorage.removeItem('currentArtist');
            }
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}








