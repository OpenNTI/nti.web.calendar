import { getService } from '@nti/web-client';
import { Stores } from '@nti/lib-store';

import EventBinner from '../event-binner';

const BATCH_SIZE = 100;

export default class CalendarStore extends Stores.BoundStore {
	constructor () {
		super();
		this.eventBinner = new EventBinner();
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

		if (!collection) { return; }

		this.set({
			loading: true,
			error: null
		});

		try {
			const service = await getService();
			const today = new Date();
			const batch = await service.getBatch(collection.getLink('events'), { batchAfter: today.getTime() * 1000 });

			this.set({
				hasMore: batch.Items.length >= BATCH_SIZE,
				hasPrev: true
			});

			this.eventBinner.insertEvents(batch.Items);

			this.set({
				loading: false,
				bins: this.eventBinner.bins,
				calendars: collection.Items
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
		const batch = await service.getBatch(collection.getLink('events'), { batchBefore: firstDate.getTime() * 1000 });

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
		const batch = await service.getBatch(collection.getLink('events'), { batchAfter: lastDate.getTime() * 1000 });

		this.eventBinner.insertEvents(batch.Items);

		this.set({
			loading: false,
			bins: this.eventBinner.bins,
			hasMore: batch.Items.length >= BATCH_SIZE
		});
	}

	setFilter (fitler) {

	}
}
