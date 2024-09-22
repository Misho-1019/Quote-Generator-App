// const apiUrl = 'https://api.api-ninjas.com/v1/quotes';
const apiUrlBase = 'http://api.quotable.io/random'
// const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';

const quoteText = document.getElementById('quote')
const quoteAuthor = document.getElementById('author')
const newQuoteButton = document.getElementById('new-quote')
const quoteCategory = document.getElementById('quote-category')
const shareQuoteButton = document.getElementById('share-quote')
const viewFavoriteButton = document.getElementById('view-favorites')
const addToFavoritesButton = document.getElementById('add-to-favorites')

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

async function fetchQuote() {
    const category = quoteCategory.value;
    
    try {
        let response;

        if (category === 'inspirational') {
            response = await fetch(apiUrlBase + '?tags=inspirational')
        }else if (category === 'motivational') {
            response = await fetch(apiUrlBase + '?tags=motivational')
        }else if (category === 'wisdom') {
            response = await fetch(apiUrlBase + '?tags=wisdom')
        }else if (category === 'love') {
            response = await fetch(apiUrlBase + '?tags=love')
        }else if (category === 'famous-quotes') {
            response = await fetch(apiUrlBase + '?tags=famousQuotes')
        }else {
            response = await fetch(apiUrlBase)
        }
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        const data = await response.json()
        console.log(data);
        
        return {text: data.content, author: data.author || "Unknown"}
    } catch (error) {
        console.error('Error fetching quote:', error);
        return { text: 'Error fetching quote', author: ''}
    }
}

async function displayQuoteOfTheDay() {
    const storedDate = localStorage.getItem('quoteOfDayDate');
    const todayDate = getTodayDate();

    if (storedDate !== todayDate) {
        const quote = await fetchQuote();
        
        localStorage.setItem('quoteOfDayText', quote.text)
        localStorage.setItem('quoteOfDayAuthor', quote.author)
        localStorage.setItem('quoteOfDayDate', todayDate)

        quoteText.textContent = quote.text;
        quoteAuthor.textContent = `-${quote.author}`
    }else {
        const storedQuoteText = localStorage.getItem('quoteOfDayText')
        const storedQuoteAuthor = localStorage.getItem('quoteOfDayAuthor')

        quoteText.textContent = storedQuoteText;
        quoteAuthor.textContent = `-"${storedQuoteAuthor}" - Quote of today!`;
    }
}

async function displayQuote() {
    const {text, author} = await fetchQuote()
    quoteText.textContent = text;
    quoteAuthor.textContent = `-${author}`;
}

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function saveToFavorites() {
    const quote = quoteText.textContent
    const author = quoteAuthor.textContent
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (!favorites.some(fav => fav.text === quote && fav.author === author)) {
        favorites.push({text: quote, author: author})
        localStorage.setItem('favorites', JSON.stringify(favorites))
        showMessage('Quote added to favorites!', 'success')
    }else {
        showMessage('This quote is already in your favorites!', 'error')
    }
}

function showMessage(message, type = 'error') {
    const messageElement = document.getElementById('message')
    messageElement.textContent = message

    messageElement.className = type === 'success' ? 'success' : 'error';

    messageElement.classList.remove('hidden')

    setTimeout(() => {
        messageElement.classList.add('hidden')
    }, 3000);
}

newQuoteButton.addEventListener('click', displayQuote)
quoteCategory.addEventListener('change', displayQuote)
addToFavoritesButton.addEventListener('click', saveToFavorites)
shareQuoteButton.addEventListener('click', () => {
    const quote = quoteText.textContent;
    const author = quoteAuthor.textContent;
    const twitterUrl = `https://twitter.com/intent/tweet?text="${encodeURIComponent(quote)}" - ${encodeURIComponent(author)}`

    window.open(twitterUrl, '_blank')
})

viewFavoriteButton.addEventListener('click', () => {
    window.location.href = 'favorites.html'
})


displayQuoteOfTheDay();