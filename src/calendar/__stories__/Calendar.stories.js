import { Suspense } from 'react';

import { setupTestClient } from '@nti/web-client/test-utils';

import { Calendar } from '../index.js';

setupTestClient({
	getBatch() {
		return {
			Items: [],
		};
	},
	getCollection(name) {
		// 'Calendars'
		// 'AdminCalendars'
		return {
			getLink() {},
		};
	},
});

export default {
	title: 'Panels/Calendar',
	component: Calendar,
};

export function Test() {
	return (
		<Suspense fallback={<div />}>
			<Calendar />
		</Suspense>
	);
}
