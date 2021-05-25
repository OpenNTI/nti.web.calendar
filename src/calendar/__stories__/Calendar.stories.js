import { Suspense } from 'react';

import { setupTestClient } from '@nti/web-client/test-utils';

import { Calendar } from '../index.js';

setupTestClient({
	capabilities: { canChat: true },
	getUserPreferences() {
		return {
			addListener() {},
			get() {},
		};
	},
});

export default {
	title: 'Calendar',
	component: Calendar,
};

export function Test() {
	return (
		<Suspense fallback={<div />}>
			<Calendar />
		</Suspense>
	);
}
