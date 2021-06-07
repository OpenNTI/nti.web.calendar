import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { Search } from '../Search';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Search',
	component: Search,
};

export function Main() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<Search />
			</Suspense>
		</Container>
	);
}
