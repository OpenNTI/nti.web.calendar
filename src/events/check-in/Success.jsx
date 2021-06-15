import React from 'react';

import { CenteredBox as BoxBase } from './parts/Containers';
import { Button } from './parts/Buttons';
import { SubTitle } from './parts/Text';
import icon from './assets/check.svg';

const Box = styled(BoxBase)`
	padding-top: 14.515%;
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
