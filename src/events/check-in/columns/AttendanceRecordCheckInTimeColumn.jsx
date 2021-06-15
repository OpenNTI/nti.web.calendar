import cx from 'classnames';

import { DateTime } from '@nti/web-commons';

import { TableCell, TableCellText } from './shared';

/** @typedef {import('./shared').EventAttendanceRecord} EventAttendanceRecord */

/**
 * @param {Object} props
 * @param {EventAttendanceRecord} props.item
 * @returns {JSX.Element}
 */
export function AttendanceRecordCheckInTimeColumn({ item }) {
	/** @type {EventAttendanceRecord} (item) */
	return (
		<>
			<DateTime
				as={TableCellText}
				date={item.getRegistrationTime()}
				format={DateTime.TIME}
			/>
		</>
	);
}
AttendanceRecordCheckInTimeColumn.Name = 'Check-in Time';
AttendanceRecordCheckInTimeColumn.SortKey = 'registrationTime';
AttendanceRecordCheckInTimeColumn.cssClassName = cx(
	TableCell,
	css`
		width: 225px;
	`
);
