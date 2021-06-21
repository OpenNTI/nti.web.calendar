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
			<SubTitle localeKey="success-screen.check-in-success" with={user} />
			<Button
				rounded
				onClick={reset}
				hidden={!reset}
				localeKey="success-screen.scan-another-code"
			/>
			<Button
				inverted
				text
				onClick={returnView}
				localeKey="success-screen.return-to-main"
			/>
		</Box>
	);
}
