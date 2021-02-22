import { day } from '../Constants';

import byDay from './by-day';

const binners = {
	[day]: byDay,
};

export function getBinner(by) {
	return binners[by] || binners[day];
}
