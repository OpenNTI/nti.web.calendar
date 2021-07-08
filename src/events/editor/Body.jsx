import './EventEditor.scss';
import React from 'react';

import t from './strings';
import CalendarSelect from './CalendarSelect';
import { DateFields } from './DateField';
import { LocationInfo } from './Location';

export function Body({
	calendar,
	endDate,
	event,
	location,
	onCalendarSelect,
	onEndDateChange,
	onLocationChange,
	onStartDateChange,
	readOnly,
	startDate,
}) {
	return (
		<div className="other-info">
			{!readOnly && (
				<div className="input-section calendar">
					<div className="section-title">{t('calendar')}</div>
					<CalendarSelect
						onChange={onCalendarSelect}
						selected={calendar}
						event={event}
					/>
				</div>
			)}
			{!readOnly && (
				<LocationInfo
					location={location}
					readOnly={readOnly}
					onChange={onLocationChange}
				/>
			)}
			<DateFields
				startDate={startDate}
				onStartDateChange={readOnly ? null : x => onStartDateChange}
				endDate={endDate}
				onEndDateChange={readOnly ? null : onEndDateChange}
			/>
		</div>
	);
}
