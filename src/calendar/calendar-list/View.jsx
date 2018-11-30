import React from 'react';
import PropTypes from 'prop-types';

import CourseItem from './CourseItem';
import CommunityItem from './CommunityItem';

const CourseCalendar = 'application/vnd.nextthought.courseware.coursecalendar';

export default class CalendarList extends React.Component {
	static propTypes = {
		calendars: PropTypes.array
	}

	render () {
		const { calendars } = this.props;
		const courseCalendars = (calendars.filter(x => x.MimeType === CourseCalendar)) || [];

		return (
			<div className="calendar-list-select">
				{courseCalendars.length > 0 && (
					<div className="courses-list">
						<div className="calendar-list-header">Courses</div>
						<div className="course-item-list">
							{courseCalendars.map(item => <CourseItem key={item.NTIID} item={item} />)}
						</div>
					</div>
				)}
				<div className="community-list">
					<div className="calendar-list-header">Coummities</div>
					<div className="community-item-list">

					</div>
				</div>
			</div>
		);
	}
}
