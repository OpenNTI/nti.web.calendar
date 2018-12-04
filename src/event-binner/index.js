import {day} from './Constants';
import {getBinner} from './binners';
import {createBin, insertEvent} from './Bin';

const BY = Symbol('By');
const BINNER = Symbol('Binner');
const BINS = Symbol('Bins');

export default class EventBinner {
	static day = day

	constructor (by) {
		this[BY] = by;
		this[BINNER] = getBinner(by);
		this[BINS] = {};
	}


	insertEvents (events) {
		for (let event of events) {
			this.insertEvent(event);
		}
	}


	insertEvent (event) {
		if (!event || !event.getStartTime || !event.getEndTime) { throw new Error('Invalid Event Inserted'); }

		const bins = this[BINNER](event);

		for (let bin of bins) {
			const existing = this[BINS][bin];

			if (existing) {
				this[BINS][bin] = insertEvent(existing, event);
			} else {
				this[BINS][bin] = createBin(bin, event, this[BINNER]);
			}
		}
	}


	get bins () {
		const bins = Object.values(this[BINS]);

		return bins.sort((a, b) => {
			const aStart = new Date(a.name);
			const bStart = new Date(b.name);

			return aStart < bStart ? -1 : (aStart === bStart ? 0 : 1);
		});
	}

	getFirstEvent () {
		const {bins} = this;
		const first = bins && bins[0];

		if (!first) { return null; }

		const {items} = first;

		return items ? items[0] : null;
	}


	getLastEvent () {
		const {bins} = this;
		const last = bins && bins[bins.length - 1];

		if (!last) { return null; }

		const {items} = last;

		return items ? items[items.length - 1] : null;
	}
}
