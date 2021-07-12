import React from 'react';

import t from './strings';
import CalendarSelect from './CalendarSelect';
import { DateFields } from './DateField';
import { LocationInfo } from './Location';
import { SectionTitle } from './SectionTitle.jsx';

const Container = styled.div`
	padding-bottom: 30px;

	&.readOnly {
		display: flex;
		flex-wrap: wrap;
	}

	@media (--respond-to-handhelds) {
		padding-left: 0;
	}

	i:global(.icon-chevron-down) {
		color: var(--tertiary-grey);
		font-size: 12px;
		margin-top: 2px;
		top: 14px;
	}

	:global(.flyout-trigger) {
		color: var(--secondary-grey);

		&:not(:focus) {
			box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
		}
	}
`;

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
		<Container {...{ readOnly }}>
			{!readOnly && (
				<div>
					<SectionTitle>{t('calendar')}</SectionTitle>
					<CalendarSelect
						onChange={onCalendarSelect}
						selected={calendar}
						event={event}
					/>
				</div>
			)}

			<LocationInfo
				location={location}
				readOnly={readOnly}
				onChange={onLocationChange}
			/>
			<DateFields
				{...{
					readOnly,
					startDate,
					onStartDateChange,
					endDate,
					onEndDateChange,
				}}
			/>
		</Container>
	);
}
