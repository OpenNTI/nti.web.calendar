import React, { useCallback, useContext, useReducer } from 'react';

import { NavigationStackContext } from '@nti/web-routing';

import { CheckIn } from './CheckIn';
import { Search as UserLookup } from './Search';
import { EntryForm } from './EntryForm';
// Lazy load
const ScanEntry = React.lazy(() => import('./ScanEntry'));

const BASIC_STATE = (state, action) => ({ ...state, ...action });

export default function View(props) {
	const { push, reset } = useContext(NavigationStackContext);
	const [{ state, item }, dispatch] = useReducer(BASIC_STATE, {
		state: 'main',
	});

	const viewMain = useCallback(() => {
		reset();
		dispatch({ state: 'main' });
	}, [reset]);

	const transition = useCallback(
		(to, item) => {
			push?.(viewMain);
			dispatch({ state: to, item });
		},
		[viewMain, push]
	);

	const viewEntry = useCallback(
		x => transition('entry-review', x),
		[transition]
	);

	const viewEntryForm = useCallback(
		() => transition('entry-form'),
		[transition]
	);

	const viewLookup = useCallback(() => transition('lookup'), [transition]);

	switch (state) {
		default:
		case 'main':
			return (
				<CheckIn
					onViewEntry={viewEntry}
					onViewEntryForm={viewEntryForm}
					onViewLookup={viewLookup}
					{...props}
				/>
			);

		case 'entry-review':
			return <EntryForm item={item} returnView={viewMain} />;

		case 'entry-form':
			return <ScanEntry {...props} />;

		case 'lookup':
			return <UserLookup {...props} />;
	}
}
