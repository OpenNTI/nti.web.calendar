import cx from 'classnames';

import { DateTime } from '@nti/web-commons';

import getString from '../strings';

import { TableCell, TableCellText } from './shared';

/** @typedef {import('./shared').EventAttendanceRecord} EventAttendanceRecord */

/**
 * @param {Object} props
 * @param {EventAttendanceRecord} props.item
 * @returns {JSX.Element}
 */
export function AttendanceRecordCheckInTimeColumn({ item }) {
	/** @type {EventAttendanceRecord} (item) */
	return !item?.getRegistrationTime ? null : (
		<>
			<DateTime
				as={TableCellText}
				date={item.getRegistrationTime()}
				format={DateTime.TIME}
			/>
		</>
	);
}
AttendanceRecordCheckInTimeColumn.Name = () =>
	getString('columns.check-in-time');
AttendanceRecordCheckInTimeColumn.SortKey = 'registrationTime';
AttendanceRecordCheckInTimeColumn.cssClassName = cx(
	TableCell,
	css`
		width: 225px;
	`
);
