import { getService } from '@nti/web-client';
import { Stores } from '@nti/lib-store';
import AppDispatcher from '@nti/lib-dispatcher';

import EventGrouper from '../event-grouper';

import { EVENTS } from './Store';
import { getCalendarCollection, getToday } from './util';

const defaultParams = {
	batchSize: 5,
	batchStart: 0,
	sortOn: 'start_time',
	sortOrder: 'ascending',
};

export default class NotableEventsStore extends Stores.BoundStore {
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

	async load() {
		const { binding } = this;
		const notBefore = getToday().getTime() / 1000;
		let error;

		this.eventGrouper = this.eventGrouper || new EventGrouper();

		this.set({
			loading: true,
			error,
		});

		try {
			const service = await getService();
			let collection = await getCalendarCollection(true);

			if (!collection) {
				return;
			}

			const link = collection.getLink('events');

			const batch = await service.getBatch(link, {
				...defaultParams,
				notBefore,
				...(binding || {}),
			});

			this.eventGrouper.insertEvents(batch.Items);

			this.set({
				calendars: collection.Items,
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
