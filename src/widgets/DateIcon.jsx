import React from 'react';
import PropTypes from 'prop-types';
import {Calendar} from '@nti/web-commons';

import Store from './DateIconStore';

export default
@Store.connect(['todaysCount'])
class DateIcon extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		date: PropTypes.object,
		todaysCount: PropTypes.number
	}

	render () {
		const {todaysCount, ...otherProps} = this.props;

		return (
			<div className="nti-calendar-date-icon-container">
				<Calendar.DateIcon {...otherProps} badge={todaysCount}/>
			</div>
		);
	}
}
