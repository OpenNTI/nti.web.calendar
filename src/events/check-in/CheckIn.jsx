import React, { useCallback, useReducer } from 'react';

import { Table, Text, Search, Button } from '@nti/web-commons';

import { Title } from './parts';
import { NameColumn, CheckInTimeColumn } from './columns';
import { ScanEntry } from './ScanEntry';
import { Search as UserLookup } from './Search';

const BASIC_STATE = (state, action) => ({ ...state, ...action });

//#region 🎨 paint

const Box = styled.div`
	background: white;
	padding: 0 35px;
	text-align: center;
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
	cursor: pointer;
`;

const TitleBar = styled.div`
	display: flex;
	flex-direction: row;
	align-items: baseline;
	justify-content: space-between;
	margin: 18px 21px 18px 0;
`;

const Attendance = styled(Table.Panel)`
	margin: 0 0 18px;

	& tr:hover td {
		background: var(--table-row-highlight);
	}
`;

const MoreChildrenPropMap = ({ children, ...props }) => ({
	...props,
	plain: true,
	children: <span>{children}</span>,
});

const More = styled(Button).attrs(MoreChildrenPropMap)`
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 35px;
	min-width: 110px;
	border: 1px solid var(--button-border);
	border-radius: 17.5px;
	background-color: #fff;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.07);
	font-size: 10px;
	color: var(--primary-grey);
	cursor: pointer;
	margin: 0 auto 15px;

	& > span {
		position: relative;

		&::before,
		&::after {
			content: '';
			position: absolute;
			opacity: 0.33;
			width: 0;
			height: 0;
			border-left: 3px solid transparent;
			border-right: 3px solid transparent;
			border-top: 4px solid #000;
			top: 0;
		}

		&::before {
			left: 0;
			transform: translate(-15px, 5px);
		}

		&::after {
			right: 0;
			transform: translate(15px, 5px);
		}
	}
`;

//#endregion

export function CheckIn(props) {
	const [{ state }, dispatch] = useReducer(BASIC_STATE, { state: 'main' });
	const viewMain = useCallback(() => dispatch({ state: 'main' }), []);
	const viewEntry = useCallback(() => dispatch({ state: 'entry' }), []);
	const viewLookup = useCallback(() => dispatch({ state: 'lookup' }), []);

	switch (state) {
		default:
		case 'main':
			return <Main onViewEntry={viewEntry} onViewLookup={viewLookup} />;

		case 'entry':
			return <ScanEntry onClose={viewMain} />;

		case 'lookup':
			return <UserLookup onClose={viewMain} />;
	}
}

function Main({ onViewEntry, onViewLookup }) {
	return (
		<Box>
			<ActionPrompt>
				<Title invert as="h2">
					Select an option to check in an attendee.
				</Title>
				<Actions>
					<Action onClick={onViewEntry}>Check With Code</Action>
					<Action onClick={onViewLookup}>Lookup by Name</Action>
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

			<Attendance
				items={Array.from({ length: 5 }).map(fakeEventAttendance)}
				columns={[NameColumn, CheckInTimeColumn]}
				onRowClick={item => {
					/* fill in */
				}}
			/>

			<More>View All</More>
		</Box>
	);
}

function fakeEventAttendance(_, n) {
	const date = new Date();
	return {
		User: {
			displayName: 'User ' + (n + 1),
		},
		getRegistrationTime() {
			return date;
		},
	};
}
