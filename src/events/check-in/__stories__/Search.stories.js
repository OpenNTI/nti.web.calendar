import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { Search as Screen } from '../Search';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Screens/Search',
	component: Screen,
};

export function Search() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<Screen />
			</Suspense>
		</Container>
	);
}
