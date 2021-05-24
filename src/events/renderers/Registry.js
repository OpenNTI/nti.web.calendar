import { Registry } from '@nti/lib-commons';

export default class CalendarEventsRegistry extends Registry.Map {
	static hasHandler(item) {
		return !!this.getInstance().getItem(item.MimeType);
	}

	static lookup(item) {
		return this.getInstance().getItem(item.MimeType);
	}
}
