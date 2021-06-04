import { Suspense } from 'react';

import { setupTestClient } from '@nti/web-client/test-utils';

import { Success } from '../Success';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

setupTestClient({});

export default {
	title: 'Check-in/Success',
	component: Success,
};

export function Main() {
	return (
		<Container>
			<Suspense fallback={<div />}>
				<Success />
			</Suspense>
		</Container>
	);
}
