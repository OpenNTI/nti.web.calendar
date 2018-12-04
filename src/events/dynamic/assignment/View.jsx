import React from 'react';
import PropTypes from 'prop-types';
import { DateTime, List } from '@nti/web-commons';
import cx from 'classnames';

import { Icon } from '../../../calendar/components';
import { Event } from '../../components';
import Registry from '../../Registry';

@Registry.register('application/vnd.nextthought.assessment.assignmentcalendarevent')
export default class AssignmentEvent extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			title: PropTypes.string,
			dueDate: PropTypes.string,
			assignment: PropTypes.shape({
				getDueDate: PropTypes.func.isRequired,
				totalPoints: PropTypes.number
			}).isRequired
		})
	}

	renderTimedAssignment () {
		const { item: { assignment } } = this.props;
		return (
			<div className="timed-assignment">
				<div className="timed-assignment-length">
					{DateTime.getShortNaturalDuration(assignment.getMaximumTimeAllowed())}
				</div>
				<div className="timed-assignment-label">
					Time Limit
				</div>
			</div>
		);
	}

	render () {
		const { item: { title, assignment }} = this.props;
		const dueDate = assignment && assignment.getDueDate();
		const { totalPoints, isTimed } = assignment;

		return (
			<Event.Layout className={cx('assignment-event', { isTimed })}>
				<Icon />
				<div className="assignment-content">
					<div className="assignment-meta">
						<div className="assignment-title">{title}</div>
						<List.SeparatedInline className="assignment-subtitle">
							{dueDate && (
								<div className="assignment-due">
									Due {DateTime.format(new Date(dueDate), 'h:mm A z')}
								</div>
							)}
							{totalPoints && (
								<div className="assignment-points">
									{totalPoints} PTS.
								</div>
							)}
						</List.SeparatedInline>
					</div>
					{isTimed && this.renderTimedAssignment()}
				</div>
			</Event.Layout>
		);
	}
}
