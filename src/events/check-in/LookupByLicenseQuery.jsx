import { useEffect } from 'react';

import { useLink } from '@nti/web-core';

import { LookupError } from './LookupByLicenseError.jsx';

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
		<LookupError
			error={{ statusCode: 404 }}
			query={query}
			reset={onReset}
		/>
	);
}
