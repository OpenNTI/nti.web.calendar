import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';

import EventList from './EventList';
import Store from './CalendarEventsStore';

class CalendarEvents extends React.Component {
	static deriveBindingFromProps = ({ calendar }) => ({ calendar });

	static propTypes = {
		calendar: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				getID: PropTypes.func.isRequired,
			}).isRequired,
		]),

		// store props
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

export default decorate(CalendarEvents, [
	Store.connect(['bins', 'loading', 'error', 'calendars']),
]);
