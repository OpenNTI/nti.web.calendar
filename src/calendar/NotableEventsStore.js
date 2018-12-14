import { getService } from '@nti/web-client';
import { Stores } from '@nti/lib-store';
import AppDispatcher from '@nti/lib-dispatcher';

import EventBinner from '../event-binner';

import {EVENTS} from './Store';
import {getToday} from './util';

const defaultParams = {
	batchSize: 5,
	batchStart: 0,
	sortOn: 'start_time',
	sortOrder: 'ascending',
};

export default class NotableEventsStore extends Stores.BoundStore {

	constructor () {
		super();

		AppDispatcher.register(this.handleDispatch);
	}

	handleDispatch = (payload) => {
		const {action: {type} = {}} = (payload || {});

		if (type && Object.values(EVENTS).find(v => v === type)) {
			this.load();
		}
	}

	async load () {
		const {binding} = this;
		const notBefore = getToday().getTime() / 1000;
		let error;

		this.eventBinner = this.eventBinner || new EventBinner();

		this.set({
			loading: true,
			error
		});

		try {
			const service = await getService();
			let collection = await service.getCollection('Calendars');

			if (!collection) { return; }

			collection = await collection.refresh();
			const link = collection.getLink('events');

			const batch = await service.getBatch(link, {
				...defaultParams,
				notBefore,
				...(binding || {})
			});

			this.eventBinner.insertEvents(batch.Items);

			this.set({
				calendars: collection.Items,
				loading: false,
				bins: this.eventBinner.getBins(),
			});
		}
		catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}
}
