import React from 'react';

import { Table, Text, Search } from '@nti/web-commons';

//#region 🎨 paint

const defaultAs = tag => props => ({
	...props,
	as: props.as || tag,
});

const Box = styled.div`
	padding: 0 35px;
`;

const ActionPrompt = styled.div`
	min-height: 166px;
	margin: 0 -35px;
	background: linear-gradient(180deg, #52c2f6 0%, #2f3176 100%);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Title = styled(Text.Base).attrs(defaultAs('h1'))`
	color: var(--primary-grey);
	font-size: 22px;
	font-weight: 300;
	line-height: 30px;
	margin: 0;
	padding: 0;
	&.invert {
		letter-spacing: -0.4px;
		color: #fff;
	}
`;

const Actions = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 27px;
	height: 48px;
	width: 75%;
`;

const Action = styled(Text.Base).attrs({ as: 'button' })`
	flex: 0 0 113px;
	border: 0;
	font-size: 12px;
	line-height: 16px;
	border-radius: 3.75px;
	background: #fff;
	box-shadow: 0 2px 24px 0 #30397c;
`;

const TitleBar = styled.div`
	display: flex;
	flex-direction: row;
	align-items: baseline;
	justify-content: space-between;
	margin: 18px 21px 18px 0;
`;

//#endregion

export function CheckIn(props) {
	return (
		<Box>
			<ActionPrompt>
				<Title invert as="h2">
					Select an option to check in an attendee.
				</Title>
				<Actions>
					<Action>Scan a QR code</Action>
					<Action>
						Manually Enter
						<br />
						Licence Number
					</Action>
					<Action>Lookup by Name</Action>
					<Action>
						Create a<br />
						New Account
					</Action>
				</Actions>
			</ActionPrompt>

			<TitleBar>
				<Title>Checked-In Attendees (27)</Title>
				<Search
					className={css`
						max-width: 200px;
					`}
				/>
			</TitleBar>

			<Table.Panel
				items={[1, 2, 3]}
				columns={[NameColumn, CheckInTimeColumn]}
			/>
		</Box>
	);
}

NameColumn.Name = 'Name';
NameColumn.SortKey = 'Name';
function NameColumn({ item }) {
	return <>{item}</>;
}

CheckInTimeColumn.Name = 'Check-in Time';
CheckInTimeColumn.SortKey = 'CheckInTime';
function CheckInTimeColumn({ item }) {
	return <>{item}</>;
}
