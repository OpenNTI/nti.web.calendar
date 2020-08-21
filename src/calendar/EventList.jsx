import './EventList.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Loading} from '@nti/web-commons';

import Day from './day';

const t = scoped('nti-web-calendar.NotableEvents', {
	emptyMessage: 'There are no upcoming events'
});

export default class EventList extends React.Component {

	static propTypes = {
		bins: PropTypes.array,
		calendars: PropTypes.array,
		limit: PropTypes.number,
		loading: PropTypes.bool,
		error: PropTypes.object,
		children: PropTypes.any
	}

	renderError () {
		const {error} = this.props;
		return (
			<div className="calendar-error">
				{error.message || 'Unable to load.'}
			</div>
		);
	}

	render () {
		const {bins, calendars, loading, error, limit = 5, children} = this.props;
		const empty = !bins || bins.length === 0;

		return (
			<div className={cx('notable-events', {loading, error, empty})}>
				{loading && <Loading.Spinner className="calendar-body-loading"/>}
				{error && this.renderError()}
				{(bins || []).slice(0, limit).map(bin => (
					<Day
						calendars={calendars}
						key={bin.name}
						bin={bin}
					/>
				))}
				{!loading && children}
				{!loading && empty && <div className="empty-message">{t('emptyMessage')}</div>}
			</div>
		);
	}
}
