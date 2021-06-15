import React, { useContext } from 'react';

import { Text } from '@nti/web-commons';

import { CheckInAction } from './CheckInButtonColumn';
import { NameColumn } from './NameColumn';

const ErrorText = styled(Text.Base).attrs({ as: 'div' })`
	color: var(--primary-red);
	line-height: 1.1 !important;
	font-size: 10px;
	margin-left: 10px;
`;

CheckInNameColumn.cssClassName = NameColumn.cssClassName;
export function CheckInNameColumn({ item, ...props }) {
	const { error } = useContext(CheckInAction);
	return NameColumn({
		...props,
		item,
		avatar: true,
		additional: (
			<>
				{error?.user === item && <ErrorText>{error.message}</ErrorText>}
			</>
		),
	});
}
