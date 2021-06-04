import { Suspense } from 'react';

import { setupTestClient } from '@nti/web-client/test-utils';

import { Search } from '../Search';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

setupTestClient({});

export default {
	title: 'Check-in/Search',
	component: Search,
};

export function Main() {
	return (
		<Container>
			<Suspense fallback={<div />}>
				<Search />
			</Suspense>
		</Container>
	);
}
