import {
	Button as ButtonBase,
	Table as TableSpec,
	Text,
} from '@nti/web-commons';

//#region Containers

export const Box = styled.div`
	--padding-inset: 30px;

	background: white;
	color: var(--primary-grey);
	overflow: hidden;
	padding: 35px var(--padding-inset);
	position: relative;

	&.flush-top {
		padding-top: 0;
	}
`;

export const CenteredBox = styled(Box)`
	padding-top: 21.74%;
	padding-left: 0;
	padding-right: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const TitleBar = styled.div`
	display: flex;
	flex-direction: row;
	align-items: baseline;
	justify-content: space-between;
	margin: 18px 21px 18px 0;
`;

//#endregion

const defaultAs = tag => props => ({
	...props,
	as: props.as || tag,
});

//#region Text

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

export const SubTitle = styled(Text.Base)`
	font-size: 14px;
	font-weight: bold;
	letter-spacing: 0;
	line-height: 19px;
	margin: 35px 0;
`;

//#endregion

//#region Buttons
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

//#region More Button
const MoreChildrenPropMap = ({ children, ...props }) => ({
	...props,
	plain: true,
	children: <span>{children}</span>,
});

export const More = styled(Button).attrs(MoreChildrenPropMap)`
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 35px;
	min-width: 110px;
	border: 1px solid var(--button-border);
	border-radius: 17.5px;
	background-color: #fff;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.07);
	font-size: 10px;
	color: var(--primary-grey);
	cursor: pointer;
	margin: 0 auto 15px;

	& > span {
		position: relative;

		&::before,
		&::after {
			content: '';
			position: absolute;
			opacity: 0.33;
			width: 0;
			height: 0;
			border-left: 3px solid transparent;
			border-right: 3px solid transparent;
			border-top: 4px solid #000;
			top: 0;
		}

		&::before {
			left: 0;
			transform: translate(-15px, 5px);
		}

		&::after {
			right: 0;
			transform: translate(15px, 5px);
		}
	}
`;

//#endregion More Button
//#endregion Buttons

//#region Table

export const Table = styled(TableSpec.Panel)`
	margin: 25px 0 18px;

	th:global(.nti-table-simple-header) div {
		color: inherit;
	}

	thead > tr > th {
		color: var(--primary-grey);
	}

	tbody > tr > td {
		border-top: 1px solid var(--border-grey-light);
	}

	&.capped {
		tbody > tr:last-child > td {
			border-bottom: 1px solid var(--border-grey-light);
		}
	}

	& tr:hover td {
		background: var(--table-row-highlight);
	}
`;

export const Empty = styled(SubTitle)`
	color: var(--tertiary-grey);
	display: block;
	text-align: center;
`;

//#endregion

//#region Hero Block

export const ActionPrompt = styled.div`
	min-height: 166px;
	margin: 0 calc(var(--padding-inset) * -1);
	background: linear-gradient(180deg, #52c2f6 0%, #2f3176 100%);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const Actions = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 27px;
	height: 48px;
	width: 75%;
`;

export const Action = styled(Text.Base).attrs({ as: 'button' })`
	flex: 0 0 113px;
	border: 0;
	font-size: 12px;
	line-height: 16px;
	border-radius: 3.75px;
	background: #fff;
	box-shadow: 0 2px 24px 0 #30397c;
	cursor: pointer;
`;

//#endregion
