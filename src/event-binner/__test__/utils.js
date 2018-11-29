export function createEvent (id, start, end) {
	return {
		id,
		title: id,
		getStartDate: () => start,
		getEndDate: () => end
	};
}


export const DATES = {
	TODAY: {
		date: new Date('December 30, 2018'),
		key: '2018-12-30'
	},
	TOMORROW: {
		date: new Date('December 31, 2018'),
		key: '2018-12-31'
	},
	TWO_DAYS: {
		date: new Date('January 1, 2019'),
		key: '2019-1-1'
	},
	THREE_DAYS: {
		date: new Date('January 2, 2019'),
		key: '2019-1-2'
	}
};
