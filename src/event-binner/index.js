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

	findBinFor (event) {
		if(!event) {
			return null;
		}

		const bins = this[BINNER](event);
		let binMatch = null;

		for (let bin of bins) {
			const existing = this[BINS][bin];

			if (existing) {
				for(let item of existing.items) {
					if(item.getUniqueIdentifier() === event.getUniqueIdentifier()) {
						binMatch = existing;
					}
				}
			}
		}

		return binMatch;
	}

	async updateEvent (event) {
		this.removeEvent(event);
		this.insertEvent(event);
	}

	removeEvent (event) {
		const binWithEvent = this.findBinFor(event);

		if(binWithEvent) {
			binWithEvent.removeItem(event);
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
