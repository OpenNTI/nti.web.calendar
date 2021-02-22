const NAME = Symbol('Name');
const ITEMS = Symbol('Items');
const BINNER = Symbol('Binner');
const TODAY = Symbol('Today');

class Bin {
	constructor(name, items = [], binner, today) {
		this[NAME] = name;
		this[ITEMS] = items;
		this[BINNER] = binner;
		this[TODAY] = today;
	}

	get name() {
		return this[NAME];
	}

	get items() {
		return this[ITEMS];
	}

	get start() {
		const first = this.items[0];

		return first ? first.getStartTime() : null;
	}

	get end() {
		const end = this.items[this.items.length - 1];

		return end ? end.getEndTime() || end.getStartTime() : null;
	}

	get phantom() {
		const { items, name } = this;
		const binner = this[BINNER];
		const bin = new Date(name);
		const today = new Date(this[TODAY]);
		const isPast = bin < today;
		const getBinToCheck = bins =>
			isPast ? bins[bins.length - 1] : bins[0];

		if (name === this[TODAY]) {
			return false;
		}

		return !items.some(item => getBinToCheck(binner(item)) === name);
	}

	getBinsFor(item) {
		return this[BINNER](item);
	}

	getFirstRealEvent() {
		const { items, name } = this;
		const binner = this[BINNER];

		for (let item of items) {
			if (binner(item)[0] === name) {
				return item;
			}
		}
	}

	getLastRealEvent() {
		const { items, name } = this;
		const binner = this[BINNER];

		for (let i = items.length - 1; i >= 0; i--) {
			const item = items[i];

			if (binner(item)[0] === name) {
				return item;
			}
		}
	}

	async updateItem(item) {
		if (!item) {
			return;
		}

		const requests = this[ITEMS].map(x => {
			if (x.getUniqueIdentifier() === item.getUniqueIdentifier()) {
				return x.refresh();
			} else {
				return Promise.resolve(x);
			}
		});

		this[ITEMS] = await Promise.all(requests);
	}

	removeItem(item) {
		if (!item) {
			return;
		}

		this[ITEMS] = this[ITEMS].filter(
			x => x.getUniqueIdentifier() !== item.getUniqueIdentifier()
		);
	}

	[Symbol.iterator]() {
		const snapshot = (this.items || []).slice();
		const { length } = snapshot;
		let index = 0;

		return {
			next() {
				const done = index >= length;
				const value = snapshot[index];

				index += 1;

				return { value, done };
			},
		};
	}

	map(fn) {
		this.items.map(fn);
	}
}

function getUniqueEvents(events) {
	const { unique } = events.reduce(
		(acc, event) => {
			const id =
				(event.getUniqueIdentifier && event.getUniqueIdentifier()) ||
				event.getID();

			if (acc.seen[id]) {
				return acc;
			}

			return {
				unique: [...acc.unique, event],
				seen: { ...acc.seen, [id]: true },
			};
		},
		{ unique: [], seen: {} }
	);

	return unique;
}

export function insertEvent(bin, event) {
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
		} else if (
			eventStart === itemStart &&
			eventEnd < itemEnd &&
			!inserted
		) {
			inserted = true;
			newItems.push(event);
		}

		newItems.push(item);
	}

	//if we haven't inserted the event yet, it must be the last one for the bin
	if (!inserted) {
		newItems.push(event);
	}

	return new Bin(
		bin.name,
		getUniqueEvents(newItems),
		bin[BINNER],
		bin[TODAY]
	);
}

export function createBin(name, event, binner, today) {
	return new Bin(name, event ? [event] : [], binner, today);
}
