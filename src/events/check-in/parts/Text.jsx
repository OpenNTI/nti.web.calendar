import { Text } from '@nti/web-commons';

import getString from '../strings';

const defaults = tag => props => ({
	as: tag,
	getString,
	'data-testid': props.localeKey,
	...props,
});

export const Title = styled(Text.Base).attrs(defaults('h1'))`
	font-size: 22px;
	font-weight: 300;
	line-height: 30px;
	margin: 0;
	padding: 0;
	&.invert {
		letter-spacing: -0.4px;
		color: #fff;
	}
`;

export const SubTitle = styled(Text.Base).attrs(defaults())`
	font-size: 14px;
	font-weight: bold;
	letter-spacing: 0;
	line-height: 19px;
	margin: 35px 0;
`;

export const ShortHelp = styled(Text.Base).attrs(defaults())`
	font-size: 12px;
	font-weight: bold;
	letter-spacing: 0;
	line-height: 19px;
	text-transform: uppercase;
`;
