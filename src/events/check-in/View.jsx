import React, { useCallback, useReducer } from 'react';

import { useNavigationStackContext } from '@nti/web-routing';

import { CheckIn } from './CheckIn';
import { Lookup as UserLookup } from './Lookup';
import { EntryForm } from './EntryForm';
// Lazy load
const LookupByLicense = React.lazy(() => import('./LookupByLicense'));

const BASIC_STATE = (state, action) => ({ ...state, ...action });

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').BaseEvent} Event */
/** @typedef {() => void} Handler */
/**
 * @typedef {{
 * 	event: Event
 * }} ViewProps
 */

/**
 * @param {ViewProps} props
 * @returns {JSX.Element}
 */
export default function View(props) {
	const { push, reset } = useNavigationStackContext();
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

	const viewLookupByLicense = useCallback(
		() => transition('lookup-by-license'),
		[transition]
	);

	const viewLookup = useCallback(() => transition('lookup'), [transition]);

	switch (state) {
		default:
		case 'main':
			return (
				<CheckIn
					onViewEntry={viewEntry}
					onViewLookup={viewLookup}
					onViewLookupByLicense={viewLookupByLicense}
					{...props}
				/>
			);

		case 'entry-review':
			return <EntryForm item={item} returnView={viewMain} />;

		case 'lookup-by-license':
			return <LookupByLicense {...props} returnView={viewMain} />;

		case 'lookup':
			return <UserLookup {...props} returnView={viewMain} />;
	}
}
