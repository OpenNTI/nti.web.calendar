import React from 'react';
import PropTypes from 'prop-types';
import { DateTime, List, Presentation } from '@nti/web-commons';
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
		}),
		catalogEntry: PropTypes.object
	}

	renderTimedAssignment () {
		const { item } = this.props;

		return (
			<div className="timed-assignment">
				<div className="timed-assignment-length">
					{DateTime.getShortNaturalDuration(item.MaximumTimeAllowed * 1000)}
				</div>
				<div className="timed-assignment-label">
					Time Limit
				</div>
			</div>
		);
	}

	render () {
		const { item, catalogEntry} = this.props;
		const { dueDate, totalPoints, title, IsTimedAssignment } = item;

		return (
			<Event.Layout className={cx('assignment-event', { IsTimedAssignment })}>
				<Presentation.Asset propName="url" contentPackage={catalogEntry} type="thumb">
					<Icon />
				</Presentation.Asset>
				<div className="assignment-main-container">
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
					{IsTimedAssignment && this.renderTimedAssignment()}
				</div>
			</Event.Layout>
		);
	}
}
