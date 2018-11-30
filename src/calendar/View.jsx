import React from 'react';
import PropTypes from 'prop-types';
import { Scroll } from '@nti/web-commons';

import Header from './Header';
import Store from './Store';
import Day from './day';

const { BoundaryMonitor } = Scroll;

@Store.connect(['bins', 'loading', 'loaded', 'error'])
export default class Calendar extends React.Component {
	static deriveBindingFromProps (props) {
		return props.entity || null;
	}

	static propTypes = {
		entity: PropTypes.object,
		store: PropTypes.object,
		bins: PropTypes.array
	}

	state = {
		calendars: []
	}

	render () {
		const { calendars } = this.state;
		const { bins } = this.props;

		return (
			<div className="calendar-main">
				<Header calendars={calendars} />
				<div className="calendar-body">
					{bins && bins.length > 0 && bins.map(bin => <Day key={bin.name} bin={bin} />)}
				</div>
			</div>
		);
	}
}
