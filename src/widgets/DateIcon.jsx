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

	render () {
		const {hasSeen, todaysCount, markSeen, ...otherProps} = this.props;

		return (
			<div className="nti-calendar-date-icon-container" onClick={() => { markSeen(); }}>
				<Calendar.DateIcon {...otherProps} viewed={hasSeen} badge={todaysCount}/>
			</div>
		);
	}
}
