/* eslint-env jest */
import { createBin, insertEvent } from '../Bin';

import { createEvent, DATES } from './utils';

const { TODAY, TOMORROW, TWO_DAYS, THREE_DAYS } = DATES;

describe('Event Bin Tests', () => {
	test('createBin has correct name and items', () => {
		const name = 'test';
		const event = createEvent('event', TODAY.date);
		const bin = createBin(name, event);

		expect(bin.name).toEqual(name);
		expect(bin.items).toEqual([event]);
	});

	test('insertEvent inserts in the correct position, and returns a new instance of the Bin', () => {
		const name = 'test bin';
		const todayEventSingleDay = createEvent('today', TODAY.date);
		const todayEventMultiDayA = createEvent(
			'today multi day a',
			TODAY.date,
			TOMORROW.date
		);
		const todayEventMultiDayB = createEvent(
			'today multi day b',
			TODAY.date,
			TWO_DAYS.date
		);
		const tomorrowEvent = createEvent('tomorrow', TOMORROW.date);
		const tomorrowEventMultiDay = createEvent(
			'tomorrow multi day',
			TOMORROW.date,
			THREE_DAYS.date
		);

		const bin = createBin(name, todayEventSingleDay);

		const bin2 = insertEvent(bin, tomorrowEventMultiDay);
		expect(bin2).not.toBe(bin);
		expect(bin2.name).toBe(name);
		expect(bin2.items).toEqual([
			todayEventSingleDay,
			tomorrowEventMultiDay,
		]);

		const bin3 = insertEvent(bin2, todayEventMultiDayB);
		expect(bin3).not.toBe(bin2);
		expect(bin3.name).toBe(name);
		expect(bin3.items).toEqual([
			todayEventSingleDay,
			todayEventMultiDayB,
			tomorrowEventMultiDay,
		]);

		const bin4 = insertEvent(bin3, tomorrowEvent);
		expect(bin4).not.toBe(bin3);
		expect(bin4.name).toBe(name);
		expect(bin4.items).toEqual([
			todayEventSingleDay,
			todayEventMultiDayB,
			tomorrowEvent,
			tomorrowEventMultiDay,
		]);

		const bin5 = insertEvent(bin4, todayEventMultiDayA);
		expect(bin5).not.toBe(bin4);
		expect(bin5.name).toBe(name);
		expect(bin5.items).toEqual([
			todayEventSingleDay,
			todayEventMultiDayA,
			todayEventMultiDayB,
			tomorrowEvent,
			tomorrowEventMultiDay,
		]);
	});

	test('insertEvent removes duplicate events', () => {
		const firstEvent = createEvent('first', TODAY.date);
		const secondEvent = createEvent('second', TOMORROW.date);

		let bin = createBin('test', firstEvent);

		bin = insertEvent(bin, secondEvent);
		bin = insertEvent(bin, firstEvent);

		expect(bin.items).toEqual([firstEvent, secondEvent]);
	});

	describe('start', () => {
		test('is null if no events', () => {
			const bin = createBin('no events');

			expect(bin.start).toBeNull();
		});

		test('is the first events start', () => {
			let bin = createBin(
				'hasEvents',
				createEvent('tomorrow', TOMORROW.date)
			);

			bin = insertEvent(bin, createEvent('today', TODAY.date));

			expect(bin.start).toEqual(TODAY.date);
		});
	});

	describe('end', () => {
		test('is null if no events', () => {
			const bin = createBin('no events');

			expect(bin.end).toBeNull();
		});

		test('if the last event has an end date', () => {
			const bin = createBin(
				'has end date',
				createEvent('event', TODAY.date, TOMORROW.date)
			);

			expect(bin.end).toEqual(TOMORROW.date);
		});

		test('if the last event does not have an end date', () => {
			let bin = createBin(
				'has start date',
				createEvent('event', TODAY.date, TOMORROW.date)
			);

			bin = insertEvent(bin, createEvent('end', TWO_DAYS.date));

			expect(bin.end).toEqual(TWO_DAYS.date);
		});
	});

	test('iterator goes through all items', () => {
		const events = [
			createEvent('today', TODAY.date),
			createEvent('tomorrow', TOMORROW.date),
			createEvent('two days', TWO_DAYS.date),
		];

		let bin = createBin('event');

		for (let e of events) {
			bin = insertEvent(bin, e);
		}

		let seen = [];

		for (let e of bin) {
			seen.push(e);
		}

		expect(seen).toEqual(events);
	});
});
