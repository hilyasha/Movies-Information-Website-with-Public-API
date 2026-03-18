const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNjgwZGY4NDMxZWQxODNhYWViYTY0YzVlMzc2OTFkNCIsIm5iZiI6MTc3Mzc2NjIwMS4zODUsInN1YiI6IjY5Yjk4NjM5N2Q3OGRjZjUzNjJjOGQxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e9MF0JEMrqBifHQq216KLSFD8ptXjKNkqlcJWz_Y8Jg";
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movie-grid');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('movie-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('movie-modal');
const closeBtn = document.querySelector('.close-btn');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`
  }
};

async function fetchMovies(endpoint = '/movie/popular') {
    try {
        movieGrid.innerHTML = '<p>Loading...</p>';
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();
        if (data.results) displayMovies(data.results);
    } catch (error) {
        movieGrid.innerHTML = '<p>Error loading data.</p>';
    }
}

function displayMovies(movies) {
    movieGrid.innerHTML = ''; 
    movies.slice(0, 9).forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        const poster = movie.poster_path ? IMG_BASE + movie.poster_path : 'https://via.placeholder.com/300x450';

        movieCard.innerHTML = `<img src="${poster}" alt="${movie.title}">`;
        
        movieCard.onclick = () => {
            document.getElementById('modal-title').innerText = movie.title;
            document.getElementById('modal-desc').innerText = movie.overview;
            document.getElementById('modal-rating').innerText = `Rating: ⭐ ${movie.vote_average}`;
            document.getElementById('modal-img').src = poster;
            modal.style.display = "block";
        };

        movieGrid.appendChild(movieCard);
    });
}

searchButton.onclick = () => {
    const term = searchInput.value.trim();
    if (term) fetchMovies(`/search/movie?query=${encodeURIComponent(term)}`);
};

filterBtns.forEach(btn => {
    btn.onclick = (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const cat = e.target.dataset.category;
        let end = '/movie/popular';
        if (cat === 'trending') end = '/trending/movie/week';
        if (cat === 'top-rated') end = '/movie/top_rated';
        if (cat === 'upcoming') end = '/movie/upcoming';
        fetchMovies(end);
    };
});

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

function moveSlider(id, direction) {
    const container = document.getElementById(id);
    const scrollAmount = container.clientWidth;
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

async function fetchByGenre(genreId, trackId) {
    const response = await fetch(`${BASE_URL}/discover/movie?with_genres=${genreId}`, options);
    const data = await response.json();
    const track = document.querySelector(`#${trackId} .slider-track`);
    
    data.results.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        const poster = movie.poster_path ? IMG_BASE + movie.poster_path : 'https://via.placeholder.com/300x450';
        movieCard.innerHTML = `<img src="${poster}" alt="${movie.title}">`;
        
        movieCard.onclick = () => {
            document.getElementById('modal-title').innerText = movie.title;
            document.getElementById('modal-desc').innerText = movie.overview;
            document.getElementById('modal-rating').innerText = `Rating: ⭐ ${movie.vote_average}`;
            document.getElementById('modal-img').src = poster;
            document.getElementById('movie-modal').style.display = "block";
        };
        track.appendChild(movieCard);
    });
}

fetchByGenre(14, 'fantasy-track');
fetchByGenre(10749, 'romance-track');
fetchByGenre(27, 'horror-track');
fetchMovies();