import React, { useCallback, useContext, useReducer } from 'react';

import { NavigationStackContext } from '@nti/web-routing';

import { CheckIn } from './CheckIn';
import { Search as UserLookup } from './Search';
// Lazy load
const ScanEntry = React.lazy(
	async () => (await import('./ScanEntry')).ScanEntry
);

const BASIC_STATE = (state, action) => ({ ...state, ...action });

export default function View(props) {
	const { push } = useContext(NavigationStackContext);
	const [{ state }, dispatch] = useReducer(BASIC_STATE, { state: 'main' });
	const viewMain = useCallback(() => dispatch({ state: 'main' }), []);
	const transition = useCallback(
		to => {
			push?.(viewMain);
			dispatch({ state: to });
		},
		[viewMain, push]
	);

	const viewEntry = useCallback(() => transition('entry'), [transition]);
	const viewLookup = useCallback(() => transition('lookup'), [transition]);

	switch (state) {
		default:
		case 'main':
			return (
				<CheckIn
					onViewEntry={viewEntry}
					onViewLookup={viewLookup}
					{...props}
				/>
			);

		case 'entry':
			return <ScanEntry onClose={viewMain} {...props} />;

		case 'lookup':
			return <UserLookup onClose={viewMain} {...props} />;
	}
}
