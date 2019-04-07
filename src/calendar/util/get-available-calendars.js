import getCollection from './get-calendar-collection';

const available = x => x.hasLink('create_calendar_event');

export default async function getAvailableCalendars () {
	const collection = await getCollection(true);
	const calendars = (collection.Items || []).filter(available);
	return calendars;
}
