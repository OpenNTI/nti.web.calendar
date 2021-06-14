import React, { useContext } from 'react';
import cx from 'classnames';

import { Avatar, DateTime, DisplayName, Text } from '@nti/web-commons';

/** @typedef {import('@nti/lib-interfaces').Models.entities.User} User */
/** @typedef {import('@nti/lib-interfaces').Models.calendar.EventAttendanceRecord} EventAttendanceRecord */

export const SearchContext = React.createContext();

//#region 🎨 paint
export const TableCell = css`
	padding: 4px;
	text-align: left;

	mark {
		background: none;
		font-weight: bold;
	}

	td& {
		cursor: pointer;
		font-size: 0;
		line-height: 0;
		height: 44px;
	}
`;

const Flex = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

export const TableCellText = styled(Text.Base)`
	color: var(--primary-grey);
	font-size: 10px;
	line-height: 1.4;
`;
//#endregion

//#region Avatar Column
/**
 * @param {Object} props
 * @param {User} props.item
 * @returns {JSX.Element}
 */
export const AvatarColumn = styled(Flex).attrs(AvatarColumnMapper)`
	width: 48px;
	justify-content: center;

	> * {
		max-width: 28px;
	}
`;

/**
 * @param {Object} props
 * @param {User} props.item
 * @returns {typeof props}
 */
function AvatarColumnMapper({ item, ...props }) {
	return {
		...props,
		children: <Avatar entity={item} rounded />,
	};
}
//#endregion

//#region Name Column
/**
 * @param {Object} props
 * @param {boolean} [props.avatar=true]
 * @param {User} props.item
 * @returns {JSX.Element}
 */
export function NameColumn({ item, avatar = true }) {
	const term = useContext(SearchContext);
	return (
		<Flex
			className={
				avatar &&
				css`
					margin-left: -4px;
				`
			}
		>
			{avatar && <AvatarColumn item={item} />}
			<TableCellText>
				<DisplayName entity={item} mark={term} />
				<br />
				1234567890
			</TableCellText>
		</Flex>
	);
}
NameColumn.Name = 'Name';
NameColumn.SortKey = 'Name';
NameColumn.cssClassName = TableCell;
//#endregion

//#region Attendance Record Name Column
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
//#endregion

//#region Attendance Record Check in time Column
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
//#endregion
