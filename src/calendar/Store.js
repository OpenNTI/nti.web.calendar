import { getService } from '@nti/web-client';
import { Stores } from '@nti/lib-store';

import EventBinner from '../event-binner';

const BATCH_SIZE = 100;

function getMimeTypeFor (calendar) {
	if(calendar.MimeType === 'application/vnd.nextthought.courseware.coursecalendar') {
		return 'application/vnd.nextthought.courseware.coursecalendarevent';
	}

	return null;
}

export default class CalendarStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			filters: JSON.parse(localStorage.getItem('calendar-filters')) || []
		});
	}

	async load () {
		if (!this.binding) {
			this.loadForCurrentUser();
		} else {
			this.loadForEntity(this.binding);
		}
	}

	async loadForEntity () {
		//todo: fill this out later
	}

	async loadForCurrentUser () {
		this.set({
			loading: true,
			error: null
		});

		try {
			const service = await getService();
			const collection = await service.getCollection('Calendars');

			this.collection = await collection.refresh();
			this.loadInitialBatch();
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}


	async loadInitialBatch () {
		const filters = this.get('filters');
		const collection = this.collection;

		this.eventBinner = new EventBinner();

		if (!collection) { return; }

		this.set({
			loading: true,
			error: null
		});

		try {
			const service = await getService();
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const batch = await service.getBatch(collection.getLink('events'), {
				batchSize: BATCH_SIZE,
				batchStart: 0,
				notBefore: today.getTime() / 1000,
				'excluded_context_ntiids': filters
			});

			this.set({
				hasMore: batch.Items.length >= BATCH_SIZE,
				hasPrev: true
			});

			this.eventBinner.insertEvents(batch.Items);

			this.set({
				loading: false,
				bins: this.eventBinner.bins,
				calendars: collection.Items,
				canCreate: collection && collection.Items.some(x => x.hasLink('create_calendar_event'))
			});
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}

	async loadMoreBefore () {
		const collection = this.collection;

		if (!this.get('hasMore') || !collection) { return; }
		const filters = this.get('filters');
		const firstEvent = this.eventBinner.getfirstEvent();
		const service = await getService();
		const firstDate = firstEvent.getStartDate();
		const batch = await service.getBatch(collection.getLink('events'), {
			batchSize: BATCH_SIZE,
			batchStart: 0,
			notBefore: firstDate.getTime() / 1000
		});

		this.eventBinner.insertEvents(batch.Items);

		this.set({
			loading: false,
			bins: this.eventBinner.bins,
			hasMore: batch.Items.length >= BATCH_SIZE
		});
	}

	async loadMoreAfter () {
		const collection = this.collection;

		if (!this.get('hasMore') || !collection) { return; }
		const filters = this.get('filters');
		const lastEvent = this.eventBinner.getLastEvent();
		const service = await getService();
		const lastDate = lastEvent.getStartDate();
		const batch = await service.getBatch(collection.getLink('events'), {
			batchSize: BATCH_SIZE,
			batchStart: 0,
			notBefore: lastDate.getTime() / 1000
		});

		this.eventBinner.insertEvents(batch.Items);

		this.set({
			loading: false,
			bins: this.eventBinner.bins,
			hasMore: batch.Items.length >= BATCH_SIZE
		});
	}

	addFilter = (filter) => {
		const filters = this.get('filters');
		this.set({ filters: [...filters, filter ]});
		localStorage.setItem('calendar-filters', JSON.stringify([...filters, filter ]));
		this.loadInitialBatch();
	}

	removeFilter = (filter) => {
		const filters = this.get('filters');
		const index = filters.findIndex(x => x === filter);
		filters.splice(index, 1);
		const newFilters = filters.slice();
		localStorage.setItem('calendar-filters', JSON.stringify(newFilters));
		this.set({ filters: newFilters });
	}

	getAvailableCalendars () {
		const items = (this.collection && this.collection.Items) || [];

		return items.filter(x => x.hasLink('create_calendar_event'));
	}

	async createEvent (calendar, event, title, description, location, startDate, endDate, img) {
		this.set({
			saving: true,
			createError: null
		});

		try {
			const service = await getService();
			const formData = new FormData();

			formData.append('MimeType', getMimeTypeFor(calendar));

			if(title) {
				formData.append('title', title);
			}

			if(description) {
				formData.append('description', description);
			}

			if(location) {
				formData.append('location', location);
			}

			if(startDate) {
				formData.append('start_time', startDate.toISOString());
			}

			if(endDate) {
				formData.append('end_time', endDate.toISOString());
			}

			if(img !== undefined) {
				formData.append('icon', img || null);
			}
			else if (event && event.icon) {
				formData.append('icon', event.icon);
			}

			let calendarEvent;

			if(event) {
				calendarEvent = await service.putParseResponse(event.getLink('edit'), formData);
			}
			else {
				calendarEvent = await service.postParseResponse(calendar.getLink('create_calendar_event'), formData);
			}

			this.set({
				saving: false
			});

			this.load();

			return calendarEvent;
		}
		catch (e) {
			let createError = e.message || e;

			if(e.code === 'RequiredMissing') {
				createError = 'Missing required field: ' + e.field;
			}

			this.set({
				loading: false,
				saving: false,
				createError
			});

			return null;
		}
	}
}
