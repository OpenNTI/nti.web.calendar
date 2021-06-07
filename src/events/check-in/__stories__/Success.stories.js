import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { Success } from '../Success';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Success',
	component: Success,
};

export function Main() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<Success />
			</Suspense>
		</Container>
	);
}
