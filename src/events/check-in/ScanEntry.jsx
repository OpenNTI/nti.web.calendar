import React from 'react';

import icon from './assets/qr_icon.svg';
import { Box, SubTitle } from './parts.jsx';

//#region 🎨 paint

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
			<img width="83" height="84" src={icon} />
			<SubTitle>Scan your QR code using your reader…</SubTitle>
			<Input placeholder="Or click to manually enter" />
		</Box>
	);
}
