import { Button as ButtonBase, Text } from '@nti/web-commons';

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

export const SubTitle = styled(Text.Base)`
	color: var(--primary-grey);
	font-size: 14px;
	font-weight: bold;
	letter-spacing: 0;
	line-height: 19px;
	margin: 37px 0;
`;

export const Box = styled.div`
	position: relative;
	background: white;
	padding: 21.74% 0 0;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const Button = styled(ButtonBase)`
	padding: 14px 42px;
	font-size: 12px;
	line-height: 16px;

	&&&.text {
		padding-left: 21px;
		padding-right: 21px;
		border: 0;
		background: none;
		box-shadow: none;
	}
`;
