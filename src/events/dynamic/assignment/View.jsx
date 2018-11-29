import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from '@nti/web-commons';

import { Icon } from '../../../calendar/components';
import { Event } from '../../components';

export default class AssignmentEvent extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			title: PropTypes.string,
			dueDate: PropTypes.string
		})
	}
	render () {
		const { item: { title, dueDate }} = this.props;

		return (
			<Event.Layout className="assignment-event">
				<Icon />
				<div className="assignment-meta">
					<div className="assignment-title">{title}</div>
					<div className="assignment-due">
						Due {DateTime.format(new Date(dueDate), 'h:mm A z')}
					</div>
				</div>
			</Event.Layout>
		);
	}
}
