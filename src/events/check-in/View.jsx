import React from 'react';

import { useNavigationStackContext } from '@nti/web-routing';
import { useReducerState } from '@nti/web-core';

import { CheckIn } from './CheckIn';
import { Lookup as UserLookup } from './Lookup';
import { EntryForm } from './EntryForm';
// Lazy load
const LookupByLicense = React.lazy(() => import('./LookupByLicense'));
const CheckInNewUser = React.lazy(() => import('./CheckInNewUser'));
const BulkUpload = React.lazy(() => import('./bulk-upload/BulkUpload'));

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
	const [{ state, item }, dispatch] = useReducerState({
		state: 'main',
	});

	// These handlers aren't wrapped in useCallback because
	// 	) they get recreated every time anyways.
	// 	) this level renders once per transition.

	const viewMain = () => (reset(), dispatch({ state: 'main' }));
	const transition = (to, item) => (
		push?.(viewMain), dispatch({ state: to, item })
	);
	const viewEntry = x => transition('entry-review', x);
	const viewLookup = () => transition('lookup');

	//#region DEQ Stuffs:
	const viewLookupByLicense = () => transition('lookup-by-license');
	const viewCheckInNewUser = () => transition('check-in-new-user');
	const viewBulkUpload = () => transition('bulk-attendance-upload');
	//#endregion

	switch (state) {
		default:
		case 'main':
			return (
				<CheckIn
					onViewEntry={viewEntry}
					onViewLookup={viewLookup}
					onViewLookupByLicense={viewLookupByLicense}
					onViewCheckInNewUser={viewCheckInNewUser}
					onViewBulkUpload={viewBulkUpload}
					{...props}
				/>
			);

		case 'entry-review':
			return (
				<EntryForm
					event={props.event}
					item={item}
					returnView={viewMain}
				/>
			);

		case 'lookup':
			return <UserLookup {...props} returnView={viewMain} />;

		//#region DEQ Stuffs:
		case 'lookup-by-license':
			return <LookupByLicense {...props} returnView={viewMain} />;

		case 'check-in-new-user':
			return <CheckInNewUser {...props} returnView={viewMain} />;

		case 'bulk-attendance-upload':
			return <BulkUpload {...props} returnView={viewMain} />;
		//#endregion
	}
}
