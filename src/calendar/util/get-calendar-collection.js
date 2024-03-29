import { getService } from '@nti/web-client';

export async function getCalendarCollection(refresh) {
	return getService()
		.then(service => service.getCollection('Calendars'))
		.then(collection => (refresh ? collection?.refresh?.() : collection));
}
