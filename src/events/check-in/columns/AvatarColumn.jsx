import { Avatar } from '@nti/web-commons';

import { Flex } from './shared';

/** @typedef {import('./shared').User} User */

/**
 * @param {Object} props
 * @param {User} props.item
 * @returns {JSX.Element}
 */
export const AvatarColumn = styled(Flex).attrs(AvatarColumnMapper)`
	width: 48px;
	justify-content: center;
	flex: 0 0 auto;

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
