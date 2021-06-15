import { useCallback } from 'react';

import { ActionButton } from '../parts/Buttons';

/** @typedef {import('./shared').EventAttendanceRecord} EventAttendanceRecord */

const DeleteButton = styled(ActionButton).attrs({ destructive: true })`
	padding: 10px 15px !important;
	line-height: 0 !important;
`;

AttendanceDeleteColumn.cssClassName = css`
	width: 50px;
	text-align: right;
	flex: 0 0 100% !important;
`;

/**
 * @param {Object} props
 * @param {EventAttendanceRecord} props.item
 * @returns {JSX.Element}
 */
export function AttendanceDeleteColumn({ item }) {
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
