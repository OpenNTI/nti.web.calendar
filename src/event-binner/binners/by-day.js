function getNameForDate (date) {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export default function byDay (event) {
	const start = event.getStartDate();
	const end = event.getEndDate();

	const days = [getNameForDate(start)];

	if (!end) { return days; }

	const endName = getNameForDate(end);

	let current = new Date(start);

	while (days[days.length - 1] !== endName) {
		current.setDate(current.getDate() + 1);

		days.push(getNameForDate(current));
	}

	return days;
}
