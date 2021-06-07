import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { ScanEntry } from '../ScanEntry';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Scan Entry',
	component: ScanEntry,
};

export function Main() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<ScanEntry />
			</Suspense>
		</Container>
	);
}
