/* eslint-env jest */
import EventBinner from '../index';

import { createEvent, DATES } from './utils';

const { TODAY, TOMORROW, TWO_DAYS, THREE_DAYS } = DATES;

describe('EventBinner', () => {
	describe('by day', () => {
		const binner = new EventBinner();

		const today = createEvent('today', TODAY.date);
		const tomorrow = createEvent('tomorrow', TOMORROW.date);
		const twoDays = createEvent('two days', TWO_DAYS.date);
		const threeDays = createEvent('three days', THREE_DAYS.date);

		binner.insertEvent(threeDays);
		binner.insertEvent(tomorrow);

		binner.insertEvents([twoDays, today]);

		test('Returns the correct bins', () => {
			const bins = binner.getBins();

			expect(bins.length).toEqual(4);

			expect(bins[0].items).toEqual([today]);
			expect(bins[1].items).toEqual([tomorrow]);
			expect(bins[2].items).toEqual([twoDays]);
			expect(bins[3].items).toEqual([threeDays]);
		});

		test('getFirstEvent', () => {
			expect(binner.getFirstEvent()).toBe(today);
		});

		test('getLastEvent', () => {
			expect(binner.getLastEvent()).toBe(threeDays);
		});
	});
});
