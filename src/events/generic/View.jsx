import React from 'react';
import PropTypes from 'prop-types';
import { List, DateTime, Presentation } from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import { Icon } from '../../calendar/components';
import { Event } from '../components';
import Registry from '../Registry';

const t = scoped('calendar.events.generic.View', {
	dayIndex: 'Day %(count)s / %(total)s'
});

@Registry.register('application/vnd.nextthought.courseware.coursecalendarevent')
export default class GenericEvent extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			getStartTime: PropTypes.func.isRequired,
			getEndTime: PropTypes.func.isRequired,
			title: PropTypes.string.isRequired,
			icon: PropTypes.string
		}),
		numberOfDays: PropTypes.number,
		day: PropTypes.number,
		catalogEntry: PropTypes.object,
	};

	render () {
		const { numberOfDays, day, item: { title }, catalogEntry } = this.props;

		return (
			<Event.Layout className="event-generic">
				<Presentation.Asset propName="url" contentPackage={catalogEntry} type="thumb">
					<Icon />
				</Presentation.Asset>
				<div className="event-generic-meta">
					<div className="event-generic-title">{title}</div>
					<List.SeparatedInline className="event-generic-subtitle">
						{numberOfDays > 1 && <div className="event-day-index">{t('dayIndex', { count: day + 1, total: numberOfDays })}</div>}
						<div className="event-generic-time">
							<time>{DateTime.format(this.props.item.getStartTime(), 'h:mm')}</time> - <time>{DateTime.format(this.props.item.getEndTime(), 'h:mm A')}</time>
						</div>
					</List.SeparatedInline>
				</div>
			</Event.Layout>
		);
	}
}
