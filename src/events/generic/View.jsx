import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from '@nti/web-commons';

import { Icon } from '../../calendar/components';
import { Event } from '../components';
import Registry from '../Registry';

@Registry.register('application/vnd.nextthought.courseware.coursecalendarevent')
export default class GenericEvent extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			startTime: PropTypes.string.isRequired,
			endTime: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			icon: PropTypes.string
		})
	};

	render () {
		const { item: { title, startTime, endTime, icon } } = this.props;
		return (
			<Event.Layout className="event-generic">
				<Icon url={icon} />
				<div className="event-generic-meta">
					<div className="event-generic-title">{title}</div>
					<div className="event-generic-time">
						<time>{DateTime.format(new Date(startTime), 'h:mm')}</time> - <time>{DateTime.format(new Date(endTime), 'h:mm A')}</time>
					</div>
				</div>
			</Event.Layout>
		);
	}
}
