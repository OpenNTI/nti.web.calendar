import { Text } from '@nti/web-commons';

const defaultAs = tag => props => ({
	...props,
	as: props.as || tag,
});

export const Title = styled(Text.Base).attrs(defaultAs('h1'))`
	color: var(--primary-grey);
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
