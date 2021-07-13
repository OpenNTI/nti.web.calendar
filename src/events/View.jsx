import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';

import { isFlag } from '@nti/web-client';
import { useToggle } from '@nti/web-commons';

import { Editor } from './editor/Editor';

const CheckIn = React.lazy(() => import('./check-in/View'));

View.propTypes = {
	event: PropTypes.object,
	dialog: PropTypes.bool,
	controls: PropTypes.bool,
	editable: PropTypes.bool,
};
export function View(props) {
	const { event, controls, dialog, editable } = props;
	const [details, toggle] = useToggle();
	const showCheckIn =
		event.hasLink('list-attendance') &&
		!controls &&
		!dialog &&
		!editable &&
		!details &&
		isFlag('event-check-ins');

	useEffect(() => {
		event.on('show-details', toggle);
		return () => event?.off('show-details', toggle);
	}, [event, toggle]);

	const Viewer = showCheckIn ? CheckIn : Editor;
	return (
		<Suspense fallback={<div />}>
			<Viewer {...props} />
		</Suspense>
	);
}
