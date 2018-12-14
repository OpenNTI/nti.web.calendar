import { getService, getAppUsername } from '@nti/web-client';
import { Stores } from '@nti/lib-store';
import { LocalStorage } from '@nti/web-storage';
import AppDispatcher from '@nti/lib-dispatcher';

import {EVENTS} from '../calendar/Store';

function makeKey () {
	return getAppUsername() + '-hasSeenTodaysEvents';
}

function makeDateStr (date) {
	return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
}

export default class DateIconStore extends Stores.BoundStore {
	constructor () {
		super();

		AppDispatcher.register(this.handleDispatch);
	}

	handleDispatch = (payload) => {
		if (!payload) {
			return;
		} else {
			const {action: {type} = {}} = payload;

			if (type && Object.values(EVENTS).find(v => v === type)) {
				this.load();
			}
		}
	}

	markSeen () {
		const key = makeKey();
		const data = {
			date: makeDateStr(new Date()),
			count: this.get('todaysCount')
		};

		LocalStorage.setItem(key, JSON.stringify(data));

		this.set({hasSeen: true});
	}

	getEndOfDay () {
		const endOfDay = new Date();
		endOfDay.setSeconds(59);
		endOfDay.setMinutes(59);
		endOfDay.setHours(23);

		return endOfDay;
	}

	async load () {
		try {
			const service = await getService();
			const collection = await service.getCollection('Calendars');
			const today = new Date();
			const endOfDay = this.getEndOfDay();

			const batch = await service.getBatch(collection.getLink('events'), { batchSize: 1, notBefore: today.getTime() / 1000, notAfter: endOfDay.getTime() / 1000 });

			if(batch.FilteredTotalItemCount > 0) {
				const key = makeKey();
				const existingValue = LocalStorage.getItem(key);

				let hasSeen = true;

				if(!existingValue) {
					hasSeen = false;
				} else  {
					try {
						// user has seen it at some point, check date and count
						let oldData = JSON.parse(existingValue);
						let {count, date} = oldData;
						const dateStr = makeDateStr(endOfDay);

						if(date !== dateStr || count !== batch.FilteredTotalItemCount) {
							// new day or count has changed, remove seen marker
							LocalStorage.removeItem(key);
							hasSeen = false;
						}
					}
					catch(e) {
						// play it safe and just remove (might have invalid data)
						LocalStorage.removeItem(key);
						hasSeen = false;
					}
				}

				this.set({
					todaysCount: batch.FilteredTotalItemCount,
					hasSeen
				});
			}
		} catch (e) {
			this.set({
				error: e
			});
		}
	}
}
