import React, { Suspense, useCallback, useContext, useState } from 'react';

import { Search as SearchInput, useLink } from '@nti/web-commons';

import { ActionButton, Box, Empty, Loading, Table } from './parts';
import { NameColumn, SearchContext } from './columns';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').BaseEvent} CalendarEvent */
/** @typedef {import('@nti/lib-interfaces/src/models/entities').User} User */

const CheckInAction = React.createContext();

//#region 🎨 paint

const SearchBox = styled(SearchInput.Inverted)`
	margin: 0;
`;

//#endregion

/**
 *
 * @param {object} props
 * @param {CalendarEvent} props.event
 * @returns {JSX.Element}
 */
export function Search({ event }) {
	const [search, setSearch] = useState();

	const action = useCallback(
		async user => {
			await event.recordAttendance(user);
		},
		[event]
	);

	return (
		<Box>
			<SearchBox
				placeholder="Search..."
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
				columns={[NameColumn, CheckInColumn]}
				capped
				headless
				term={term}
			/>
		</SearchContext.Provider>
	) : (
		<Empty>Not Found</Empty>
	);
}

CheckInColumn.cssClassName = css`
	width: 150px;
	text-align: right;
`;
function CheckInColumn({ item }) {
	const action = useContext(CheckInAction);
	const callback = useCallback(
		(_, finish) => {
			finish?.hide();
			return action(item);
		},
		[item, action]
	);
	return (
		<ActionButton key={item.getID()} onClick={callback}>
			Check In
		</ActionButton>
	);
}
