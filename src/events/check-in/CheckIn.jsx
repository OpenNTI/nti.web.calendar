import React, { Suspense, useCallback, useEffect, useState } from 'react';

import { Search, useLink, useChanges } from '@nti/web-commons';

import {
	ActionButton,
	ActionPrompt,
	Actions,
	Action,
	Box,
	Empty,
	Loading,
	More,
	Table,
	Title,
	TitleBar,
} from './parts';
import {
	AttendanceRecordNameColumn as NameColumn,
	AttendanceRecordCheckInTimeColumn as CheckInTimeColumn,
} from './columns';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').EventAttendance} EventAttendance */

export function CheckIn({ onViewEntry, onViewLookup, event }) {
	const [search, setSearch] = useState();

	// eww...
	const [count, setCount] = useState(0);

	return (
		<Box centered flushTop>
			<ActionPrompt>
				<Title invert as="h2">
					Select an option to check in an attendee.
				</Title>
				<Actions>
					<Action onClick={onViewEntry}>
						Check-in
						<br />
						With Code
					</Action>
					<Action onClick={onViewLookup}>Lookup by Name</Action>
					<Action>
						Create a<br />
						New Account
					</Action>
				</Actions>
			</ActionPrompt>

			<TitleBar>
				<Title>Checked-In Attendees ({count})</Title>
				<Search
					className={css`
						max-width: 200px;
					`}
					delay={500}
					value={search}
					onChange={setSearch}
				/>
			</TitleBar>

			<Suspense fallback={<Loading />}>
				<Attendance
					event={event}
					search={search}
					/* The loading mask necessitates pushing the hook into this
					component, so the count has to be called out separately.
					I'm not 100% happy about this, but this seems like the cleanest
					way to accomplish this without using a Store */
					onCountUpdated={setCount}
					onItemClick={item => {
						/* fill in */
					}}
				/>
			</Suspense>
		</Box>
	);
}

function Attendance({ event, search, onCountUpdated, onItemClick }) {
	const [batchSize, setPageSize] = useState();
	/** @type {EventAttendance} (attendance) */
	const attendance = useLink(event, 'list-attendance', { search, batchSize });
	useChanges(attendance);

	// See above comment where we're passing the onCountUpdated in... not ideal,
	// but better than Store boilerplate for just a COUNT
	useEffect(() => {
		onCountUpdated?.(attendance?.total);
	}, [attendance, onCountUpdated]);

	const setMaxPageSize = () => setPageSize(attendance.total);

	const columns = [NameColumn, CheckInTimeColumn];
	if (attendance.Items?.some(x => x.hasLink('delete'))) {
		columns.push(CheckOutColumn);
	}

	return (
		<>
			{!attendance.empty ? (
				<Table
					items={attendance.Items}
					columns={columns}
					onRowClick={onItemClick}
				/>
			) : (
				<Empty>{search ? 'Not found.' : 'No Check-ins yet'}</Empty>
			)}

			{attendance.hasMore && (
				<More onClick={setMaxPageSize}>View All</More>
			)}
		</>
	);
}

const DeleteButton = styled(ActionButton).attrs({ destructive: true })`
	padding: 10px 15px !important;
	line-height: 0 !important;
`;

CheckOutColumn.cssClassName = css`
	width: 50px;
	text-align: right;
`;
function CheckOutColumn({ item }) {
	return (
		<DeleteButton
			onClick={useCallback(
				(_, finish) => {
					finish?.hide();
					return item.delete();
				},
				[item]
			)}
		>
			<i className="icon-delete" />
		</DeleteButton>
	);
}
