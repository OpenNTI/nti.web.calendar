import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Loading} from '@nti/web-commons';

import Day from './day';
import Store from './NotableEventsStore';

const bindings = {};
function getBinding (limit) {
	// reuse same object to avoid unneccessary store reloads
	if (!bindings[limit]) {
		bindings[limit] = {limit};
	}
	return bindings[limit];
}

export default
@Store.connect(['bins', 'loading', 'error',  'calendars'])
class NotableEvents extends React.Component {

	static deriveBindingFromProps = ({limit = 5} = {}) => getBinding(limit);

	static propTypes = {
		bins: PropTypes.array,
		calendars: PropTypes.array,
		limit: PropTypes.number,
		loading: PropTypes.bool,
		error: PropTypes.object,
		children: PropTypes.any
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
			</div>
		);
	}
}
