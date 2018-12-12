import React from 'react';
import PropTypes from 'prop-types';
import {Calendar} from '@nti/web-commons';

import Store from './DateIconStore';

export default
@Store.connect(['todaysCount', 'markSeen', 'hasSeen'])
class DateIcon extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		date: PropTypes.object,
		todaysCount: PropTypes.number,
		markSeen: PropTypes.func,
		hasSeen: PropTypes.bool
	}

	state = {}

	onClick = () => {
		this.props.markSeen();
	}

	render () {
		const {hasSeen, todaysCount, ...otherProps} = this.props;

		return (
			<div className="nti-calendar-date-icon-container" onClick={this.onClick}>
				<Calendar.DateIcon {...otherProps} viewed={hasSeen} badge={todaysCount}/>
			</div>
		);
	}
}
