const homeButton = document.querySelector("#HomeButton");
const form = document.querySelector("#SearchForm");
const searchInput = form.elements.SearchInput;
const ShowsDisplay = document.querySelector("#ShowsDisplay");
const modalContainer = document.createElement("div");
const topRatedButton = document.querySelector("#TopRatedButton");
const peopleInfoButton = document.querySelector("#PeopleInfoButton");
const navButtons = [topRatedButton, peopleInfoButton];

document.body.appendChild(modalContainer);

document.addEventListener('DOMContentLoaded', fetchAllShows);

async function fetchAllShows() {
    try {
        const response = await axios.get(`https://api.tvmaze.com/shows`);
        displayShows(sortShows(response.data));
    } catch (error) {
        ShowsDisplay.innerHTML = "Failed to load shows. Please try again later.";
    }
}

function sortShows(shows) {
    return shows.sort((a, b) => a.name.localeCompare(b.name));
}

function displayShows(shows) {
    ShowsDisplay.innerHTML = "";
    if (shows.length === 0) {
        ShowsDisplay.innerHTML = `<p class="NoResults">No results found for your search!</p>`;
        return;
    }
    shows.forEach(show => {
        if (show.image) {
            const showCard = createShowCard(show);
            ShowsDisplay.appendChild(showCard);
        }
    });
}

function createShowCard(show) {
    const ShowCard = document.createElement("div");
    ShowCard.classList.add("ShowCard");

    const img = document.createElement("img");
    img.src = show.image.medium;
    img.alt = show.name;
    img.classList.add("ShowImage");

    const title = document.createElement("h2");
    title.innerText = show.name;
    title.classList.add("ShowTitle");

    const genre = document.createElement("p");
    genre.innerText = `Genres: ${show.genres.length ? show.genres.join(", ") : "N/A"}`;
    genre.classList.add("ShowGenre");

    const language = document.createElement("p");
    language.innerText = `Language: ${show.language || "N/A"}`;
    language.classList.add("Language");

    const ratingStars = convertRatingToStars(show.rating.average);
    const rating = document.createElement("p");
    rating.innerHTML = `Rating: ${ratingStars}`;
    rating.classList.add("Rating");

    ShowCard.append(img, title, genre, language, rating);

    // Click event to open modal
    ShowCard.addEventListener("click", () => showModal(show));

    return ShowCard;
}

async function showModal(show) {
    modalContainer.innerHTML = ""; // Clear previous modal content
    modalContainer.classList.add("ModalContainer");

    // Fetch Cast Information
    const castResponse = await axios.get(`https://api.tvmaze.com/shows/${show.id}/cast`);
    const cast = castResponse.data.map(member => member.person.name).join(", ") || "N/A";

    // Modal content
    const modalContent = document.createElement("div");
    modalContent.classList.add("ModalContent");

    const closeButton = document.createElement("button");
    closeButton.innerText = "Back";
    closeButton.classList.add("CloseButton");
    closeButton.addEventListener("click", closeModal);

    const img = document.createElement("img");
    img.src = show.image ? show.image.original : "https://via.placeholder.com/210x295";
    img.alt = show.name;
    img.classList.add("ModalImage");

    const title = document.createElement("h2");
    title.innerText = show.name;
    title.classList.add("ModalTitle");

    const genre = document.createElement("p");
    genre.innerText = `Genres: ${show.genres.length ? show.genres.join(", ") : "N/A"}`;
    genre.classList.add("ModalGenre");

    const language = document.createElement("p");
    language.innerText = `Language: ${show.language || "N/A"}`;
    language.classList.add("ModalLanguage");

    const rating = document.createElement("p");
    const ratingStars = convertRatingToStars(show.rating.average);
    rating.innerHTML = `Rating: ${ratingStars}`;
    rating.classList.add("ModalRating");

    const castInfo = document.createElement("p");
    castInfo.innerText = `Cast: ${cast}`;
    castInfo.classList.add("ModalCast");

    const summary = document.createElement("p");
    summary.innerHTML = show.summary || "No summary available.";
    summary.classList.add("ModalSummary");

    const videoButton = document.createElement("button");
    videoButton.innerText = "Watch Now";
    videoButton.classList.add("VideoButton");
    videoButton.addEventListener("click", () => {
        const url = show.officialSite || show.url;
        window.open(url, "_blank");
    });

    modalContent.append(closeButton, img, title, genre, language, rating, summary, castInfo, videoButton);
    modalContainer.appendChild(modalContent);
    modalContainer.style.display = "flex"; // Show modal
}

function convertRatingToStars(rating) {
    if (!rating) return "No rating";
    const stars = Math.round((rating / 10) * 5); // Scale 0-10 to 0-5
    const filledStars = "★".repeat(stars); // Filled stars
    const emptyStars = "☆".repeat(5 - stars); // Empty stars
    return filledStars + emptyStars; // Combine filled and empty stars
}

function closeModal() {
    modalContainer.style.display = "none"; // Hide modal
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchShows(query);
    } else {
        fetchAllShows();
    }
});

searchInput.addEventListener("keyup", async () => {
    const query = searchInput.value.trim();
    if (query) {
        searchShows(query);
    } else {
        fetchAllShows();
    }
});

async function searchShows(query) {
    try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows`, { params: { q: query } });
        const shows = response.data.map(result => result.show);
        displayShows(shows);
    } catch (error) {
        ShowsDisplay.innerHTML = "Failed to fetch search results. Please try again later.";
    }
}

homeButton.addEventListener("click", () => {
    setActiveButton(null);
    ShowsDisplay.style.display="";
    fetchAllShows();
});

topRatedButton.addEventListener("click", () => {
    setActiveButton(topRatedButton)
    fetchTopRatedShows()
});
peopleInfoButton.addEventListener("click", () => {
    setActiveButton(peopleInfoButton)
    fetchPeopleInfo()
});

function setActiveButton(activeButton) {
    // Remove active class from all buttons
    navButtons.forEach(button => button.classList.remove("active"));

    // Add active class to the selected button (if provided)
    if (activeButton) {
        activeButton.classList.add("active");
    }
}

async function fetchTopRatedShows() {
    ShowsDisplay.innerHTML = `<p>Loading top-rated shows...</p>`;
    try {
        const response = await axios.get("https://api.tvmaze.com/shows");
        const topRatedShows = response.data
            .filter(show => show.rating.average) // Only shows with ratings
            .sort((a, b) => b.rating.average - a.rating.average) // Sort by rating descending
            .slice(0, 100); // Top 100 shows

        displayShows(topRatedShows);
    } catch (error) {
        ShowsDisplay.innerHTML = `<p>Failed to fetch top-rated shows. Please try again later.</p>`;
    }
}


// Fetch and display people info
async function fetchPeopleInfo() {
    // Clear the ShowsDisplay container
    ShowsDisplay.innerHTML = `<p>Loading people info...</p>`;
    try {
        const response = await axios.get("https://api.tvmaze.com/people");
        const people = response.data
            .filter(person => person.name) // Only include people with names
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

        displayPeople(people);
    } catch (error) {
        ShowsDisplay.innerHTML = `<p>Failed to fetch people info. Please try again later.</p>`;
    }
}

// Display people info dynamically
async function displayPeople(people) {
    // Clear previous content
    ShowsDisplay.innerHTML = "";

    people.forEach(async person => {
        const personCard = document.createElement("div");
        personCard.classList.add("ShowCard");

        const img = document.createElement("img");
        img.src = person.image ? person.image.medium : "https://via.placeholder.com/210x295";
        img.alt = person.name;
        img.classList.add("ShowImage");

        const name = document.createElement("h2");
        name.innerText = person.name;
        name.classList.add("ShowTitle");

        // Fetch and display the number of shows dynamically
        const numShows = await getActorShowCount(person.id);
        const showsCount = document.createElement("p");
        showsCount.innerText = `Shows: ${numShows}`;
        showsCount.classList.add("ShowGenre");

        personCard.append(img, name, showsCount);

        // Click event to fetch and display the actor's shows/movies
        personCard.addEventListener("click", () => fetchActorCredits(person.id, person.name));

        ShowsDisplay.appendChild(personCard);
    });
}

// Fetch the number of shows for an actor
async function getActorShowCount(actorId) {
    try {
        const response = await axios.get(`https://api.tvmaze.com/people/${actorId}/castcredits`);
        return response.data.length;
    } catch (error) {
        return 0; // Return 0 if an error occurs
    }
}

// Fetch and display the list of shows/movies the actor was cast in
async function fetchActorCredits(actorId, actorName) {
    // Reset the container to avoid overlap
    ShowsDisplay.innerHTML = `<p>Shows Featuring ${actorName}...</p>`;
    try {
        const response = await axios.get(`https://api.tvmaze.com/people/${actorId}/castcredits?embed=show`);
        const credits = response.data.map(credit => credit._embedded.show);

        if (credits.length === 0) {
            displayNoShows(actorName);
        } else {
            displayActorCredits(credits, actorName);
        }
    } catch (error) {
        ShowsDisplay.innerHTML = `<p>Failed to fetch credits for ${actorName}. Please try again later.</p>`;
    }
}

// Display the list of shows/movies
function displayActorCredits(credits, actorName) {



    credits.forEach(show => {
        const showCard = document.createElement("div");
        showCard.classList.add("ShowCard");

        const img = document.createElement("img");
        img.src = show.image ? show.image.medium : "https://via.placeholder.com/210x295";
        img.alt = show.name;
        img.classList.add("ShowImage");

        const title = document.createElement("h2");
        title.innerText = show.name;
        title.classList.add("ShowTitle");

        showCard.append(img, title);

        // Click event to open the show's modal
        showCard.addEventListener("click", () => showModal(show));

        ShowsDisplay.appendChild(showCard);
    });
}

// Display message when the actor has no shows
function displayNoShows(actorName) {
    // Clear previous content and display a message

    ShowsDisplay.innerHTML = `
        <h2>${actorName} has no shows available.</h2>
        <button class="BackButton" id="BackToPeople">Back to People</button>
    `;
    // Set flex and column direction
    ShowsDisplay.style.display = "flex";
    ShowsDisplay.style.flexDirection = "column";
    ShowsDisplay.style.alignItems = "center"; // Center content horizontally
    ShowsDisplay.style.justifyContent = "center"; // Center content vertically
    ShowsDisplay.style.gap = "1rem"; // Add spacing between elements

    // Add a click event to return to the people view
    const backButton = document.querySelector("#BackToPeople");
    backButton.addEventListener("click",
        () => {
            ShowsDisplay.style.display = "";
            fetchPeopleInfo()
        });
}



