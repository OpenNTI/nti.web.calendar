import React from 'react';

import { Icons } from '@nti/web-commons';
import { AsyncAction, Button as ButtonBase } from '@nti/web-core';

import t from '../strings';

const localeFilter = ({ children, localeKey, with: localeData, ...P }) => ({
	children: (localeKey && t(localeKey, localeData)) || children,
	'data-testid': localeKey,
	...P,
});
localeFilter.compose = f => p => f(localeFilter(p));

export const Button = styled(ButtonBase, { allowAs: true }).attrs(localeFilter)`
	padding: 14px 42px 13px;
	font-size: 12px;
	line-height: 16px;

	&&&.text {
		padding-left: 21px;
		padding-right: 21px;
		border: 0;
		background: none;
		box-shadow: none;
	}

	td & {
		padding: 10px 22px 9px;
	}
`;

const ActionButtonMapper = props => ({
	rounded: true,
	as: Button,
	...localeFilter(props),
});
export const ActionButton = styled(AsyncAction).attrs(ActionButtonMapper)`
	transition: all 0.5s ease-in;

	&:global(.finished) {
		background: transparent;
		color: var(--primary-blue);
	}
`;

//#region More Button
const MoreChildrenPropMap = ({ children, ...props }) => ({
	...props,
	plain: true,
	children: <span>{children}</span>,
});

export const More = styled(Button).attrs(
	localeFilter.compose(MoreChildrenPropMap)
)`
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

//#region Download Button
const DownloadLinkMapper = props => ({
	hidden: !props.href,
	children: <Icons.Download />,
	'data-testid': 'download',
	...props,
});
export const DownloadLink = styled('a').attrs(DownloadLinkMapper)`
	--square-size: 38px;

	color: var(--tertiary-grey);
	background: var(--panel-background);
	box-shadow: 0 0 0 1px var(--border-grey-light-alt);
	width: var(--square-size);
	line-height: var(--square-size);
	height: var(--square-size);
	cursor: pointer;

	&:focus,
	&:active,
	&:hover {
		color: var(--secondary-grey);
	}
`;
//#endregion
