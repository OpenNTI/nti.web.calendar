export function createEvent(id, start, end) {
	return {
		id,
		title: id,
		getID: () => id,
		getStartTime: () => start,
		getEndTime: () => end,
	};
}

export const DATES = {
	TODAY: {
		date: new Date('December 30, 2018'),
		key: '2018/12/30 13:00',
	},
	TOMORROW: {
		date: new Date('December 31, 2018'),
		key: '2018/12/31 13:00',
	},
	TWO_DAYS: {
		date: new Date('January 1, 2019'),
		key: '2019/1/1 13:00',
	},
	THREE_DAYS: {
		date: new Date('January 2, 2019'),
		key: '2019/1/2 13:00',
	},
};
