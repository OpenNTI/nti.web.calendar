/* eslint-env jest */
import EventGrouper from '../index';

import { createEvent, DATES } from './utils';

const { TODAY, TOMORROW, TWO_DAYS, THREE_DAYS } = DATES;

describe('EventGrouper', () => {
	describe('by day', () => {
		const grouper = new EventGrouper();

		const today = createEvent('today', TODAY.date);
		const tomorrow = createEvent('tomorrow', TOMORROW.date);
		const twoDays = createEvent('two days', TWO_DAYS.date);
		const threeDays = createEvent('three days', THREE_DAYS.date);

		grouper.insertEvent(threeDays);
		grouper.insertEvent(tomorrow);

		grouper.insertEvents([twoDays, today]);

		test('Returns the correct bins', () => {
			const bins = grouper.getBins();

			expect(bins.length).toEqual(4);

			expect(bins[0].items).toEqual([today]);
			expect(bins[1].items).toEqual([tomorrow]);
			expect(bins[2].items).toEqual([twoDays]);
			expect(bins[3].items).toEqual([threeDays]);
		});

		test('getFirstEvent', () => {
			expect(grouper.getFirstEvent()).toBe(today);
		});

		test('getLastEvent', () => {
			expect(grouper.getLastEvent()).toBe(threeDays);
		});
	});
});
