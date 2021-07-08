import React, { Suspense } from 'react';

import { useReducerState } from '@nti/web-commons';

import { Loading } from './parts/misc';
import { InputForm } from './LookupByLicenseInputForm';
import { Query } from './LookupByLicenseQuery';
import { EntryForm } from './EntryForm';
import { Success } from './Success';
import { ErrorBoundary } from './parts/ErrorBoundary';
import { LookupError } from './LookupByLicenseError';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').BaseEvent} Event */
/** @typedef {() => void} Handler */
/**
 * @typedef {{
 * 	event: Event,
 *  returnView: Handler
 * }} LookupProps
 */

//react.lazy only supports default exports...so make one
export default Lookup;

/**
 * @param {LookupProps} props
 * @returns {JSX.Element}
 */
export function Lookup({ event, returnView }) {
	const [{ state, query, user }, dispatch, reset] = useReducerState({
		state: 'input',
		query: null,
		user: null,
	});

	switch (state) {
		case 'input':
			return (
				<InputForm
					onLookup={query => dispatch({ query, state: 'query' })}
				/>
			);

		case 'query':
			return (
				<ErrorBoundary
					fallback={<LookupError reset={reset} query={query} />}
				>
					<Suspense fallback={<Loading />}>
						<Query
							event={event}
							query={query}
							onResolve={user =>
								dispatch({ state: 'resolved', user })
							}
							onReset={reset}
						/>
					</Suspense>
				</ErrorBoundary>
			);

		case 'resolved':
			return (
				<EntryForm
					item={user}
					onSave={async () => {
						await event.recordAttendance(user);
						dispatch({ state: 'success' });
					}}
					returnView={reset}
				/>
			);

		case 'success':
			return (
				<Success user={user} reset={reset} returnView={returnView} />
			);
	}

	// shouldn't get here
	return <>{state}</>;
}
