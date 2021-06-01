import { Suspense } from 'react';

import { setupTestClient } from '@nti/web-client/test-utils';

import { EntryForm } from '../EntryForm';

const Container = styled.div`
	width: 689px;
	margin: 10px auto;
`;

setupTestClient({});

export default {
	title: 'Check-in/Entry Form',
	component: EntryForm,
};

export function Main() {
	return (
		<Container>
			<Suspense fallback={<div />}>
				<EntryForm />
			</Suspense>
		</Container>
	);
}
