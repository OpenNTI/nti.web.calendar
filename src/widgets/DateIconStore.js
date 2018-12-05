import { getService } from '@nti/web-client';
import { Stores } from '@nti/lib-store';

export default class DateIconStore extends Stores.BoundStore {
	async load () {
		try {
			const service = await getService();
			const collection = await service.getCollection('Calendars');
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const endOfDay = new Date(today);
			endOfDay.setSeconds(59);
			endOfDay.setMinutes(59);
			endOfDay.setHours(23);

			const batch = await service.getBatch(collection.getLink('events'), { batchSize: 1, notBefore: today.getTime() / 1000, notAfter: endOfDay.getTime() / 1000 });

			this.set({
				todaysCount: batch.FilteredTotalItemCount
			});
		} catch (e) {
			this.set({
				error: e
			});
		}
	}
}
