/**
 * Unique API Key for TMDB Endpoints requests
 */
const API_KEY = '9dfd01779b6fdeb1cde19f1c010bb6a9';
/**
 * TMDB Endpoints URLs
 */
const ALL_MOVIES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=1`;
const TRENDING_MOVIES_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&page=1`;
const POPULAR_MOVIES_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=1`;
const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const IMAGE_URL = `https://image.tmdb.org/t/p/w300`;
/**
 * State Object
 */
const stateObject = {
	optionSelected: allMovies,
	searchBarText: null,
	data: [],
	dataFiltered: []
};
/**
 * Functions
 */
const getAllMovies = async () => {
	const response = await fetch(ALL_MOVIES_URL);
	const { results } = await response.json();
	return results;
};

const getDailyTrendingMovies = async () => {
	const response = await fetch(TRENDING_MOVIES_URL);
	const { results } = await response.json();
	return results;
};

const getPopularMovies = async () => {
	const response = await fetch(POPULAR_MOVIES_URL);
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

const filterByText = (query) => {
	if (query.trim()) {
		stateObject.dataFiltered = stateObject.data.filter((item) =>
			item.title.toLowerCase().includes(query.toLowerCase())
		);
		buildDataTable(stateObject.dataFiltered);
	} else {
		buildDataTable(stateObject.data);
	}
};

const showDetails = (element) => {
	element.classList.toggle('fa-eye-slash');
	element.classList.toggle('fa-eye');

	element.classList.value.includes('fa-eye-slash')
		? element.classList.remove('opened')
		: element.classList.add('opened');

	const detailRow = element.parentElement.nextElementSibling;
	detailRow.classList.toggle('hideDetail');
};

const changeSelectedOption = (optionsArr, optionIndex) => {
	optionsArr.forEach((option, index) => {
		if (index === optionIndex) {
			option.classList.add('selected');
			stateObject.optionSelected = option;
		} else {
			option.classList.remove('selected');
		}
	});
};

const clearFilters = () => {
	searchBar.value = '';
};
/**
 * Display Data Table
 */

const buildDataTable = async (dataArr) => {
	tableContainer.innerHTML = '';

	let output =
		'<table id="dataTable"><thead><th>Title</th><th>Genre</th><th>Language</th><th>Rating</th><th>Details</th></thead><tbody>';

	for (let item of dataArr) {
		const movie = await getMovie(item.id);
		output += `<tr>
	              <td>${movie.title}</td>
	              <td>${movie.genres[0].name}</td>
	              <td>${
									movie.spoken_languages.length > 0
										? movie.spoken_languages[0].english_name
										: 'Unknown'
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

	output += '</tbody></table>';
	tableContainer.innerHTML = output;
};

const getData = async (func) => {
	stateObject.data.length = 0;

	const moviesArr = await func();
	stateObject.data = moviesArr;

	await buildDataTable(moviesArr);
};

const displayTrendingMovies = () => {
	getData(getDailyTrendingMovies);
};

const displayAllMovies = () => {
	getData(getAllMovies);
};

const displayPopularMovies = () => {
	getData(getPopularMovies);
};
/**
 * Event Listeners
 */
allMovies.addEventListener('click', (e) => {
	changeSelectedOption([allMovies, trending, popular], 0);
	clearFilters();
	displayAllMovies();
});

trending.addEventListener('click', () => {
	changeSelectedOption([allMovies, trending, popular], 1);
	clearFilters();
	displayTrendingMovies();
});

popular.addEventListener('click', () => {
	changeSelectedOption([allMovies, trending, popular], 2);
	clearFilters();
	displayPopularMovies();
});

searchBar.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		filterByText(searchBar.value);
	}
});

displayAllMovies();
