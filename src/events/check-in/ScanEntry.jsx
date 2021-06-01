import React from 'react';

import { Text } from '@nti/web-commons';

//#region 🎨 paint

const Box = styled.div`
	background: white;
	padding: 21.74% 0 0;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Instruction = styled(Text.Base)`
	color: var(--primary-grey);
	font-size: 14px;
	font-weight: bold;
	letter-spacing: 0;
	line-height: 19px;
	margin: 37px 0;
`;

const Input = styled('input').attrs({})`
	border: 0;
	padding: 4px 0;
	text-align: center;
	color: var(--primary-grey);
	border-bottom: 1px solid var(--primary-blue);
	font-size: 14px;
	line-height: 19px;
	width: 180px;

	&::placeholder {
		color: var(--tertiary-grey);
	}
`;

//#endregion

export function ScanEntry(props) {
	return (
		<Box>
			<img width="84" height="84" />
			<Instruction>Scan your QR code using your reader…</Instruction>
			<Input placeholder="Or click to manually enter" />
		</Box>
	);
}
