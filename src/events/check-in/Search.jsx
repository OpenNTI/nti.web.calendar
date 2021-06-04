import React from 'react';

import { Search as SearchInput } from '@nti/web-commons';

//#region 🎨 paint

const Box = styled.div`
	background: white;
	padding: 34px 30px;
`;

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
