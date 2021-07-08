import React from 'react';

import { DateTime } from '@nti/web-commons';

import t from './strings';
import DateInput from './DateInput';

export function DateField({ value, label, onChange }) {
	if (!onChange) {
		return (
			<DateTime
				date={value}
				as="div"
				className="date-display"
				format={DateTime.MONTH_NAME_DAY_YEAR_TIME}
			/>
		);
	}

	return <DateInput date={value} label={label} onChange={onChange} />;
}

export function DateFields({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
}) {
	return (
		<div className="input-section times">
			<div className="section-title">{t('datesTimes')}</div>
			<div className="dates">
				<DateField
					value={startDate}
					label={t('start')}
					onChange={onStartDateChange}
				/>

				<DateField
					value={endDate}
					label={t('end')}
					onChange={onEndDateChange}
				/>
			</div>
		</div>
	);
}
