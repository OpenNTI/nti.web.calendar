import React from 'react';

import Header from './Header';

export default class Calendar extends React.Component {

	state = {
		calendars: []
	}

	render () {
		const { calendars } = this.state;

		return (
			<div className="calendar-main">
				<Header calendars={calendars} />
				<div className="calendar-body">
				</div>
			</div>
		);
	}
}
