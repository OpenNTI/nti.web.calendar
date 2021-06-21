import React, { Suspense, useCallback, useState } from 'react';

import { Search as SearchInput, useLink } from '@nti/web-commons';

import { Box } from './parts/Containers';
import { Empty, Loading } from './parts/misc';
import { Table } from './parts/Table';
import { CheckInNameColumn } from './columns/CheckInNameColumn';
import { CheckInColumn, CheckInAction } from './columns/CheckInButtonColumn';
import { SearchContext } from './columns/shared';
import getString from './strings';

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
		async user => {
			try {
				setError(null);
				await event.recordAttendance(user);
			} catch (e) {
				setError({ user, message: e.message });
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
				<Suspense fallback={<Loading />}>
					{search && search.length > 2 && (
						<SearchResults event={event} term={search} />
					)}
				</Suspense>
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
