import { Suspense } from 'react';

import { useMockService } from '@nti/web-client/storybook-utils';

import { Lookup as Screen } from '../Lookup';
import { CheckInAction, CheckInColumn } from '../columns/CheckInButtonColumn';

const Container = styled.div`
	width: 689px;
	max-width: 90vw;
	margin: 10px auto;
`;

export default {
	title: 'Check-in/Screens/Lookup',
	component: Screen,
};

const Mock = {
	getID: () => 'mock',
	recordAttendance: async () => {},
	getLink: (rel, params) => rel + JSON.stringify(params),
	fetchLink: () =>
		[1, 2, 3, 4].map((x, i) => ({
			Class: 'EventUserSearchHit',
			MimeType: 'application/vnd.nextthought.calendar.eventusersearchhit',
			User: {
				getID: () => i,
				Username: 'Foobar' + x,
				displayName: 'Foobar ' + x,
				initials: 'F' + i,
				email: `blackhole+${x}@nowhere.io`,
				LicenseNumber: '0000000' + i,
			},
		})),
};

export function Lookup() {
	useMockService();
	return (
		<Container>
			<Suspense fallback={<div />}>
				<Screen event={Mock} />
			</Suspense>
		</Container>
	);
}

export function CheckInButton() {
	const check = () => {};
	return (
		<CheckInAction.Provider value={check}>
			<CheckInColumn
				item={{
					getID() {
						return 'test';
					},
				}}
			/>
		</CheckInAction.Provider>
	);
}
