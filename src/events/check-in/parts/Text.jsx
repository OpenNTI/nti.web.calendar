import { Text } from '@nti/web-commons';

import getString from '../strings';

const defaultAs = tag => props => ({
	getString,
	...props,
	as: props.as || tag,
});

export const Title = styled(Text.Base).attrs(defaultAs('h1'))`
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

export const SubTitle = styled(Text.Base).attrs({ getString })`
	font-size: 14px;
	font-weight: bold;
	letter-spacing: 0;
	line-height: 19px;
	margin: 35px 0;
`;