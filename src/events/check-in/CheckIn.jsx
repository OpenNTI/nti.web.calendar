import React, { Suspense, useCallback, useEffect, useState } from 'react';

import { Search, useLink, useChanges } from '@nti/web-commons';

import { ActionPrompt, Actions, Action } from './parts/Hero';
import { Box, TitleBar, Group } from './parts/Containers';
import { Empty, Loading } from './parts/misc';
import { More, DownloadLink } from './parts/Buttons';
import { Table } from './parts/Table';
import { Title } from './parts/Text';
import { AttendanceRecordNameColumn as NameColumn } from './columns/AttendanceRecordNameColumn';
import { AttendanceRecordCheckInTimeColumn as CheckInTimeColumn } from './columns/AttendanceRecordCheckInTimeColumn';
// import { AttendanceDeleteColumn } from './columns/AttendanceDeleteColumn';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').EventAttendance} EventAttendance */
/** @typedef {import('@nti/lib-interfaces/src/models/calendar').BaseEvent} Event */
/** @typedef {() => void} Handler */
/** @typedef {(x: number) => void} NumberHandler */
/** @typedef {(item: EventAttendance) => void} ItemHandler */
/**
 * @typedef {{
 * 	onViewEntry: ItemHandler,
 * 	onViewLookup: Handler,
 * 	onViewLookupByLicense: Handler,
 * 	onViewCheckInNewUser: Handler,
 * 	event: Event
 * }} CheckInProps
 */

/**
 * @param {CheckInProps} props
 * @returns {JSX.Element}
 */
export function CheckIn({ onViewEntry, event, ...handlers }) {
	const [search, setSearch] = useState();

	// eww...
	const [count, setCount] = useState(0);

	return (
		<Box centered flushTop>
			<Heading {...handlers} event={event} />

			<TitleBar>
				<Title>Checked-In Attendees ({count})</Title>
				<Group>
					<Search
						square
						className={css`
							flex: 1 1 auto;
							max-width: 200px;
							@media (--respond-to-handhelds) {
								max-width: unset;
							}
						`}
						delay={500}
						value={search}
						onChange={setSearch}
					/>
					<DownloadLink
						href={event.getLink('export-attendance')}
						download="export-attendance.csv"
					/>
				</Group>
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

/**
 *
 * @param {Object} props
 * @param {Event} props.event
 * @param {NumberHandler} props.onCountUpdated
 * @param {ItemHandler} props.onItemClick
 * @param {string} props.search
 * @returns {JSX.Element}
 */
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

/**
 * @param {CheckInProps} props
 * @returns {JSX.Element}
 */
function Heading({
	event,
	onViewLookup,
	onViewLookupByLicense,
	onViewCheckInNewUser,
}) {
	const showLookupByLicense = event?.hasLink('lookup-by-license-number');
	const showCheckInNewUser = event?.hasLink('checkin-new-user');

	return (
		<ActionPrompt>
			<Title invert as="h2">
				Select an option to check in an attendee.
			</Title>
			<Actions>
				{showLookupByLicense && (
					<Action onClick={onViewLookupByLicense}>
						Scan or
						<br />
						Enter Code
					</Action>
				)}
				<Action onClick={onViewLookup}>Lookup by Name</Action>
				{showCheckInNewUser && (
					<Action onClick={onViewCheckInNewUser}>
						Create a<br />
						New Account
					</Action>
				)}
			</Actions>
		</ActionPrompt>
	);
}
