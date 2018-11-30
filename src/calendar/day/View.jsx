import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { DateTime } from '@nti/web-commons';

import Item from '../../events';

const t = scoped('nti.web.calendar.day', {
	empty: 'No events yet...',
	today: 'Today'
});

export default class Day extends React.Component {
	static propTypes = {
		bin: PropTypes.shape({
			name: PropTypes.string,
			items: PropTypes.array
		})
	}

	render () {
		const { bin: { name, items } } = this.props;
		const date = new Date(name);
		return (
			<div className="calendar-day">
				<div className="day-header">
					<time>{DateTime.isToday(date) ? `Today ${DateTime.format(date, 'MMMM DD')}` : DateTime.format(date, 'ddd MMMM DD')}</time>
				</div>
				<div className="day-events">
					{items.length === 0 && (
						<div className="empty-day">{t('empty')}</div>
					)}
					{items.length > 0 && (
						items.map(item =>  <Item key={item.NTIID} item={item} />)
					)}
				</div>
			</div>
		);
	}
}
