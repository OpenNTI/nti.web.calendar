import React from 'react';
import PropTypes from 'prop-types';
import { Scroll, Loading } from '@nti/web-commons';

import Day from './day';

const { BoundaryMonitor } = Scroll;

export default class CalendarBody extends React.Component {

	static propTypes = {
		bins: PropTypes.array,
		calendars: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.object
	}

	render () {
		const {
			loading,
			error,
			calendars,
			bins
		} = this.props;

		return (
			<div className="calendar-body">
				{loading && <Loading.Spinner className="calendar-body-loading"/>}
				{error && this.renderError()}
				<BoundaryMonitor>
					{bins && bins.length > 0 && bins.map(bin => <Day calendars={calendars} key={bin.name} bin={bin} />)}
				</BoundaryMonitor>
			</div>
		);
	}
}
