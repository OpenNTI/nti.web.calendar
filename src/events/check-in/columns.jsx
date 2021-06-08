import React from 'react';

import { DateTime, DisplayName, Text } from '@nti/web-commons';

export const TableCell = css`
	padding: 4px;
	text-align: left;

	td& {
		cursor: pointer;
		font-size: 0;
		line-height: 0;
		height: 44px;
		border-top: 1px solid var(--border-grey-light);
	}
`;

export const TableCellText = styled(Text.Base)`
	color: var(--primary-grey);
	font-size: 10px;
	line-height: 1.4;
`;

NameColumn.Name = 'Name';
NameColumn.SortKey = 'Name';
NameColumn.cssClassName = TableCell;
export function NameColumn({ item }) {
	return (
		<TableCellText>
			<DisplayName entity={item.User} />
			<br />
			1234567890
		</TableCellText>
	);
}
CheckInTimeColumn.Name = 'Check-in Time';
CheckInTimeColumn.SortKey = 'registrationTime';
CheckInTimeColumn.cssClassName = TableCell;
export function CheckInTimeColumn({ item }) {
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
