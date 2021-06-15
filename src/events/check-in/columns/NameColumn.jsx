import { useContext } from 'react';

import { DisplayName } from '@nti/web-commons';

import { Flex, SearchContext, TableCell, TableCellText } from './shared';
import { AvatarColumn } from './AvatarColumn';

/** @typedef {import('./shared').User} User */

/**
 * @param {Object} props
 * @param {boolean} [props.avatar=true]
 * @param {User} props.item
 * @param {JSX.Element} props.additional
 * @returns {JSX.Element}
 */
export function NameColumn({ item, avatar = true, additional }) {
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
				{item.email}
			</TableCellText>
			{additional}
		</Flex>
	);
}
NameColumn.Name = 'Name';
NameColumn.SortKey = 'Name';
NameColumn.cssClassName = TableCell;
//#endregion
