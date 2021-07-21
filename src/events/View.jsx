import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';

import { isFlag } from '@nti/web-client';
import { useToggle } from '@nti/web-commons';
import { Router } from '@nti/web-routing';

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
	dialog: true,
};

/*
TODO: Refactor into discrete Frames, Viewer, and Editor
The structure of this is a mess.
The viewer is all three: viewer, editor, AND frame. Each mode conflicting with one another on
what they expect when used in various contexts.

The solution is to extract each "mode" and their containers to be independent components.
I've started the process, but preserved the original structures. The complex class is now
exploded into small parts, that need further exploding to isolate the "view" mode bits from
the "editor" mode bits. The containers and layout parts should be shareable. However, there
needs to be discrete entry for "view" and "edit" with the option of using any "Frame" needed
but whatever context we throw at it.
*/

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
		<Router.Context>
			<Suspense fallback={<div />}>
				<Viewer {...props} />
			</Suspense>
		</Router.Context>
	);
}
