import React, { useEffect } from 'react';

import { useLink } from '@nti/web-commons';

import { CenteredBox as Box } from './parts/Containers';
import { Empty } from './parts/misc';
import { Button } from './parts/Buttons';

/** @typedef {import('@nti/lib-interfaces/src/models/entities/User').default} User */

export function Query({ event, query, onResolve, onReset }) {
	/** @type {User[]} */
	const users = useLink(
		event,
		`lookup-by-license-number/${encodeURIComponent(query)}`
	);

	const user = users?.[0];

	useEffect(() => user && onResolve(user), [user]);

	return user ? null : (
		<Box>
			<Empty localeKey="lookup-by-license.not-found" with={{ query }} />
			<Button
				inverted
				text
				onClick={onReset}
				localeKey="lookup-by-license.retry"
			/>
		</Box>
	);
}