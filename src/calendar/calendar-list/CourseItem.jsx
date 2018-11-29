import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Icon } from '../components';

export default class CourseItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		selected: PropTypes.bool
	}

	render () {
		const { item: { title, providerId }, selected } = this.props;

		return (
			<div className="course-item">
				<Icon selected={selected} />
				<div className="course-item-meta">
					<div className="course-item-title">{title}</div>
					<div className="course-item-provider-id">{providerId}</div>
				</div>
			</div>
		);
	}
}
