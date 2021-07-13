import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { DateTime } from '@nti/web-commons';

import { Item } from '../events/Item';
import { Editor } from '../events/editor/Editor';

//#region paint
const Padded = styled.div`
	padding: 10px;
`;

const Header = styled.div`
	background-color: #2d2d2d;
	padding: 10px;
	color: white;
	font-weight: bold;
	text-transform: uppercase;
	font-size: 10px;
`;

const Empty = styled.div`
	color: var(--tertiary-grey);
	font-style: italic;
	padding: 15px 45px;
	font-size: 14px;
`;
//#endregion

const t = scoped('calendar.day', {
	empty: 'No events yet...',
	today: 'Today',
	todayWithDate: 'Today %(date)s',
});

function isToday(date) {
	const other = new Date(date);
	const today = new Date();
	return other.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
}

const keyFor = event =>
	(event.getUniqueIdentifier && event.getUniqueIdentifier()) ||
	event.NTIID ||
	(event.getCreatedTime && event.getCreatedTime()) ||
	event.title;

const formatDate = date => {
	const year = new Date().getFullYear();
	const format = DateTime.isToday(date)
		? f => t('todayWithDate', { date: f(DateTime.MONTH_NAME_DAY) })
		: date.getFullYear() !== year
		? DateTime.WEEKDAY_ABBR_MONTH_NAME_DAY_YEAR
		: DateTime.WEEKDAY_ABBR_MONTH_NAME_DAY;

	return DateTime.format(date, format);
};

export default class Day extends React.Component {
	static propTypes = {
		bin: PropTypes.shape({
			name: PropTypes.string,
			items: PropTypes.array,
		}),
		calendars: PropTypes.array,
		setToday: PropTypes.func,
	};

	state = {};

	onItemClick = item => {
		this.setState({
			showEditor: true,
			event: item,
		});
	};

	setToday = x => {
		const { bin, setToday } = this.props;

		if (setToday && isToday(bin.name)) {
			setToday(x);
		}
	};

	render() {
		const { showEditor, event } = this.state;
		const {
			bin,
			bin: { name, items },
		} = this.props;
		const date = new Date(name);

		return (
			<div ref={this.setToday} className="calendar-day">
				<Header className="day-header">
					<time>{formatDate(date)}</time>
				</Header>
				<Padded className="day-events">
					{items.length === 0 && (
						<Empty className="empty-day">{t('empty')}</Empty>
					)}
					{items.length > 0 &&
						items.map(item => (
							<Item
								key={keyFor(item)}
								bin={bin}
								item={item}
								onItemClick={this.onItemClick}
							/>
						))}
				</Padded>
				{showEditor && (
					<Editor
						event={event}
						onCancel={() => this.setState({ showEditor: false })}
						onSuccess={() => this.setState({ showEditor: false })}
						editable={event.hasLink('edit')}
					/>
				)}
			</div>
		);
	}
}
