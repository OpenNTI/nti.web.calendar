import { Suspense } from 'react';

import { setupTestClient } from '@nti/web-client/test-utils';

import { ScanEntry } from '../ScanEntry';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

setupTestClient({});

export default {
	title: 'Check-in/Scan Entry',
	component: ScanEntry,
};

export function Main() {
	return (
		<Container>
			<Suspense fallback={<div />}>
				<ScanEntry />
			</Suspense>
		</Container>
	);
}
