import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { CheckIn } from '../CheckIn';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Screens/Main',
	component: CheckIn,
};

export function Main() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<CheckIn />
			</Suspense>
		</Container>
	);
}
