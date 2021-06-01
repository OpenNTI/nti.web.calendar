import { Suspense } from 'react';

import { setupTestClient } from '@nti/web-client/test-utils';

import { Calendar } from '../index.js';

setupTestClient({
	getCollection() {},
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
