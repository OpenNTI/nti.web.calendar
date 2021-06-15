import React, { useCallback, useState } from 'react';

import { Text } from '@nti/web-commons';

import { ActionButton, Button } from './parts/Buttons';
import { Box, TitleBar } from './parts/Containers';
import { Title } from './parts/Text';

//#region 🎨 paint

const TitleArea = styled(TitleBar)`
	align-items: flex-start;
	padding: 0;
	flex-wrap: nowrap;
`;

const Image = styled.img`
	float: right;
	width: 84px;
	height: 84px;
	flex: 0 0 auto;
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

const Spacer = styled.span`
	flex: 1 1 auto;
`;

const Controls = styled.div`
	margin-top: 100px;
	display: flex;
	flex-direction: row-reverse;
	align-items: baseline;

	${Button} {
		font-size: 14px;
	}

	& > :not(${Spacer}) {
		flex: 0 0 auto;
	}
`;

//#endregion

export function EntryForm({ item, returnView }) {
	const readOnly = !!item;
	const [busy, setBusy] = useState(false);

	return (
		<Box>
			<TitleArea>
				<Title>Review and Confirm Information</Title>
				<Image />
			</TitleArea>

			<DecoratedInput
				label="Full Name"
				required
				readOnly={readOnly}
				value={item?.User?.realname}
				disabled={busy}
			/>
			<DecoratedInput
				label="License Number"
				required
				readOnly={readOnly}
				disabled={busy}
			/>
			<DecoratedInput label="UUID" readOnly={readOnly} disabled={busy} />
			<DecoratedInput
				label="Email Address"
				required
				readOnly={readOnly}
				value={item?.User?.email}
				disabled={busy}
			/>

			<Controls>
				{!readOnly && (
					<Button rounded disabled={busy}>
						Save
					</Button>
				)}
				<Button inverted text onClick={returnView} disabled={busy}>
					Cancel
				</Button>
				<Spacer />
				{item?.hasLink('delete') && (
					<ActionButton
						inverted
						destructive
						text
						onClick={useCallback(
							(_, finish) => {
								setBusy(true);
								finish?.call(returnView);
								return item.delete();
							},
							[item, returnView]
						)}
					>
						Delete Attendee
					</ActionButton>
				)}
			</Controls>
		</Box>
	);
}
