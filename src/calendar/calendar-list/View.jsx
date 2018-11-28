import React from 'react';


export default class CalendarList extends React.Component {
	render () {

		return (
			<div className="calendar-list-select">
				<div className="courses-list">
					<div className="calendar-list-header">Courses</div>
				</div>
				<div className="community-list">
					<div className="calendar-list-header">Coummities</div>
				</div>
			</div>
		);
	}
}
