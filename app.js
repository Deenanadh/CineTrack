const form = document.querySelector("#SearchForm")
const ShowsDisplay = document.querySelector("#ShowsDisplay")
document.addEventListener('DOMContentLoaded', noSearch())
async function noSearch() {
    const AllShows = await axios.get(`https://api.tvmaze.com/shows`)
    Sort(AllShows.data)
};

function Sort(shows) {
    shows.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    })

    for (let i of shows) {
        if (i.image) {

            const ShowCard = document.createElement("div")
            const img = document.createElement("img")
            const ShowTitle = document.createElement("h2")
            const ShowGenre = document.createElement("p")
            const WatchNow = document.createElement("button")
            const Language = document.createElement("p")
            const Rating = document.createElement("p")


            ShowCard.classList.add("ShowCard")
            img.classList.add("ShowImage")
            ShowTitle.classList.add("ShowTitle")
            ShowGenre.classList.add("ShowGenre")
            WatchNow.classList.add("WatchNow")
            Language.classList.add("Language")
            Rating.classList.add("Rating")


            img.src = i.image.medium;
            ShowTitle.innerText = i.name

            if (i.language) {
                Language.innerText = `Language : ${i.language}`;
            }
            else {
                Language.innerText = "not available"
            }

            if ((i.genres).length !== 0) { ShowGenre.innerText = `Genres:${i.genres}`; }
            else { ShowGenre.innerText = "Genres: not available"; }

            Rating.innerText = `Rating : ${Math.floor((i.rating.average))}/10`;

            WatchNow.innerText = "Watch Now"
            // if (i.show.webChannel.officialSite === "" || i.show.webChannel.officialSite == null) { WatchNow.addEventListener('click', () => window.open(i.show.url)) ; }
            // else  { WatchNow.addEventListener('click', () => window.open(i.show.webChannel.officialSite)); }


            ShowCard.appendChild(img)
            ShowCard.appendChild(ShowTitle)
            ShowCard.appendChild(ShowGenre)
            ShowCard.appendChild(Language)
            ShowCard.appendChild(Rating)
            ShowCard.appendChild(WatchNow)

            ShowsDisplay.appendChild(ShowCard)

        }
    }
}



form.addEventListener("submit", Searchreq)
form.addEventListener("keyup", Searchreq)
async function Searchreq(e) {
    e.preventDefault();
    ShowsDisplay.innerHTML = ""
    const SearchInput = form.elements.SearchInput.value
    if (SearchInput === "" || SearchInput === null) {
        noSearch();
    }
    else{
    const config = { params: { q: SearchInput } }
    try {
        const SearchRes = await axios.get(`https://api.tvmaze.com/search/shows`, config)
        DisplaySearch(SearchRes.data)
    } catch (error) {
        ShowsDisplay.innerHTML = "Something went wrong. Please Try Again Later";
    }
}
}

const DisplaySearch = (shows) => {
    if (shows.length === 0) {
        ShowsDisplay.innerHTML = "no results found for your search!";
    }
    else{
    for (let i of shows) {
        if (i.show.image) {

            const ShowCard = document.createElement("div")
            const img = document.createElement("img")
            const ShowTitle = document.createElement("h2")
            const ShowGenre = document.createElement("p")
            const WatchNow = document.createElement("button")
            const Language = document.createElement("p")
            const Rating = document.createElement("p")


            ShowCard.classList.add("ShowCard")
            img.classList.add("ShowImage")
            ShowTitle.classList.add("ShowTitle")
            ShowGenre.classList.add("ShowGenre")
            WatchNow.classList.add("WatchNow")
            Language.classList.add("Language")
            Rating.classList.add("Rating")


            img.src = i.show.image.medium;
            ShowTitle.innerText = i.show.name

            if (i.show.language) {
                Language.innerText = `Language : ${i.show.language}`;
            }
            else {
                Language.innerText = "not available"
            }

            if ((i.show.genres).length !== 0) { ShowGenre.innerText = `Genres:${i.show.genres}`; }
            else { ShowGenre.innerText = "Genres: not available"; }

            Rating.innerText = `Rating : ${Math.floor((i.score) * 10)}/10`;

            WatchNow.innerText = "Watch Now"
            // if (i.show.webChannel.officialSite === "" || i.show.webChannel.officialSite == null) { WatchNow.addEventListener('click', () => window.open(i.show.url)) ; }
            // else  { WatchNow.addEventListener('click', () => window.open(i.show.webChannel.officialSite)); }


            ShowCard.appendChild(img)
            ShowCard.appendChild(ShowTitle)
            ShowCard.appendChild(ShowGenre)
            ShowCard.appendChild(Language)
            ShowCard.appendChild(Rating)
            ShowCard.appendChild(WatchNow)

            ShowsDisplay.appendChild(ShowCard)

        }
    }
}
}

