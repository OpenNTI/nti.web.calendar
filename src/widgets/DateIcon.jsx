import React from 'react';
import PropTypes from 'prop-types';
import {Calendar} from '@nti/web-commons';

export default class DateIcon extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		date: PropTypes.object,
		badge: PropTypes.number
	}

	render () {
		const {...otherProps} = this.props;

		// TODO: Handle badge value calculation
		return (
			<div className="nti-calendar-date-icon-container">
				<Calendar.DateIcon {...otherProps}/>
			</div>
		);
	}
}
