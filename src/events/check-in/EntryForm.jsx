import React from 'react';

import { Button as ButtonBase, Text } from '@nti/web-commons';

import { Title } from './parts';

//#region 🎨 paint

const Box = styled.div`
	background: white;
`;

const TitleArea = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
`;

const Required = styled('span').attrs({ children: '*' })`
	color: var(--primary-red);
`;

const Legend = styled(Text.Label).attrs({ as: 'legend' })`
	color: var(--tertiary-grey);
`;

const FieldSet = styled.fieldset`
	border: 0;
	padding: 0;
	margin: 0 0 20px 0;

	& > legend {
		padding-bottom: 10px;
	}

	& > input {
		width: 100%;
		border: 2px solid var(--quad-grey);
		font-size: 14px;
		font-weight: 600;
		line-height: 19px;
		border-radius: 3px;
		padding: 4px 8px;
	}
`;

function DecoratedInput({ className, required, label, ...props }) {
	return (
		<FieldSet className={className}>
			<Legend>
				{label}
				{required && <Required />}
			</Legend>
			<input className={className} required={required} {...props} />
		</FieldSet>
	);
}

const Button = styled(ButtonBase)`
	padding: 17px 42px;

	&&&.text {
		padding: 17px 21px;
		border: 0;
		background: none;
		box-shadow: none;
	}
`;

const Spacer = styled.span`
	flex: 1 1 auto;
`;
const Controls = styled.div`
	margin-top: 100px;
	display: flex;
	flex-direction: row-reverse;

	& > :not(${Spacer}) {
		flex: 0 0 auto;
	}
`;

//#endregion

export function EntryForm(props) {
	return (
		<Box>
			<TitleArea>
				<Title>Review and Confirm Information</Title>
				<img width="84" height="84" />
			</TitleArea>

			<DecoratedInput label="Full Name" required />
			<DecoratedInput label="License Number" required />
			<DecoratedInput label="UUID" />
			<DecoratedInput label="Email Address" required />
			<Controls>
				<Button rounded>Save</Button>
				<Button inverted text>
					Cancel
				</Button>
				<Spacer />
				<Button inverted destructive text>
					Delete Attendee
				</Button>
			</Controls>
		</Box>
	);
}
