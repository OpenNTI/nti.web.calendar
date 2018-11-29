/* eslint-env jest */
import {createEvent, DATES} from '../../__test__/utils';
import byDay from '../by-day';

describe('byDay binning tests', () => {
	test('events with no end date return only the start date\'s bin', () => {
		const getBins = (date) => byDay(createEvent('no end', date));

		const dates = Object.values(DATES);

		for (let date of dates) {
			const bins = getBins(date.date);

			expect(bins.length).toBe(1);
			expect(bins[0]).toBe(date.key);
		}
	});

	describe('Events with an end date return the range of bins', () => {
		const {TODAY, TOMORROW, TWO_DAYS, THREE_DAYS} = DATES;
		const getBins = (start, end) => byDay(createEvent('start and end', start, end));

		test('Today > Today', () => {
			const bins = getBins(TODAY.date, TODAY.date);

			expect(bins).toEqual([TODAY.key]);
		});

		test('TODAY > TOMORROW', () => {
			const bins = getBins(TODAY.date, TOMORROW.date);

			expect(bins).toEqual([TODAY.key, TOMORROW.key]);
		});

		test('TODAY > TWO DAYS', () => {
			const bins = getBins(TODAY.date, TWO_DAYS.date);

			expect(bins).toEqual([TODAY.key, TOMORROW.key, TWO_DAYS.key]);
		});

		test('TODAY > THREE DAYS', () => {
			const bins = getBins(TODAY.date, THREE_DAYS.date);

			expect(bins).toEqual([TODAY.key, TOMORROW.key, TWO_DAYS.key, THREE_DAYS.key]);
		});
	});
});
