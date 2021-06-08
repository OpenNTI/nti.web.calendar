import { Suspense } from 'react';

import { useRealService } from '@nti/web-client/storybook-utils';

import { Calendar as Panel } from '../index.js';

export default {
	title: 'Panels/Calendar',
	component: Panel,
};

export function Calendar() {
	useRealService();
	return (
		<Suspense fallback={<div />}>
			<Panel />
		</Suspense>
	);
}
