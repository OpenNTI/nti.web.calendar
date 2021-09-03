import React, { Suspense, useCallback, useState } from 'react';

import { Search as SearchInput } from '@nti/web-commons';
import { useLink } from '@nti/web-core';

import { Box } from './parts/Containers';
import { ErrorBoundary } from './parts/ErrorBoundary';
import { Empty, Loading } from './parts/misc';
import { Table } from './parts/Table';
import { CheckInNameColumn } from './columns/CheckInNameColumn';
import { CheckInColumn, CheckInAction } from './columns/CheckInButtonColumn';
import { SearchContext } from './columns/shared';
import getString from './strings';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').EventUserSearchHit} EventUserSearchHit */
/** @typedef {import('@nti/lib-interfaces/src/models/calendar').BaseEvent} CalendarEvent */
/** @typedef {import('@nti/lib-interfaces/src/models/entities').User} User */

//#region 🎨 paint

const SearchBox = styled(SearchInput.Inverted)`
	margin: 0;
	max-width: 90%;
`;

//#endregion

/**
 *
 * @param {object} props
 * @param {CalendarEvent} props.event
 * @returns {JSX.Element}
 */
export function Lookup({ event }) {
	const [search, setSearch] = useState();
	const [error, setError] = useState();

	const action = useCallback(
		/**
		 * @param {EventUserSearchHit} record
		 * @returns {void}
		 */
		async record => {
			try {
				setError(null);
				await event.recordAttendance(record.User);
			} catch (e) {
				if (e.code === 'DuplicateEntry') {
					return;
				}
				setError({ record, message: e.message });
				throw e;
			}
		},
		[event, setError]
	);

	action.error = error;

	return (
		<Box>
			<SearchBox
				placeholder={getString('search-placeholder-text')}
				delay={500}
				value={search}
				onChange={setSearch}
				autoFocus
			/>
			<CheckInAction.Provider value={action}>
				<ErrorBoundary
					fallback={<Empty localeKey="connection-error" />}
				>
					<Suspense fallback={<Loading />}>
						{search && search.length > 2 && (
							<SearchResults event={event} term={search} />
						)}
					</Suspense>
				</ErrorBoundary>
			</CheckInAction.Provider>
		</Box>
	);
}

function SearchResults({ event, term }) {
	/** @type {User[]} */
	const users = useLink(
		event,
		`search-possible-attendees/${encodeURIComponent(term)}`
	);

	const empty = !users?.length;

	return !empty ? (
		<SearchContext.Provider value={term}>
			<Table
				items={users}
				columns={[CheckInNameColumn, CheckInColumn]}
				capped
				headless
				term={term}
			/>
		</SearchContext.Provider>
	) : (
		<Empty localeKey="not-found" />
	);
}
