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

export function DateField({ value, label, onChange, ...props }) {
	if (!onChange) {
		return <DateReadOnly {...props} date={value} />;
	}

	return (
		<DateInput {...props} date={value} label={label} onChange={onChange} />
	);
}

const Dates = styled.div`
	&.readOnly {
		display: flex;
	}
`;

export function DateFields({
	mode,
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
}) {
	const viewingMode = mode === 'view';
	return (
		<div data-testid="event-date-fields">
			<SectionTitle>{t('datesTimes')}</SectionTitle>
			<Dates {...{ readOnly: viewingMode }}>
				<DateField
					data-testid="date-field-start"
					value={startDate}
					label={t('start')}
					onChange={viewingMode ? null : onStartDateChange}
				/>

				<DateField
					data-testid="date-field-end"
					value={endDate}
					label={t('end')}
					onChange={viewingMode ? null : onEndDateChange}
				/>
			</Dates>
		</div>
	);
}
