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

View.defaultProps = {
	controls: true,
};

export function View(props) {
	const { event, dialog, editable } = props;

	const [details, toggle] = useToggle();

	const hasCheckIn =
		isFlag('event-check-ins') && event.hasLink('list-attendance');

	const showCheckIn = hasCheckIn && !dialog && !editable && !details;

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
