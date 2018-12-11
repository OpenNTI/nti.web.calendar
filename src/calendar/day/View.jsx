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
		}),
		calendars: PropTypes.array,
		setRef: PropTypes.func
	}

	state = {}

	onItemClick = (item) => {
		this.setState({
			showEditor: true,
			event: item
		});
	}

	render () {
		const { showEditor, event } = this.state;
		const { bin, bin: { name, items }, calendars, setRef } = this.props;
		const date = new Date(name);
		const today = new Date();
		const year = today.getFullYear();

		return (
			<div ref={setRef} className="calendar-day">
				<div className="day-header">
					<time>{DateTime.isToday(date) ? `Today ${DateTime.format(date, 'MMMM DD')}` : DateTime.format(date, `ddd MMMM DD  ${date.getFullYear() !== year ? ', YYYY' : ''}`)}</time>
				</div>
				<div className="day-events">
					{items.length === 0 && (
						<div className="empty-day">{t('empty')}</div>
					)}
					{items.length > 0 && (
						items.map(item => (
							<Item
								key={item.NTIID || (item.getCreatedTime && item.getCreatedTime()) || item.title}
								bin={bin}
								item={item}
								onItemClick={this.onItemClick}
								catalogEntry={(calendars.filter(x => x.NTIID === item.ContainerId)[0] || {}).CatalogEntry}
							/>
						))
					)}
				</div>
				{showEditor && (
					<Editor
						event={event}
						onCancel={() => this.setState({showEditor: false})}
						onSuccess={() => this.setState({showEditor: false})}
						editable={event.hasLink('edit')}
					/>
				)}
			</div>
		);
	}
}
