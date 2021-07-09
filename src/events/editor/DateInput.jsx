import React, { useEffect } from 'react';

import { DayPicker, Flyout, DateTime, useReducerState } from '@nti/web-commons';

// in milliseconds
const MINUTES_INCREMENT = 15 * 60 * 1000;

//#region 🎨

const DateLabel = styled.span`
	min-width: 56px;
	display: inline-block;
	font-size: 10px;
	padding-left: 12px;
	text-transform: uppercase;
	font-weight: bold;
	color: var(--tertiary-grey);
`;

const TimeValue = styled.div`
	color: var(--secondary-grey);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
	height: 40px;
	position: relative;
	line-height: 40px;
	font-size: 14px;
	width: 125px;
	padding-left: 15px;
	margin-left: 0;
	text-transform: uppercase;

	&:focus {
		box-shadow: 0 0 3px 1px var(--primary-blue);
	}

	&.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	i {
		position: absolute;
		right: 8px;
		top: 12px;
	}
`;

const AvailableTime = styled.div`
	color: var(--secondary-grey);
	font-size: 14px;
	padding-left: 15px;
	text-transform: uppercase;
	line-height: 24px;
	cursor: pointer;
`;

const TimeInputMenu = styled(Flyout.Triggered)`
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
	max-height: 200px;
	overflow: auto;
`;

const Picker = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 10px;
`;

const PickerTrigger = styled.div`
	height: 40px;
	line-height: 40px;
	width: 300px;
	font-size: 14px;
	padding-left: 10px;
	position: relative;
	cursor: pointer;
	margin-right: 15px;
	margin-bottom: 10px;

	i {
		position: absolute;
		right: 8px;
		top: 12px;
	}
`;

//#endregion

//#region utils
const isSameDay = (a, b) => {
	return (
		a === b ||
		(a?.getYear() === b?.getYear() &&
			a?.getMonth() === b?.getMonth() &&
			a?.getDate() === b?.getDate())
	);
};

function determineAvailableTimes(date) {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	let availableTimes = [];

	const now = Date.now();

	do {
		const currTime = startOfDay.getTime();

		if (currTime > now) {
			availableTimes.push(new Date(currTime));
		}

		startOfDay.setTime(currTime + MINUTES_INCREMENT);
	} while (!(startOfDay.getHours() === 0 && startOfDay.getMinutes() === 0));

	return availableTimes;
}

//#endregion

const DayPickerPanel = ({ value, onChange, dismissFlyout }) => (
	<DayPicker
		value={value}
		disabledDays={day => {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			return day < today;
		}}
		onChange={x => (onChange(x), dismissFlyout())}
	/>
);

export default function EventDateInput({ date, label, onChange, ...props }) {
	const [{ oldDate, availableTimes }, setState] = useReducerState({});

	useEffect(() => {
		if (!oldDate || !isSameDay(oldDate, date)) {
			setState({
				oldDate: date,
				availableTimes: determineAvailableTimes(date),
			});
		}
	}, [date, oldDate]);

	return (
		<Picker data-testid={props['data-testid'] ?? 'date-input'}>
			<Flyout.Triggered
				autoDismissOnAction={false}
				data-testid="event-date-input"
				trigger={
					<PickerTrigger>
						<DateLabel>{label}</DateLabel>
						<DateTime date={date} />
						<i className="icon-chevron-down" />
					</PickerTrigger>
				}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
			>
				<DayPickerPanel value={date} onChange={onChange} />
			</Flyout.Triggered>
			<Time values={availableTimes} value={date} onChange={onChange} />
		</Picker>
	);
}

const TimeTrigger = React.forwardRef(({ value, ...props }, ref) => (
	<TimeValue data-testid="time-current-value" ref={ref} {...props}>
		<DateTime date={value} format={DateTime.TIME_PADDED} />
		<i className="icon-chevron-down" />
	</TimeValue>
));

function Time({ values, value, onChange }) {
	// disabled since there are no available times to choose from
	const disabled = !values?.length;

	return disabled ? (
		<TimeTrigger value={value} disabled />
	) : (
		<TimeInputMenu
			autoDismissOnAction
			data-testid="time-input"
			trigger={<TimeTrigger value={value} />}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			sizing={Flyout.SIZES.MATCH_SIDE}
		>
			<div>
				{values?.map(time => (
					<AvailableTime
						key={time.getTime()}
						data-testid="available-time"
						onClick={() => onChange?.(time)}
					>
						<DateTime date={time} format={DateTime.TIME_PADDED} />
					</AvailableTime>
				))}
			</div>
		</TimeInputMenu>
	);
}
