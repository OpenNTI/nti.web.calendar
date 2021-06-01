import { day } from '../Constants';

import byDay from './by-day';

const groupers = {
	[day]: byDay,
};

export function getGrouper(by) {
	return groupers[by] || groupers[day];
}
