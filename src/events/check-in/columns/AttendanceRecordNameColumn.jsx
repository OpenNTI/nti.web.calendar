import { NameColumn } from './NameColumn';
import { TableCell } from './shared';

/** @typedef {import('./shared').EventAttendanceRecord} EventAttendanceRecord */

/**
 * @param {Object} props
 * @param {EventAttendanceRecord} props.item
 * @returns {JSX.Element}
 */
export function AttendanceRecordNameColumn({ item, ...props }) {
	/** @type {EventAttendanceRecord} (item) */
	return NameColumn({ avatar: false, item: item.User, ...props });
}
AttendanceRecordNameColumn.Name = 'Name';
AttendanceRecordNameColumn.SortKey = 'Name';
AttendanceRecordNameColumn.cssClassName = TableCell;
