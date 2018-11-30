const NAME = Symbol('Name');
const ITEMS = Symbol('Items');

class Bin {
	constructor (name, items = []) {
		this[NAME] = name;
		this[ITEMS] = items;
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


	return new Bin(bin.name, newItems);
}


export function createBin (name, event) {
	return new Bin(name, event ? [event] : []);
}
