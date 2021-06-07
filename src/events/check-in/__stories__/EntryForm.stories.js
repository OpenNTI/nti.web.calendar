import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { EntryForm } from '../EntryForm';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Entry Form',
	component: EntryForm,
};

export function Main() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<EntryForm />
			</Suspense>
		</Container>
	);
}
