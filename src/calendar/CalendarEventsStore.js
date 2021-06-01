import { getService } from '@nti/web-client';
import { Stores } from '@nti/lib-store';
import AppDispatcher from '@nti/lib-dispatcher';
import { Models } from '@nti/lib-interfaces';

import EventGrouper from '../event-grouper';

import { EVENTS } from './Store';
import { getToday } from './util';

const defaultParams = {
	batchSize: 5,
	batchStart: 0,
	sortOn: 'start_time',
	sortOrder: 'ascending',
};

const isModel = c =>
	(c || {}).MimeType === Models.calendar.CourseCalendar.MimeType;

export default class CalendarEventsStore extends Stores.BoundStore {
	constructor() {
		super();
		AppDispatcher.register(this.handleDispatch);
	}

	handleDispatch = payload => {
		const { action: { type } = {} } = payload || {};

		if (type && Object.values(EVENTS).find(v => v === type)) {
			this.load();
		}
	};

	async getCalendar() {
		let calendar = this.get('calendar');

		if (!calendar) {
			const { calendar: c } = this.binding || {};

			calendar = isModel(c)
				? c
				: await getService().then(s => s.getObject(c));

			this.set({ calendar });
		}

		return calendar;
	}

	async load() {
		const calendar = await this.getCalendar();

		if (!calendar) {
			return;
		}

		const notBefore = getToday().getTime() / 1000;
		let error;

		this.eventGrouper = this.eventGrouper || new EventGrouper();

		this.set({
			loading: true,
			error,
		});

		try {
			const service = await getService();
			const link = calendar.getLink('contents');

			const batch = await service.getBatch(link, {
				...defaultParams,
				notBefore,
			});

			this.eventGrouper.insertEvents(batch.Items);

			this.set({
				loading: false,
				bins: this.eventGrouper.getBins(),
			});
		} catch (e) {
			this.set({
				loading: false,
				error: e,
			});
		}
	}
}
