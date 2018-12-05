import React from 'react';
import PropTypes from 'prop-types';

import CourseItem from './CourseItem';
import CommunityItem from './CommunityItem';

const CourseCalendar = 'application/vnd.nextthought.courseware.coursecalendar';

const searchFilter = (calendar, searchTerm) => {
	const { CatalogEntry = {}, title = '' } = calendar;
	const { ProviderUniqueID = '' } = CatalogEntry;
	return title.toLowerCase().includes(searchTerm.toLowerCase()) || ProviderUniqueID.toLowerCase().includes(searchTerm.toLowerCase());
};

export default class CalendarList extends React.Component {
	static propTypes = {
		calendars: PropTypes.array,
		filters: PropTypes.array,
		addFilter: PropTypes.func,
		removeFilter: PropTypes.func
	}

	state = {
		searchTerm: ''
	}

	onFilterClick = (filter) => {
		const { filters } = this.props;
		const isExcluded = filters.includes(filter);
		if (isExcluded) {
			this.props.removeFilter(filter);
		} else {
			this.props.addFilter(filter);
		}
	}

	onSearchChange = ({ target: {value} }) => {
		this.setState({ searchTerm: value });
	}

	render () {
		const { calendars, filters } = this.props;
		const { searchTerm } = this.state;
		const courseCalendars = calendars && (calendars.filter(x => x.MimeType === CourseCalendar)) || [];

		return (
			<div className="calendar-list-select">
				<div className="calendar-search">
					<i className="icon-search" />
					<input className="calendar-search-input" type="text" placeholder="Search your calendars" value={searchTerm} onChange={this.onSearchChange} />
				</div>
				{courseCalendars.length > 0 && (
					<div className="courses-list">
						<div className="calendar-list-header">Courses</div>
						<div className="course-item-list">
							{courseCalendars.filter((cal) => searchFilter(cal, searchTerm)).map(item =>
								<CourseItem key={item.NTIID} onClick={this.onFilterClick} selected={!filters.includes(item.NTIID)} item={item} />
							)}
						</div>
					</div>
				)}
				{/* <div className="community-list">
					<div className="calendar-list-header">Communities</div>
					<div className="community-item-list">

					</div>
				</div> */}
			</div>
		);
	}
}
