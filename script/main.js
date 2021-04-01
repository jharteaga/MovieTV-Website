const toggleRow = (element) => {
	element.classList.toggle('fa-eye-slash');
	element.classList.toggle('fa-eye');
	const detailRow = element.parentElement.nextElementSibling;
	detailRow.classList.toggle('hideDetail');
};
