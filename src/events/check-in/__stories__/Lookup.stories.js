import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { Lookup as Screen } from '../Lookup';

const Container = styled.div`
	width: 689px;
	max-width: 90vw;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Screens/Lookup',
	component: Screen,
};

export function Lookup() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<Screen />
			</Suspense>
		</Container>
	);
}
