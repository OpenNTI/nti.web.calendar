import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Icon } from '../components';

export default class CommunityItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		selected: PropTypes.bool
	}

	render () {
		const { item: { title }, selected } = this.props;

		return (
			<div className="community-item">
				<Icon selected={selected} />
				<div className="community-item-meta">
					<div className="community-item-title">{title}</div>
				</div>
			</div>
		);
	}
}
