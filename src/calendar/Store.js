import { getService } from '@nti/web-client';
import { Stores } from '@nti/lib-store';
import AppDispatcher from '@nti/lib-dispatcher';
import { Events } from '@nti/web-session';

import EventGrouper from '../event-grouper';
import CalendarsStore from '../calendars/Store';

import { getToday } from './util';

const EVENT_HANDLERS = Symbol('EventHandlers');

const BATCH_SIZE = 100;

export const EVENTS = {
	CREATED: 'Calendar-Event-Created',
	CHANGED: 'Calendar-Event-Changed',
	DELETED: 'Calendar-Event-Deleted',
	ENROLLMENT_CHANGED: 'Course-Enrollment-Changed',
};

function getMimeType(calendar) {
	if (
		calendar.MimeType ===
		'application/vnd.nextthought.courseware.coursecalendar'
	) {
		return 'application/vnd.nextthought.courseware.coursecalendarevent';
	}

	return null;
}

function getFormDataForCreating(data) {
	const formData = new FormData();
	const keys = Object.keys(data);

	for (let key of keys) {
		const value = data[key];

		if (value != null) {
			formData.append(key, value);
		}
	}

	return formData;
}

function getFormDataForUpdating(newData, oldData) {
	const formData = new FormData();
	let didChange = false;

	const maybeAdd = key => {
		if (newData[key] !== oldData[key]) {
			didChange = true;
			formData.append(key, newData[key]);
		}
	};

	if (newData.icon !== undefined) {
		didChange = true;
		formData.append('icon', newData.icon);
	}

	maybeAdd('MimeType');
	maybeAdd('title');
	maybeAdd('description');
	maybeAdd('location');
	maybeAdd('start_time');
	maybeAdd('end_time');

	return didChange ? formData : null;
}

export default class CalendarStore extends Stores.BoundStore {
	constructor() {
		super();

		this[EVENT_HANDLERS] = {
			[EVENTS.CREATED]: this.handleCreated,
			[EVENTS.CHANGED]: this.handleChanged,
			[EVENTS.DELETED]: this.handleDeleted,
			[EVENTS.ENROLLMENT_CHANGED]: this.handleEnrollmentChanged,
		};

		this.clear();

		AppDispatcher.register(this.handleCalendarChangeDispatch);
	}

	clear() {
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

	handleCalendarChangeDispatch = payload => {
		if (!payload) {
			return;
		} else {
			const { action } = payload;
			const { data, type } = action;
			const calendarEvent = data && data.calendarEvent;

			const handler = this[EVENT_HANDLERS][type];

			if (handler) {
				handler(calendarEvent);
			}
		}
	};

	handleCreated = calendarEvent => {
		this.eventGrouper.insertEvents([calendarEvent]);

		this.set({
			bins: this.eventGrouper.getBins(false),
		});
	};

	handleChanged = async calendarEvent => {
		await this.eventGrouper.updateEvent(calendarEvent);

		this.set({
			bins: this.eventGrouper.getBins(false),
		});
	};

	handleDeleted = calendarEvent => {
		this.eventGrouper.removeEvent(calendarEvent);

		this.set({
			bins: this.eventGrouper.getBins(false),
		});
	};

	handleEnrollmentChanged = () => {
		// reload available calendars and events
		this.clear();
		this.load();
	};

	set batchSize(batchSize) {
		this.set({ batchSize });
	}

	async load() {
		if (!this.binding) {
			this.loadForCurrentUser();
		} else {
			this.loadForEntity(this.binding);
		}
	}

	async loadForEntity() {
		//todo: fill this out later
	}

	async loadForCurrentUser() {
		this.set({
			loading: true,
			error: null,
		});

		try {
			const service = await getService();
			this.collection = await service.getCollection('Calendars');

			this.loadInitialBatch();
		} catch (e) {
			this.set({
				loading: false,
				error: e,
			});
		}
	}

	async loadBatch(link, params = {}) {
		const service = await getService();
		const batchSize = this.get('batchSize');
		const filters = this.get('filters');

		const defaults = {
			batchSize,
			batchStart: 0,
			sortOn: 'start_time',
			sortOrder: 'ascending',
		};

		return service.getBatch(
			link,
			{
				...defaults,
				...params,
			},
			{ method: 'post', data: { excluded_context_ntiids: filters } }
		);
	}

	async loadInitialBatch() {
		const collection = this.collection;

		this.eventGrouper = new EventGrouper(null, true);

		if (!collection) {
			return;
		}

		this.set({
			loading: true,
			error: null,
		});

		try {
			const batchSize = this.get('batchSize');
			const today = getToday();
			const link = collection.getLink('events');

			const canCreate = await CalendarsStore.hasAdminCalendars();

			let batch = await this.loadBatch(link, {
				notBefore: today.getTime() / 1000,
			});

			if (batch.Items.length === 0) {
				batch = await this.loadBatch(link, {
					notAfter: today.getTime() / 1000,
					sortOrder: 'descending',
					sortOn: 'end_time',
				});

				this.set({
					batchStartPrev:
						this.get('batchStartPrev') + this.get('batchSize'),
				});
			} else {
				this.set({
					batchStartNext:
						this.get('batchStartNext') + this.get('batchSize'),
				});
			}

			const hasMore = batch.FilteredTotalItemCount >= batchSize;

			this.eventGrouper.insertEvents(batch.Items, hasMore);

			this.set({
				hasNext: hasMore,
				hasPrev: true,
				loading: false,
				loaded: true,
				bins: this.eventGrouper.getBins(true, hasMore),
				canCreate,
			});
		} catch (e) {
			this.set({
				loading: false,
				error: e,
			});
		}
	}

	async loadMoreBefore() {
		const { collection } = this;

		if (!this.get('hasPrev') || !collection) {
			return;
		}

		this.set({
			prevLoading: true,
		});

		const batchSize = this.get('batchSize');
		const batch = await this.loadBatch(collection.getLink('events'), {
			batchStart: this.get('batchStartPrev'),
			sortOrder: 'descending',
			sortOn: 'end_time',
		});

		const hasPrev = batch.FilteredTotalItemCount >= batchSize;

		this.eventGrouper.insertEvents(batch.Items);

		this.set({
			batchStartPrev: this.get('batchStartPrev') + this.get('batchSize'),
			prevLoading: false,
			bins: this.eventGrouper.getBins(hasPrev, this.get('hasNext')),
			hasPrev,
		});
	}

	async loadMoreAfter() {
		const collection = this.collection;

		if (!this.get('hasNext') || !collection) {
			return;
		}

		this.set({
			nextLoading: true,
		});

		const batchSize = this.get('batchSize');
		const batch = await this.loadBatch(collection.getLink('events'), {
			batchStart: this.get('batchStartNext'),
		});

		const hasMore = batch.FilteredTotalItemCount >= batchSize;

		this.eventGrouper.insertEvents(batch.Items);

		this.set({
			batchStartNext: this.get('batchStartNext') + batchSize,
			nextLoading: false,
			bins: this.eventGrouper.getBins(this.get('hasPrev'), hasMore),
			hasNext: hasMore,
		});
	}

	setFilters(filters) {
		this.set({
			filters,
			batchStartNext: 0,
			batchStartPrev: 0,
		});

		localStorage.setItem('calendar-filters', JSON.stringify([...filters]));
		this.loadInitialBatch();
	}

	addFilter = filter => {
		const filters = this.get('filters');

		this.set({
			filters: [...filters, filter],
			batchStartNext: 0,
			batchStartPrev: 0,
		});

		localStorage.setItem(
			'calendar-filters',
			JSON.stringify([...filters, filter])
		);

		this.loadInitialBatch();
	};

	removeFilter = filter => {
		const filters = this.get('filters');
		const index = filters.findIndex(x => x === filter);

		filters.splice(index, 1);

		const newFilters = filters.slice();

		localStorage.setItem('calendar-filters', JSON.stringify(newFilters));

		this.set({
			filters: newFilters,
			batchStartNext: 0,
			batchStartPrev: 0,
		});

		this.loadInitialBatch();
	};

	getAvailableCalendars() {
		const items = (this.collection && this.collection.Items) || [];

		return items.filter(x => x.hasLink('create_calendar_event'));
	}

	async createEvent(
		calendar,
		event,
		title,
		description,
		location,
		startDate,
		endDate,
		img
	) {
		this.set({
			saving: true,
			createError: null,
		});

		try {
			const service = await getService();
			const newData = {
				MimeType: getMimeType(calendar),
				title,
				description,
				location,
				start_time: startDate && startDate.toISOString(),
				end_time: endDate && endDate.toISOString(),
				icon: img,
			};
			const oldData = !event
				? null
				: {
						MimeType: event.MimeType,
						title: event.title,
						description: event.description,
						location: event.location,
						icon: event.icon,
						start_time:
							event.getStartTime() &&
							event.getStartTime().toISOString(),
						end_time:
							event.getEndTime() &&
							event.getEndTime().toISOString(),
				  };
			const formData = event
				? getFormDataForUpdating(newData, oldData)
				: getFormDataForCreating(newData);

			if (!formData && event) {
				this.set({
					saving: false,
				});
				return event;
			}

			let calendarEvent;
			let type = EVENTS.CREATED;

			if (event) {
				const raw = await service.put(event.getLink('edit'), formData);
				await event.refresh(raw);
				calendarEvent = event;
				type = EVENTS.CHANGED;
				Events.emit(Events.EVENT_UPDATED, raw);
			} else {
				calendarEvent = await service.postParseResponse(
					calendar.getLink('create_calendar_event'),
					formData
				);
			}

			this.set({
				saving: false,
			});

			// dispatch here so that any instance of this store gets the memo
			AppDispatcher.handleRequestAction({
				type,
				data: {
					calendarEvent,
				},
			});

			return calendarEvent;
		} catch (e) {
			let createError = e.message || e;

			if (e.code === 'RequiredMissing') {
				createError = 'Missing required field: ' + e.field;
			}

			this.set({
				loading: false,
				saving: false,
				createError,
			});

			return null;
		}
	}
}
