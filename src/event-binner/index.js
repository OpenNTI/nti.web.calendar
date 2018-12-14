import {day} from './Constants';
import {getBinner} from './binners';
import {createBin, insertEvent} from './Bin';

const BY = Symbol('By');
const BINNER = Symbol('Binner');
const BINS = Symbol('Bins');

function trimPrecedingPhantoms (bins) {
	const firstNonPhantomIndex = bins.findIndex(bin => !bin.phantom);

	return bins.slice(firstNonPhantomIndex);
}

function trimTrailingPhantoms (bins) {
	const reversed = ([...bins]).reverse();
	const firstNonPhantomIndex = reversed.findIndex(bin => !bin.phantom);

	return reversed.slice(firstNonPhantomIndex).reverse();
}

export default class EventBinner {
	static day = day

	constructor (by, insertToday) {
		this[BY] = by;
		this[BINNER] = getBinner(by);
		this[BINS] = {};

		if (insertToday) {
			// Create a placeholder bin for today
			const today = this[BINNER]({ getStartTime: () => new Date(), getEndTime: () => { } });
			this[BINS][today[0]] = createBin(today[0], null, this[BINNER]);
		}
	}


	insertEvents (events) {
		for (let event of events) {
			this.insertEvent(event);
		}
	}

	findBinsFor (event) {
		if(!event) {
			return null;
		}

		const bins = Object.values(this[BINS]);
		let binMatches = [];

		for (let bin of bins) {
			for(let item of bin.items) {
				if(item.getUniqueIdentifier() === event.getUniqueIdentifier()) {
					binMatches.push(bin);
				}
			}
		}

		return binMatches;
	}

	async updateEvent (event) {
		this.removeEvent(event);
		this.insertEvent(event);
	}

	trimBins () {
		for(let key of Object.keys(this[BINS])) {
			const bin = this[BINS][key];

			if(!bin.items || bin.items.length === 0) {
				delete this[BINS][key];
			}
		}
	}

	removeEvent (event) {
		const binsWithEvent = this.findBinsFor(event);

		if(binsWithEvent) {
			for(let binWithEvent of binsWithEvent) {
				binWithEvent.removeItem(event);
			}
		}

		this.trimBins();
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

	getBins (trimPreceding, trimTrailing) {
		let bins = Object.values(this[BINS])
			.sort((a, b) => {
				const aStart = new Date(a.name);
				const bStart = new Date(b.name);

				return aStart < bStart ? -1 : (aStart === bStart ? 0 : 1);
			});

		if (trimPreceding) {
			bins = trimPrecedingPhantoms(bins);
		}

		if (trimTrailing) {
			bins = trimTrailingPhantoms(bins);
		}

		return bins;
	}

	getFirstEvent (trimPreceding, trimTrailing) {
		const bins = this.getBins(trimPreceding, trimTrailing);

		for (let i = 0; i < bins.length - 1; i++) {
			let bin = bins[i];
			let event = bin.getFirstRealEvent();

			if (event) {
				return event;
			}
		}
	}


	getLastEvent (trimPreceding, trimTrailing) {
		const bins = this.getBins(trimPreceding, trimTrailing);

		for (let i = bins.length - 1; i > 0; i--) {
			let bin = bins[i];
			let event = bin.getLastRealEvent();

			if (event) {
				return event;
			}
		}
	}
}
