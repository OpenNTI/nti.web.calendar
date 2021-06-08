import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { ScanEntry } from '../ScanEntry';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Screens/Scanning',
	component: ScanEntry,
};

export function Scanning() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<ScanEntry />
			</Suspense>
		</Container>
	);
}
