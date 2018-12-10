import { getNameForDate } from './binners/by-day';

const NAME = Symbol('Name');
const ITEMS = Symbol('Items');
const BINNER = Symbol('Binner');

class Bin {
	constructor (name, items = [], binner) {
		this[NAME] = name;
		this[ITEMS] = items;
		this[BINNER] = binner;
	}

	get name () {
		return this[NAME];
	}

	get items () {
		return this[ITEMS];
	}

	get start () {
		const first = this.items[0];

		return first ? first.getStartTime() : null;
	}

	get end () {
		const end = this.items[this.items.length - 1];

		return end ? (end.getEndTime() || end.getStartTime()) : null;
	}

	get phantom () {
		const {items, name} = this;
		const binner = this[BINNER];

		return !items.some(item => binner(item)[0] === name);
	}

	getBinsFor (item) {
		return this[BINNER](item);
	}

	getFirstRealEvent () {
		const {items, name} = this;
		const binner = this[BINNER];

		for (let item of items) {
			if (binner(item)[0] === name) {
				return item;
			}
		}
	}


	getLastRealEvent () {
		const {items, name} = this;
		const binner = this[BINNER];

		for (let i = items.length - 1; i >= 0; i--) {
			const item = items[i];

			if (binner(item)[0] === name) {
				return item;
			}
		}
	}

	[Symbol.iterator] () {
		const snapshot = (this.items || []).slice();
		const {length} = snapshot;
		let index = 0;

		return {
			next () {
				const done = index >= length;
				const value = snapshot[index];

				index += 1;

				return {value, done};
			}
		};
	}


	map (fn) {
		this.items.map(fn);
	}
}

function getUniqueEvents (events) {
	const {unique} = events.reduce((acc, event) => {
		const id = event.getID();

		if (acc.seen[id]) { return acc; }

		return {unique: [...acc.unique, event], seen: {...acc.seen, [id]: true}};
	}, {unique: [], seen: {}});

	return unique;
}

export function insertEvent (bin, event) {
	const items = bin ? bin.items : [];

	let inserted = false;
	const newItems = [];

	const eventStart = event.getStartTime();
	const eventEnd = event.getEndTime() || eventStart;

	for (let item of items) {
		const itemStart = item.getStartTime();
		const itemEnd = item.getEndTime() || itemStart;

		//if the new events starts before the other event put it first
		if (eventStart < itemStart && !inserted) {
			inserted = true;
			newItems.push(event);
		//if the new event starts at the exact same time, but it ends before the other one
		//put it first
		} else if (eventStart === itemStart && eventEnd < itemEnd && !inserted) {
			inserted = true;
			newItems.push(event);
		}

		newItems.push(item);
	}

	//if we haven't inserted the event yet, it must be the last one for the bin
	if (!inserted) {
		newItems.push(event);
	}

	return new Bin(bin.name, getUniqueEvents(newItems), bin[BINNER]);
}


export function createBin (name, event, binner) {
	return new Bin(name, event ? [event] : [], binner);
}
