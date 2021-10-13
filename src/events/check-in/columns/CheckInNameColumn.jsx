import { useContext } from 'react';

import { Text } from '@nti/web-commons';

import { CheckInAction } from './CheckInButtonColumn';
import { NameColumn } from './NameColumn';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').EventUserSearchHit} EventUserSearchHit */

const ErrorText = styled(Text.Base).attrs({ as: 'div' })`
	color: var(--primary-red);
	line-height: 1.1 !important;
	font-size: 10px;
	margin-left: 10px;
`;

CheckInNameColumn.cssClassName = NameColumn.cssClassName;

/**
 * @param {Object} props
 * @param {EventUserSearchHit} props.item
 * @returns {JSX.Element}
 */
export function CheckInNameColumn({ item, ...props }) {
	const { error } = useContext(CheckInAction);
	return NameColumn({
		...props,
		item: item.User,
		avatar: true,
		additional: (
			<>
				{error?.record === item && (
					<ErrorText>{error.message}</ErrorText>
				)}
			</>
		),
	});
}
