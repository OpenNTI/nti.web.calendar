import React from 'react';

import { CenteredBox as BoxBase } from './parts/Containers';
import { Button } from './parts/Buttons';
import { SubTitle } from './parts/Text';
import icon from './assets/check.svg';

const Box = styled(BoxBase)`
	padding-top: 14.515%;
`;

/** @typedef {import('@nti/lib-interfaces').Models.entities.User} User */

/**
 * @param {Object} props
 * @param {User} props.user
 * @param {()=> void} props.reset
 * @param {()=> void} props.returnView
 * @returns {JSX.Element}
 */
export function Success({ user, reset, returnView }) {
	return (
		<Box>
			<img src={icon} />
			<SubTitle>{user?.realname} has been checked in.</SubTitle>
			<Button rounded onClick={reset}>
				Scan another QR code
			</Button>
			<Button inverted text onClick={returnView}>
				Return to Event Page
			</Button>
		</Box>
	);
}
