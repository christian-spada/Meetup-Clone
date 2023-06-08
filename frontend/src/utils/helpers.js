export const formatDateAndTime = dateData => {
	const date = new Date(dateData);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	let hours = String(date.getHours());
	const minutes = String(date.getMinutes()).padStart(2, '0');

	let timeOfDay = 'AM';
	if (hours >= 12) {
		timeOfDay = 'PM';
		if (hours > 12) {
			hours -= 12;
		}
	}

	let formattedTime = `${hours}:${minutes} ${timeOfDay}`;

	const formattedDate = `${year}-${month}-${day}`;

	return { formattedDate, formattedTime };
};
