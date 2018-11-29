import React from 'react';

import CourseItem from './CourseItem';
import CommunityItem from './CommunityItem';

export default class CalendarList extends React.Component {
	render () {

		return (
			<div className="calendar-list-select">
				<div className="courses-list">
					<div className="calendar-list-header">Courses</div>
					<div className="course-item-list">
						<CourseItem item={{ title: 'Human Physiology', providerId: 'PHYS 2104 - 003' }} selected />
						<CourseItem item={{ title: 'Gateway to College Learning', providerId: 'UCOL 1002 - 001' }} />
					</div>
				</div>
				<div className="community-list">
					<div className="calendar-list-header">Coummities</div>
					<div className="community-item-list">
						<CommunityItem item={{ title: 'Janux' }} />
					</div>
				</div>
			</div>
		);
	}
}
