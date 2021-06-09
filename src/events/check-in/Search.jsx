import React from 'react';

import { Search as SearchInput } from '@nti/web-commons';

import { Box } from './parts';

//#region 🎨 paint

const SearchBox = styled(SearchInput.Inverted)`
	margin: 0;
`;

//#endregion

export function Search(props) {
	return (
		<Box>
			<SearchBox />
		</Box>
	);
}
