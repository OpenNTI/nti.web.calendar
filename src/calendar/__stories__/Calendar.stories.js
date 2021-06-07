import { Suspense } from 'react';

import { useRealService } from '@nti/web-client/storybook-utils';

import { Calendar } from '../index.js';

export default {
	title: 'Panels/Calendar',
	component: Calendar,
};

export function Test() {
	useRealService();
	return (
		<Suspense fallback={<div />}>
			<Calendar />
		</Suspense>
	);
}
