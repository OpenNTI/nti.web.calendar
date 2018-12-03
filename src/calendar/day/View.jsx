import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { DateTime } from '@nti/web-commons';

import Item from '../../events';
import Editor from '../../events/editor/EventEditor';

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

	state = {}

	onItemClick = (item) => {
		if(item.hasLink('edit')) {
			this.setState({
				showEditor: true,
				event: item
			});
		}
	}

	render () {
		const { showEditor, event } = this.state;
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
						items.map(item =>  <Item key={item.NTIID} item={item} onItemClick={this.onItemClick}/>)
					)}
				</div>
				{showEditor && (
					<Editor
						event={event}
						onCancel={() => this.setState({showEditor: false})}
						onSuccess={() => this.setState({showEditor: false})}
					/>
				)}
			</div>
		);
	}
}
