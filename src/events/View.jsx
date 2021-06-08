import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { isFlag } from '@nti/web-client';

import Editor from './editor/EventEditor';

const CheckIn = React.lazy(async () => import('./check-in/View'));

View.propTypes = {
	event: PropTypes.object,
	dialog: PropTypes.bool,
	controls: PropTypes.bool,
};
export function View(props) {
	const { event, controls } = props;
	const showCheckIn =
		event.hasLink('list-attendance') &&
		!controls &&
		isFlag('event-check-ins');
	const Viewer = showCheckIn ? CheckIn : Editor;
	return (
		<Suspense fallback={<div />}>
			<Viewer {...props} />
		</Suspense>
	);
}
