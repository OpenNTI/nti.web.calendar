import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import {CircularProgress} from '@nti/web-charts';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import styles from './Availability.css';

const cx = classnames.bind(styles);

const t = scoped('calendar.events.Availability', {
	completed: 'Completed',
	absent: 'Absent'
});

function isToday (date) {
	if (!(date || {}).getDate) {
		return false;
	}

	const now = new Date();
	return now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear();
}

export default function EventAvailability (props) {
	const {
		className,
		eventType,
		startTime,
		endTime,
		icon,
		completed,
		expired,
		minimal
	} = props;

	// default case, render 'Starts [day] from [startTime] - [endTime]'
	let timeDisplay = startTime && endTime && DateTime.format(startTime, '[Starts] dddd [from] hh:mm a')
		+ ' - ' + DateTime.format(endTime, 'hh:mm a z');

	if (expired) {
		// render 'Expired [day] at [time]'
		timeDisplay = endTime && DateTime.format(endTime, '[Expired] dddd [at] hh:mm a z');
	}
	else {
		// determine if it's today
		if (isToday(new Date(), startTime)) {
			timeDisplay = DateTime.format(startTime, '[Starts Today at] hh:mm a z');

			/*
			// This is logic for the simulated live case which we aren't worrying about now
			const msUntilExpiration = nearestSession.getEndTime() - now;

			if(msUntilExpiration <= 60 * 60 * 1000) {
				// expires within an hour, render 'Expires Today at [time]'
				timeDisplay = nearestSession && DateTime.format(nearestSession.getEndTime(), '[Expires Today at] hh:mm a z');
			}
			else {
				// render 'Available Today at [time]'
				timeDisplay = nearestSession && DateTime.format(nearestSession.getStartTime(), '[Available Today at] hh:mm a z');
			}
			*/
		}
	}

	return (
		<div className={cx('availability-info', className)}>
			{completed && !minimal && <CircularProgress width={20} height={20} isComplete />}
			{eventType && <div className={cx('event-type', 'separator')}>{eventType}</div>}
			{completed && <div className={cx('completion-label', 'separator')}>{t('completed')}</div>}
			{!completed && expired && <div className={cx('incomplete-label', 'separator')}>{t('absent')}</div>}
			{(!icon || minimal) && !expired && <DateTime.Duration className={cx('duration', 'separator')} {...{startTime, endTime}} />}
			<div className={cx('time-display')}>{timeDisplay}</div>
		</div>
	);
}

EventAvailability.propTypes = {
	eventType: PropTypes.string,
	startTime: PropTypes.any,
	endTime: PropTypes.any,
	expired: PropTypes.bool,
	icon: PropTypes.any,
	completed: PropTypes.bool,
	minimal: PropTypes.bool
};