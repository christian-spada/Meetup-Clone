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

export const sortEvents = (events, isGroupPage) => {
	const sortedEvents = [...events]?.sort((event1, event2) => {
		return new Date({ ...event1 }.startDate) - new Date({ ...event2 }.startDate);
	});

	const pastEventsTotal = sortedEvents.filter(
		({ startDate }) => new Date(startDate) < new Date()
	).length;

	const pastEvents = sortedEvents.splice(0, pastEventsTotal);

	if (isGroupPage) {
		return { sortedEvents, pastEvents };
	}

	return sortedEvents.concat(pastEvents);
};
