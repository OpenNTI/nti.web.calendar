import React, { Suspense, useCallback, useEffect, useState } from 'react';

import { Search, useLink, useChanges } from '@nti/web-commons';

import { ActionPrompt, Actions, Action } from './parts/Hero';
import { Box, TitleBar } from './parts/Containers';
import { Empty, Loading } from './parts/misc';
import { More } from './parts/Buttons';
import { Table } from './parts/Table';
import { Title } from './parts/Text';
import { AttendanceRecordNameColumn as NameColumn } from './columns/AttendanceRecordNameColumn';
import { AttendanceRecordCheckInTimeColumn as CheckInTimeColumn } from './columns/AttendanceRecordCheckInTimeColumn';
// import { AttendanceDeleteColumn } from './columns/AttendanceDeleteColumn';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').EventAttendance} EventAttendance */

export function CheckIn({ onViewEntry, onViewEntryForm, onViewLookup, event }) {
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
					<Action onClick={onViewEntryForm}>
						Scan or
						<br />
						Enter Code
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
						@media (--respond-to-handhelds) {
							max-width: unset;
						}
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
					onItemClick={onViewEntry}
				/>
			</Suspense>
		</Box>
	);
}

function Attendance({ event, search, onCountUpdated, onItemClick }) {
	const [batchSize, setPageSize] = useState();
	const [reload, setReloadNonce] = useState();

	/** @type {EventAttendance} (attendance) */
	const attendance = useLink(event, 'list-attendance', {
		reload,
		search,
		batchSize,
	});

	useChanges(
		attendance,
		useCallback((forceUpdate, ...whatChanged) => {
			if (whatChanged.some(x => x === Symbol.for('DELETED'))) {
				setReloadNonce({});
			}
		}, [])
	);

	// See above comment where we're passing the onCountUpdated in... not ideal,
	// but better than Store boilerplate for just a COUNT
	useEffect(() => {
		onCountUpdated?.(attendance?.total);
	}, [attendance, onCountUpdated]);

	const setMaxPageSize = () => setPageSize(attendance.total);

	const columns = [NameColumn, CheckInTimeColumn];
	// if (attendance.Items?.some(x => x.hasLink('delete'))) {
	// 	columns.push(AttendanceDeleteColumn);
	// }

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
