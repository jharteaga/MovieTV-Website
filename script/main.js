/**
 * Unique API Key for TMDB Endpoints requests
 */
const API_KEY = '9dfd01779b6fdeb1cde19f1c010bb6a9';
/**
 * TMDB Endpoints URLs
 */
const TRENDING_MOVIES_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const IMAGE_URL = `https://image.tmdb.org/t/p/w300`;
/**
 * Functions
 */
const showDetails = (element) => {
	element.classList.toggle('fa-eye-slash');
	element.classList.toggle('fa-eye');
	element.classList.value.includes('fa-eye-slash')
		? (element.style.color = '#03dac6')
		: (element.style.color = '#f0f0f0');
	const detailRow = element.parentElement.nextElementSibling;
	detailRow.classList.toggle('hideDetail');
};

const getDailyTrendingMovies = async () => {
	const response = await fetch(TRENDING_MOVIES_URL);
	const { results } = await response.json();
	return results;
};

const getMovie = async (id) => {
	const MOVIE_DETAILS_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
	const response = await fetch(MOVIE_DETAILS_URL);
	const result = await response.json();
	return result;
};

const getGenres = async () => {
	const response = await fetch(GENRES_URL);
	const { genres } = await response.json();
	return genres;
};
/**
 * Display Data Table
 */
const displayDataTable = async () => {
	tableContainer.innerHTML = '';

	let output =
		'<table id="dataTable"><thead><th>Title</th><th>Genre</th><th>Language</th><th>Rating</th><th>Details</th></thead><tbody>';

	const moviesArr = await getDailyTrendingMovies();

	for (let item of moviesArr) {
		const movie = await getMovie(item.id);
		console.log(movie);
		output += `<tr>
	              <td>${movie.title}</td>
	              <td>${movie.genres[0].name}</td>
	              <td>${
									movie.spoken_languages.length > 0
										? movie.spoken_languages[0].english_name
										: movie.original_language
								}</td>
	              <td>${movie.vote_average}</td>
	              <td><i class="far fa-eye-slash" onclick="showDetails(this)"></i></td>
	              <td class="spanRow hideDetail">
	                <div id="rowDetail">
	                  <img src="${IMAGE_URL}${
			movie.poster_path
		}" alt="" class="movieImage" />
	                  <p>${movie.overview}</p>
	                </div>
							  </td>
	            </tr>`;
	}

	tableContainer.innerHTML = `${output}</tbody></table>`;
};

displayDataTable();
