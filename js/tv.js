/**
 * Unique API Key for TMDB Endpoints requests
 */
const API_KEY = '9dfd01779b6fdeb1cde19f1c010bb6a9';
/**
 * TMDB TV Series Endpoints URLs
 */
const ALL_TV_URL = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}`;
const TRENDING_TV_URL = `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}&page=1`;
const TOP_RATED_TV_URL = `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&page=1`;
const TV_DETAILS_URL = `https://api.themoviedb.org/3/tv/`;
const SEARCH_TV_URL = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=`;
/**
 * TMDB Common Endpoints URLs
 */
const GENRES_URL = `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`;
const LANGUAGES_URL = `https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`;
const IMAGE_URL = `https://image.tmdb.org/t/p/w300`;
/**
 * State Object
 */
const stateObject = {
	data: [],
	searchData: []
};
/**
 * Functions
 */
const getAllTV = async () => {
	const response = await fetch(ALL_TV_URL);
	const { results } = await response.json();
	return results;
};

const searchByQuery = async (query) => {
	if (query) {
		const response = await fetch(SEARCH_TV_URL + query);
		const { results } = await response.json();
		return results;
	}
};

const getDailyTrendingTV = async () => {
	const response = await fetch(TRENDING_TV_URL);
	const { results } = await response.json();
	return results;
};

const getTopRatedTV = async () => {
	const response = await fetch(TOP_RATED_TV_URL);
	const { results } = await response.json();
	return results;
};

const getTV = async (id) => {
	const response = await fetch(
		`${TV_DETAILS_URL}${id}?api_key=${API_KEY}&language=en-US`
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
	let filterByGenre = true;
	let filterByLang = true;
	let filterByRating = true;

	if (genres.selectedIndex) {
		if (item.genres.length > 0)
			filterByGenre = item.genres[0].id == genres.value;
		else filterByGenre = false;
	}

	if (languages.selectedIndex) {
		filterByLang =
			item.spoken_languages.length &&
			item.spoken_languages[0].iso_639_1 == languages.value;
	}

	if (ratings.selectedIndex) {
		if (ratings.value >= 6) filterByRating = item.vote_average >= ratings.value;
		else filterByRating = item.vote_average <= ratings.value;
	}

	return filterByGenre && filterByLang && filterByRating;
};

const sortData = (data) => {
	if (sortBy.value === 'title') {
		data.sort((item1, item2) => (item1.name > item2.name ? 1 : -1));
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
	tableBody.innerHTML = '';

	for (let item of dataArr) {
		const tv = await getTV(item.id);
		if (filterData(tv)) {
			const row = document.createElement('tr');

			const titleCell = row.insertCell(0);
			titleCell.innerHTML = tv.name;

			const genreCell = row.insertCell(1);
			genreCell.innerHTML =
				tv.genres.length > 0 ? tv.genres[0].name : 'Unknown';

			const languageCell = row.insertCell(2);
			languageCell.innerHTML =
				tv.spoken_languages.length > 0
					? tv.spoken_languages[0].english_name
					: 'Unknown';

			const ratingCell = row.insertCell(3);
			ratingCell.innerHTML = tv.vote_average;

			const eyeIconCell = row.insertCell(4);
			eyeIconCell.innerHTML = `<i class="far fa-eye-slash" onclick="showDetails(this)"></i>`;

			const detailsCell = row.insertCell(5);
			detailsCell.classList.add('spanRow', 'hideDetail');
			detailsCell.innerHTML = `<div id="rowDetail">
	                  <img src="${
											tv.poster_path
												? IMAGE_URL + tv.poster_path
												: '../img/no-image.png'
										}" alt="" class="mediaImage" />
                    <div id="columnDetail">
	                    <p><span class="subHeading">Overview:</span> ${
												tv.overview
											}</p>
                      <p>
											  <span class="subHeading">Release Date:</span> ${tv.first_air_date}
										  </p>
                      <p>
											  <span class="subHeading">Seasons:</span> ${tv.number_of_seasons}
										  </p>
                    </div>
	                </div>`;

			tableBody.appendChild(row);
		}
	}
};

const getData = async (func) => {
	stateObject.data.length = 0;

	const tvArray = await func();
	stateObject.data = tvArray;

	await buildDataTable(tvArray);
};

const displayAllTV = () => {
	getData(getAllTV);
};

const displayTrendingTV = () => {
	getData(getDailyTrendingTV);
};

const displayTopRatedTV = () => {
	getData(getTopRatedTV);
};

/**
 * Event Listeners
 */
allTV.addEventListener('click', (e) => {
	changeSelectedOption([allTV, trendingTV, topRatedTV], 0);
	clearFilters();
	displayAllTV();
});

trendingTV.addEventListener('click', () => {
	changeSelectedOption([allTV, trendingTV, topRatedTV], 1);
	clearFilters();
	displayTrendingTV();
});

topRatedTV.addEventListener('click', () => {
	changeSelectedOption([allTV, trendingTV, topRatedTV], 2);
	clearFilters();
	displayTopRatedTV();
});

searchBar.addEventListener('keypress', async (e) => {
	if (e.key === 'Enter') {
		sortBy.selectedIndex = 0;
		const searchData = await searchByQuery(searchBar.value.trim());
		if (searchData) {
			stateObject.searchData = searchData;
			await buildDataTable(searchData);
		} else {
			stateObject.searchData = [];
			await buildDataTable(stateObject.data);
		}
	}
});

searchButton.addEventListener('click', async (e) => {
	sortBy.selectedIndex = 0;
	const searchData = await searchByQuery(searchBar.value.trim());
	if (searchData) {
		stateObject.searchData = searchData;
		await buildDataTable(searchData);
	} else {
		stateObject.searchData = [];
		await buildDataTable(stateObject.data);
	}
});

genres.addEventListener('change', async () => {
	sortBy.selectedIndex = 0;
	stateObject.searchData.length === 0
		? await buildDataTable(stateObject.data)
		: buildDataTable(stateObject.searchData);
});

languages.addEventListener('change', async () => {
	sortBy.selectedIndex = 0;
	stateObject.searchData.length === 0
		? await buildDataTable(stateObject.data)
		: buildDataTable(stateObject.searchData);
});

ratings.addEventListener('change', async () => {
	sortBy.selectedIndex = 0;
	stateObject.searchData.length === 0
		? await buildDataTable(stateObject.data)
		: buildDataTable(stateObject.searchData);
});

sortBy.addEventListener('change', async () => {
	const dataList =
		stateObject.searchData.length === 0
			? [...stateObject.data]
			: [...stateObject.searchData];
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
displayAllTV();
