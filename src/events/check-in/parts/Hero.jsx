import React from 'react';

import { Text } from '@nti/web-commons';

import getString from '../strings';

export const ActionPrompt = styled.div`
	min-height: 166px;
	margin: 0 calc(var(--padding-inset) * -1);
	background: linear-gradient(180deg, #52c2f6 0%, #2f3176 100%);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	@media (--respond-to-handhelds) {
		padding: 10px 0;
	}
`;

function ActionsMapper({ children, ...props }) {
	const count = React.Children.toArray(children).filter(Boolean).length;
	// hacks... design wants the button padding / size to change if there
	// is only one in the container... so... hack this into the existence.
	return {
		...props,
		children: React.Children.map(
			children,
			child =>
				child &&
				React.cloneElement(child, {
					bunch: count > 1,
				})
		),
	};
}

export const Actions = styled('div').attrs(ActionsMapper)`
	margin-top: 27px;
	min-height: 48px;
	display: flex;
	flex-direction: row;
	align-items: stretch;
	justify-content: center;
	flex-wrap: wrap;
	width: 100%;
`;

function ActionMapper(props) {
	return {
		as: 'button',
		getString,
		'data-testid': props.localeKey,
		...props,
	};
}

export const Action = styled(Text.Base).attrs(ActionMapper)`
	flex: 0 0 auto;
	border: 0;
	font-size: 12px;
	line-height: 16px;
	border-radius: 3.75px;
	background: #fff;
	box-shadow: 0 2px 24px 0 #30397c;
	cursor: pointer;
	padding: 16px 32px;
	margin: 10px;
	color: inherit;
	min-height: 48px;

	&.bunch {
		padding: initial;
		width: 113px;
	}
`;
