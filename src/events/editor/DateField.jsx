import React from 'react';

import { DateTime } from '@nti/web-commons';

import t from './strings';
import DateInput from './DateInput';
import { SectionTitle } from './SectionTitle';

const DateReadOnly = styled(DateTime).attrs({
	as: 'div',
	format: DateTime.MONTH_NAME_DAY_YEAR_TIME,
})`
	font-size: 0.75rem;
	color: var(--secondary-grey);
	margin-right: 20px;
`;

export function DateField({ value, label, onChange }) {
	if (!onChange) {
		return <DateReadOnly date={value} />;
	}

	return <DateInput date={value} label={label} onChange={onChange} />;
}

const Dates = styled.div`
	&.readOnly {
		display: flex;
	}
`;

export function DateFields({
	readOnly,
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
}) {
	return (
		<div>
			<SectionTitle>{t('datesTimes')}</SectionTitle>
			<Dates {...{ readOnly }}>
				<DateField
					value={startDate}
					label={t('start')}
					onChange={readOnly ? null : onStartDateChange}
				/>

				<DateField
					value={endDate}
					label={t('end')}
					onChange={readOnly ? null : onEndDateChange}
				/>
			</Dates>
		</div>
	);
}
