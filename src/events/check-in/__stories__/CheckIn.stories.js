import React, { Suspense } from 'react';

import { NTObject } from '@nti/web-core';
import { useMockService } from '@nti/web-client/storybook-utils';

import { CheckIn } from '../CheckIn';

import event from './event.json';

const Mock = {
	async getObjectRaw(id) {
		switch (id) {
			case 'tag:nextthought.com,2011-10:jonathan-OID-0x0a43d4:5573657273:b81qKjze9Yj':
				return event;
		}
	},
};

const Container = styled.div`
	width: 689px;
	max-width: 90vw;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Screens/Main',
	component: CheckIn,
};

export function Main() {
	useMockService(Mock);
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
