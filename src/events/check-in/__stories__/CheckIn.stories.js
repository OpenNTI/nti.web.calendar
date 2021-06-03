import { Suspense } from 'react';

import { setupTestClient } from '@nti/web-client/test-utils';

import { CheckIn } from '../CheckIn';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

setupTestClient({});

export default {
	title: 'Check-in',
	component: CheckIn,
};

export function Main() {
	return (
		<Container>
			<Suspense fallback={<div />}>
				<CheckIn />
			</Suspense>
		</Container>
	);
}