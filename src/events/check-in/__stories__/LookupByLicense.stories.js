import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { Lookup } from '../LookupByLicense';

const Container = styled.div`
	width: 689px;
	max-width: 90vw;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Screens/Lookup By License',
	component: Lookup,
};

export function LookupByLicense() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<Lookup />
			</Suspense>
		</Container>
	);
}
