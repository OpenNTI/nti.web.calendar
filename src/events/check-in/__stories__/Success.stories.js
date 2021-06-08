import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { Success as Screen } from '../Success';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Screens/Success',
	component: Screen,
};

export function Success() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<Screen />
			</Suspense>
		</Container>
	);
}
