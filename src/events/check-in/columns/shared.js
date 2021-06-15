import React from 'react';

import { Text } from '@nti/web-commons';

/** @typedef {import('@nti/lib-interfaces').Models.entities.User} User */
/** @typedef {import('@nti/lib-interfaces').Models.calendar.EventAttendanceRecord} EventAttendanceRecord */

export const SearchContext = React.createContext();

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

export const Flex = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

export const TableCellText = styled(Text.Base)`
	color: var(--primary-grey);
	font-size: 10px;
	line-height: 1.4;
`;
