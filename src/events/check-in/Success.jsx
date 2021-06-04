import React from 'react';

import { Box as BoxBase, Button, SubTitle } from './parts';
import icon from './assets/check.svg';

const Box = styled(BoxBase)`
	padding: 14.515% 0 0;
`;

export function Success(props) {
	return (
		<Box>
			<img src={icon} />
			<SubTitle>Reginia Mccrimmon has been checked in.</SubTitle>
			<Button rounded>Scan another QR code</Button>
			<Button inverted text>
				Return to Event Page
			</Button>
		</Box>
	);
}
