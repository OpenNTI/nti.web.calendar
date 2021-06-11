import React, { Suspense, useState } from 'react';

import { Loading, Search as SearchInput, useLink } from '@nti/web-commons';

import { Box, Table } from './parts';
import {
	AvatarColumn,
	NameColumn,
	CheckInColumn,
	SearchContext,
} from './columns';

/** @typedef {import('@nti/lib-interfaces/src/models/entities').User} User */

//#region 🎨 paint

const SearchBox = styled(SearchInput.Inverted)`
	margin: 0;
`;

//#endregion

export function Search(props) {
	const [search, setSearch] = useState();

	return (
		<Box>
			<SearchBox delay={500} value={search} onChange={setSearch} />
			<Suspense fallback={<Loading.Spinner />}>
				{search && <SearchResults {...props} term={search} />}
			</Suspense>
		</Box>
	);
}

function SearchResults({ event, term }) {
	/** @type {User[]} */
	const users = useLink(
		event,
		`search-possible-attendees/${encodeURIComponent(term)}`
	);

	return (
		<SearchContext.Provider value={term}>
			<Table
				items={users}
				columns={[AvatarColumn, NameColumn, CheckInColumn]}
				capped
				term={term}
			/>
		</SearchContext.Provider>
	);
}
