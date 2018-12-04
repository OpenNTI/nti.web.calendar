import React from 'react';
import PropTypes from 'prop-types';
import { DateTime, List } from '@nti/web-commons';
import cx from 'classnames';

import { Icon } from '../../../calendar/components';
import { Event } from '../../components';
import Registry from '../../Registry';

@Registry.register('application/vnd.nextthought.webinar.webinarcalendarevent')
export default class WebinarEvent extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			title: PropTypes.string,
			dueDate: PropTypes.string,
			webinar: PropTypes.isRequired
		})
	}

	render () {
		const { item, item: { title }} = this.props;

		return (
			<Event.Layout className={cx('webinar-event')}>
				<Icon />
				<div className="webinar-content">
					<div className="webinar-meta">
						<div className="webinar-title">{title}</div>
						<List.SeparatedInline className="webinar-subtitle">
							<div className="times">{DateTime.format(item.getStartTime(), 'h:mm')}-{DateTime.format(item.getEndTime(), 'h:mm a')}</div>
						</List.SeparatedInline>
					</div>
				</div>
			</Event.Layout>
		);
	}
}
