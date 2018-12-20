import {Stores} from '@nti/lib-store';

const FEED_REL = 'GenerateFeedURL';
const EXPORT_REL = 'export';

export default class CalendarExportStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			loading: true
		});
	}

	async load () {
		this.set({
			loading: true,
			exportLink: null,
			feedLink: null,
			error: null
		});

		if (!this.binding) { return; }

		try {
			const feedLink = this.binding.hasLink(FEED_REL) && await this.binding.fetchLink(FEED_REL);

			this.set({
				loading: false,
				exportLink: this.binding.getLink(EXPORT_REL),
				feedLink
			});
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}

		this.set({
			available: this.binding && this.binding.hasLink(FEED_REL)
		});
	}
}
