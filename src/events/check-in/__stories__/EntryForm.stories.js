import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { EntryForm } from '../EntryForm';

const Container = styled.div`
	width: 689px;
	max-width: 90vw;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Screens/Form',
	component: EntryForm,
};

export function Form() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<EntryForm />
			</Suspense>
		</Container>
	);
}
