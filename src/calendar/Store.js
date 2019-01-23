import { getService } from '@nti/web-client';
import { Stores } from '@nti/lib-store';
import AppDispatcher from '@nti/lib-dispatcher';

import EventBinner from '../event-binner';

import {getToday} from './util';

const EVENT_HANDLERS = Symbol('EventHandlers');

const BATCH_SIZE = 100;

export const EVENTS = {
	CREATED: 'Calendar-Event-Created',
	CHANGED: 'Calendar-Event-Changed',
	DELETED: 'Calendar-Event-Deleted',
	ENROLLMENT_CHANGED: 'Course-Enrollment-Changed'
};

function getMimeTypeFor (calendar) {
	if(calendar.MimeType === 'application/vnd.nextthought.courseware.coursecalendar') {
		return 'application/vnd.nextthought.courseware.coursecalendarevent';
	}

	return null;
}

function appendToFormData (formData, fieldName, value, force) {
	if(value || force) {
		formData.append(fieldName, value);
	}
}

export default class CalendarStore extends Stores.BoundStore {
	constructor () {
		super();

		this[EVENT_HANDLERS] = {
			[EVENTS.CREATED]: this.handleCreated,
			[EVENTS.CHANGED]: this.handleChanged,
			[EVENTS.DELETED]: this.handleDeleted,
			[EVENTS.ENROLLMENT_CHANGED]: this.handleEnrollmentChanged
		};

		this.clear();

		AppDispatcher.register(this.handleCalendarChangeDispatch);
	}

	clear () {
		this.set({
			batchSize: BATCH_SIZE,
			filters: JSON.parse(localStorage.getItem('calendar-filters')) || [],
			nextLoading: false,
			prevLoading: false,
			hasNext: false,
			hasPrev: true,
			loaded: false,
			batchStartPrev: 0,
			batchStartNext: 0,
			bins: [],
			calendars: [],
		});
	}

	handleCalendarChangeDispatch = (payload) => {
		if (!payload) {
			return;
		} else {
			const {action} = payload;
			const {data, type} = action;
			const calendarEvent = data && data.calendarEvent;

			const handler = this[EVENT_HANDLERS][type];

			if(handler) {
				handler(calendarEvent);
			}
		}
	}

	handleCreated = (calendarEvent) => {
		this.eventBinner.insertEvents([calendarEvent]);

		this.set({
			bins: this.eventBinner.getBins(false)
		});
	}

	handleChanged = async (calendarEvent) => {
		await this.eventBinner.updateEvent(calendarEvent);

		this.set({
			bins: this.eventBinner.getBins(false)
		});
	}

	handleDeleted = (calendarEvent) => {
		this.eventBinner.removeEvent(calendarEvent);

		this.set({
			bins: this.eventBinner.getBins(false)
		});
	}

	handleEnrollmentChanged = () => {
		// reload available calendars and events
		this.clear();
		this.load();
	}

	set batchSize (batchSize) {
		return this.set({batchSize});
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

			this.set('availableCalendars', this.getAvailableCalendars());

			this.loadInitialBatch();
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}

	async loadBatch (link, params = {}) {
		const service = await getService();
		const batchSize = this.get('batchSize');
		const filters = this.get('filters');

		const defaults = {
			batchSize,
			batchStart: 0,
			sortOn: 'start_time',
			sortOrder: 'ascending',
		};

		return service.getPostBatch(link, {
			...defaults,
			...params
		}, { 'excluded_context_ntiids': filters });
	}


	async loadInitialBatch () {
		const collection = this.collection;

		this.eventBinner = new EventBinner(null, true);

		if (!collection) { return; }

		this.set({
			loading: true,
			error: null
		});

		try {
			const batchSize = this.get('batchSize');
			const today = getToday();
			const link = collection.getLink('events');

			let batch = await this.loadBatch(link, {
				notBefore: today.getTime() / 1000
			});

			if (batch.Items.length === 0) {
				batch = await this.loadBatch(link, {
					notAfter: today.getTime() / 1000,
					sortOrder: 'descending',
					sortOn: 'end_time'
				});

				this.set({
					batchStartPrev: this.get('batchStartPrev') + this.get('batchSize')
				});
			} else {
				this.set({
					batchStartNext: this.get('batchStartNext') + this.get('batchSize')
				});
			}

			const hasMore = batch.FilteredTotalItemCount >= batchSize;

			this.eventBinner.insertEvents(batch.Items, hasMore);

			this.set({
				hasNext: hasMore,
				hasPrev: true,
				loading: false,
				loaded: true,
				bins: this.eventBinner.getBins(true, hasMore),
				calendars: collection.Items,
				canCreate: collection && collection.Items && collection.Items.some(x => x.hasLink('create_calendar_event')),
			});
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}

	async loadMoreBefore () {
		const {collection} = this;

		if (!this.get('hasPrev') || !collection) { return; }

		this.set({
			prevLoading: true
		});

		const batchSize = this.get('batchSize');

		const batch = await this.loadBatch(collection.getLink('events'), { batchStart: this.get('batchStartPrev'), sortOrder: 'descending', sortOn: 'end_time' });

		this.eventBinner.insertEvents(batch.Items);
		const hasPrev = batch.FilteredTotalItemCount >= batchSize;
		this.set({
			batchStartPrev: this.get('batchStartPrev') + this.get('batchSize'),
			prevLoading: false,
			bins: this.eventBinner.getBins(hasPrev, this.get('hasNext')),
			hasPrev
		});
	}

	async loadMoreAfter () {
		const collection = this.collection;

		if (!this.get('hasNext') || !collection) { return; }

		this.set({
			nextLoading: true
		});

		const batchSize = this.get('batchSize');
		const batch = await this.loadBatch(collection.getLink('events'), { batchStart: this.get('batchStartNext') });

		const hasMore = batch.FilteredTotalItemCount >= batchSize;

		this.eventBinner.insertEvents(batch.Items);

		this.set({
			batchStartNext: this.get('batchStartNext') + batchSize,
			nextLoading: false,
			bins: this.eventBinner.getBins(this.get('hasPrev'), hasMore),
			hasNext: hasMore,
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
		this.loadInitialBatch();
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

			// pass in event to determine whether to force append the value.  On initial creation, we don't want
			// the formData to have empty values.  However, on edit (when we have an existing event), we do want
			// to have empty values in there and we'll let the server error out if anything required is missing
			appendToFormData(formData, 'MimeType', getMimeTypeFor(calendar), event);
			appendToFormData(formData, 'title', title, event);
			appendToFormData(formData, 'description', description, event);
			appendToFormData(formData, 'location', location, event);
			appendToFormData(formData, 'start_time', startDate && startDate.toISOString(), event);
			appendToFormData(formData, 'end_time', endDate && endDate.toISOString(), event);

			if(img !== undefined) {
				formData.append('icon', img || null);
			}
			else if (event && event.icon) {
				formData.append('icon', event.icon);
			}

			let calendarEvent;
			let type = EVENTS.CREATED;

			if(event) {
				calendarEvent = await service.putParseResponse(event.getLink('edit'), formData);
				type = EVENTS.CHANGED;
			}
			else {
				calendarEvent = await service.postParseResponse(calendar.getLink('create_calendar_event'), formData);
			}

			this.set({
				saving: false
			});

			// dispatch here so that any instance of this store gets the memo
			AppDispatcher.handleRequestAction({
				type,
				data: {
					calendarEvent
				}
			});

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
