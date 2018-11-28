import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { DateTime } from '@nti/web-commons';

const t = scoped('nti.web.calendar.day', {
	empty: 'No events yet...',
	today: 'Today'
});


export default class Day extends React.Component {
	static propTypes = {
		date: PropTypes.instanceOf(Date),
		events: PropTypes.array
	}

	render () {
		const { events = [], date } = this.props;

		return (
			<div className="calendar-day">
				<div className="day-header">
					<time>{DateTime.isToday(date) ? `Today ${DateTime.format(date, 'MMMM DD')}` : DateTime.format(date, 'ddd MMMM DD')}</time>
				</div>
				<div className="day-events">
					{events.length === 0 && (
						<div className="empty-day">{t('empty')}</div>
					)}
				</div>
			</div>
		);
	}
}
