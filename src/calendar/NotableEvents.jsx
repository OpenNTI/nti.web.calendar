import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';

import EventList from './EventList';
import Store from './NotableEventsStore';

const bindings = {};
function getBinding(limit) {
	// reuse same object to avoid unneccessary store reloads
	if (!bindings[limit]) {
		bindings[limit] = { limit };
	}
	return bindings[limit];
}

class NotableEvents extends React.Component {
	static deriveBindingFromProps = ({ limit = 5 } = {}) => getBinding(limit);

	static propTypes = {
		bins: PropTypes.array,
		calendars: PropTypes.array,
		limit: PropTypes.number,
		loading: PropTypes.bool,
		error: PropTypes.object,
		children: PropTypes.any,
	};

	render() {
		return <EventList {...this.props} />;
	}
}

export default decorate(NotableEvents, [
	Store.connect(['bins', 'loading', 'error', 'calendars']),
]);
