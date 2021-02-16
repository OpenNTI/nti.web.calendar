import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { DateTime, List, Presentation } from '@nti/web-commons';
import cx from 'classnames';

import { Icon } from '../../../calendar/components';
import { Layout } from '../../components';
import Registry from '../../Registry';

export default class AssignmentEvent extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			CatalogEntry: PropTypes.object,
			title: PropTypes.string,
			dueDate: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.instanceOf(Date)
			]),
			IsTimedAssignment: PropTypes.bool,
			MaximumTimeAllowed: PropTypes.number,
			totalPoints: PropTypes.number
		})
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
		const { item } = this.props;
		const { dueDate, totalPoints, title, IsTimedAssignment } = item;

		return (
			<Layout className={cx('assignment-event', { IsTimedAssignment })}>
				<Presentation.Asset propName="url" contentPackage={item.CatalogEntry} type="thumb">
					<Icon />
				</Presentation.Asset>
				<div className="assignment-main-container">
					<div className="assignment-meta">
						<div className="assignment-title">{title}</div>
						<List.SeparatedInline className="assignment-subtitle">
							{dueDate && (
								<div className="assignment-due">
									Due {DateTime.format(new Date(dueDate), DateTime.TIME_WITH_ZONE)}
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
			</Layout>
		);
	}
}

Registry.register('application/vnd.nextthought.assessment.assignmentcalendarevent')(AssignmentEvent);
