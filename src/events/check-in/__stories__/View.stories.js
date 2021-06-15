import React, { Suspense } from 'react';

import { useRealService } from '@nti/web-client/storybook-utils';
import { NTObject } from '@nti/web-commons';

import CheckIn from '../View';

stylesheet`
	body {
		padding: 0 !important;
	}
`;

const Container = styled.div`
	width: 689px;
	max-width: 90vw;
	margin: 10px auto;
`;

export default {
	title: 'Check-in',
	component: CheckIn,
};

export function View() {
	useRealService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<NTObject
					id="tag:nextthought.com,2011-10:jonathan-OID-0x0a43d4:5573657273:b81qKjze9Yj"
					prop="event"
				>
					<CheckIn />
				</NTObject>
			</Suspense>
		</Container>
	);
}
