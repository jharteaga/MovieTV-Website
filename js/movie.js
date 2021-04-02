/**
 * Unique API Key for TMDB Endpoints requests
 */
const API_KEY = '9dfd01779b6fdeb1cde19f1c010bb6a9';
/**
 * TMDB Movies Endpoints URLs
 */
const ALL_MOVIES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=1`;
const TRENDING_MOVIES_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&page=1`;
const TOP_RATED_MOVIES_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=1`;
const MOVIE_DETAILS_URL = `https://api.themoviedb.org/3/movie/`;
/**
 * TMDB Common Endpoints URLs
 */
const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const LANGUAGES_URL = `https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`;
const IMAGE_URL = `https://image.tmdb.org/t/p/w300`;
/**
 * State Object
 */
const stateObject = {
	data: []
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
	const response = await fetch(TOP_RATED_MOVIES_URL);
	const { results } = await response.json();
	return results;
};

const getMovie = async (id) => {
	const response = await fetch(
		`${MOVIE_DETAILS_URL}${id}?api_key=${API_KEY}&language=en-US`
	);
	const result = await response.json();
	return result;
};

const getGenres = async () => {
	const response = await fetch(GENRES_URL);
	const { genres } = await response.json();
	return genres;
};

const getLanguages = async () => {
	const response = await fetch(LANGUAGES_URL);
	const result = await response.json();
	return result;
};

const filterData = (item) => {
	let filterByText = true;
	let filterByGenre = true;
	let filterByLang = true;
	let filterByRating = true;

	if (searchBar.value.trim()) {
		filterByText = item.title
			.toLowerCase()
			.includes(searchBar.value.trim().toLowerCase());
	}

	if (genres.selectedIndex) {
		filterByGenre = item.genres[0].id == genres.value;
	}

	if (languages.selectedIndex) {
		filterByLang =
			item.spoken_languages.length &&
			item.spoken_languages[0].iso_639_1 == languages.value;
	}

	if (ratings.selectedIndex) {
		console.log(ratings.value);
		if (ratings.value >= 6) filterByRating = item.vote_average >= ratings.value;
		else filterByRating = item.vote_average <= ratings.value;
	}

	return filterByText && filterByGenre && filterByLang && filterByRating;
};

const sortData = (data) => {
	if (sortBy.value === 'title') {
		data.sort((item1, item2) => (item1.title > item2.title ? 1 : -1));
	}

	if (sortBy.value === 'rating') {
		data.sort((item1, item2) =>
			item1.vote_average < item2.vote_average ? 1 : -1
		);
	}

	return data;
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
		} else {
			option.classList.remove('selected');
		}
	});
};

const clearFilters = () => {
	searchBar.value = '';
	genres.selectedIndex = 0;
	languages.selectedIndex = 0;
	ratings.selectedIndex = 0;
	sortBy.selectedIndex = 0;
};

/**
 * Display Data Table
 */
const buildDataTable = async (dataArr) => {
	tableContainer.innerHTML = '';

	let output = `<table id="dataTable">
      <thead>
        <th>Title</th>
        <th>Genre</th>
        <th>Language</th>
        <th>Rating</th>
        <th>Details</th>
      </thead>
      <tbody>`;

	for (let item of dataArr) {
		const movie = await getMovie(item.id);
		if (filterData(movie)) {
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
			}" alt="" class="mediaImage" />
                    <div id="columnDetail">
	                    <p><span class="subHeading">Overview:</span> ${
												movie.overview
											}</p>
                      <p>
											  <span class="subHeading">Release Date:</span> ${movie.release_date}
										  </p>
                    </div>
	                </div>
							  </td>
	            </tr>`;
		}
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

searchBar.addEventListener('keypress', async (e) => {
	if (e.key === 'Enter') {
		await buildDataTable(stateObject.data);
	}
});

genres.addEventListener('change', async () => {
	await buildDataTable(stateObject.data);
});

languages.addEventListener('change', async () => {
	await buildDataTable(stateObject.data);
});

ratings.addEventListener('change', async () => {
	await buildDataTable(stateObject.data);
});

sortBy.addEventListener('change', async () => {
	const dataList = [...stateObject.data];
	await buildDataTable(sortData(dataList));
});

/**
 * First time execution
 */
const fillGenresList = async () => {
	const genresList = await getGenres();

	let options = '<option value="" selected>All Genres</option>';
	genresList.forEach((genre) => {
		options += `<option value="${genre.id}">${genre.name}</option>`;
	});

	genres.innerHTML = options;
};

const fillLanguagesList = async () => {
	const languagesList = await getLanguages();

	languagesList.sort((lang1, lang2) =>
		lang1.english_name > lang2.english_name ? 1 : -1
	);

	let options = '<option value="" selected>All Languages</option>';
	languagesList.forEach((lang, index) => {
		if (index)
			options += `<option value="${lang.iso_639_1}">${lang.english_name}</option>`;
	});

	languages.innerHTML = options;
};

fillGenresList();
fillLanguagesList();
displayAllMovies();