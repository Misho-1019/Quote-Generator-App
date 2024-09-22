const favoritesList = document.getElementById('favorites-list');
const backtoHomeButton = document.getElementById('back-to-home');
const authorFilterInput = document.getElementById('author-filter');
const sortOptionSelect = document.getElementById('sort-options');
const clearFilterButton = document.getElementById('clear-filter');
let currentQuoteIndex = 0;
const carouselQuote = document.getElementById('carousel-quote')
const carouselAuthor = document.getElementById('carousel-author')
const prevButton = document.getElementById('prev-quote')
const nextButton = document.getElementById('next-quote')
const synth = window.speechSynthesis;

function speakQuote(text, author) {
    if (synth.speaking) {
        synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(`Quote: ${text}, Author: ${author}`)
    synth.speak(utterance)
}

function speakCurrentCarouselQuote() {
    const text = carouselQuote.textContent
    const author = carouselAuthor.textContent;
    speakQuote(text, author);
}

const speakButtonCarousel = document.createElement('button')
speakButtonCarousel.textContent = 'Speak Quote';
speakButtonCarousel.id = 'speak-carousel-quote';
document.querySelector('.carousel-container').appendChild(speakButtonCarousel)

speakButtonCarousel.addEventListener('click', speakCurrentCarouselQuote)

function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    let authorFilter = authorFilterInput.value.toLowerCase();

    if (authorFilter) {
        favorites = favorites.filter(fav => fav.author.toLowerCase().includes(authorFilter))
        
    }

    const sortOption = sortOptionSelect.value;

    if (sortOption === 'author') {
        favorites.sort((a,b) => a.author.localeCompare(b.author));
    }
    else if (sortOption === 'length') {
        favorites.sort((a,b) => a.text.length - b.text.length)
    }


    favoritesList.innerHTML = '';

    favorites.forEach(fav => {
        const li = document.createElement('li')
        li.textContent = `"${fav.text}" - ${fav.author}`

        const removeButton = document.createElement('button')
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeFromFavorites(fav)
            loadFavorites()
        })
        li.appendChild(removeButton)
        favoritesList.appendChild(li);
    })
}

function removeFromFavorites(fav) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(item => item.text !== fav.text || item.author !== fav.author)
    
    let confirmRes = confirm('Are you sure you want to remove this quote?')
    
    if (!confirmRes) {
        return
    }

    localStorage.setItem('favorites', JSON.stringify(favorites))


}

function loadCarouselQuote(index) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        carouselQuote.textContent = 'No favorite quotes yet!'
        carouselAuthor.textContent = '';
        return
    }

    if (index >= favorites.length) {
        currentQuoteIndex = 0;
    }else if (index < 0) {
        currentQuoteIndex = favorites.length - 1
    }else {
        currentQuoteIndex = index;
    }

    const currentQuote = favorites[currentQuoteIndex];
    carouselQuote.textContent = `${currentQuote.text}`
    carouselAuthor.textContent = `- ${currentQuote.author}`
}

authorFilterInput.addEventListener('input', loadFavorites)
sortOptionSelect.addEventListener('change', loadFavorites)

clearFilterButton.addEventListener('click', () => {
    authorFilterInput.value = '';
    loadFavorites();
})

nextButton.addEventListener('click', () => {
    loadCarouselQuote(currentQuoteIndex + 1)
})

prevButton.addEventListener('click', () => {
    loadCarouselQuote(currentQuoteIndex - 1)
})

backtoHomeButton.addEventListener('click', () => {
    window.location.href = 'index.html'
})

loadCarouselQuote(currentQuoteIndex)
loadFavorites()