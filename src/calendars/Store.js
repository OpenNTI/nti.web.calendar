import {Stores, Interfaces} from '@nti/lib-store';
import {getService} from '@nti/web-client';

const BatchSize = 20;

class CalendarsStore extends Stores.BoundStore {
	static async getCalendarForEvent (event) {
		if (!event) { throw new Error('Must pass an event to getCalendarForEvent'); }

		const service = await getService();
		const calendar = await service.getObject(event.ContainerId);

		return calendar;
	}

	static async getFirstAdminCalendar () {
		try {
			const service = await getService();
			const collection = service.getCollection('AdminCalendars');

			const batch = await service.getBatch(collection.href, {batchSize: 1, batchStart: 0});

			return batch && batch.Items && batch.Items[0];
		} catch (e) {
			//swallow the error, if it throws assume you don't have any admin calendars
			return false;
		}
	}

	static async hasAdminCalendars () {
		try {
			const service = await getService();
			const collection = service.getCollection('AdminCalendars');

			const batch = await service.getBatch(collection.href, {batchSize: 1, batchStart: 0});

			return batch && batch.Items && batch.Items.length > 0;
		} catch (e) {
			//swallow the error, if it throws assume you don't have any admin calendars
			return false;
		}
	}

	async loadInitialBatch () {
		const collectionName = this.binding.admin ? 'AdminCalendars' : 'Calendars';

		const service = await getService();
		const collection = service.getCollection(collectionName);

		const params = {
			batchSize: BatchSize,
			batchStart: 0
		};

		if (this.searchTerm) {
			params.filter = this.searchTerm;
		}

		return service.getBatch(collection.href, params);
	}

	async loadNextBatch (current) {
		if (!current.hasLink('batch-next')) { return; }

		const service = await getService();

		return service.getBatch(current.getLink('batch-next'));
	}
}

export default Interfaces.combine(
	Interfaces.BatchLoadMore,
	Interfaces.Searchable
)(CalendarsStore);
