import React from 'react';
import PropTypes from 'prop-types';
import { Scroll } from '@nti/web-commons';

import Editor from '../events/editor';

import Header from './Header';
import Store from './Store';
import Day from './day';

const { BoundaryMonitor } = Scroll;

@Store.connect(['bins', 'loading', 'loaded', 'error',  'calendars', 'canCreate', 'filters'])
export default class Calendar extends React.Component {
	static deriveBindingFromProps (props) {
		return props.entity || null;
	}

	static propTypes = {
		entity: PropTypes.object,
		store: PropTypes.object,
		canCreate: PropTypes.bool,
		bins: PropTypes.array,
		calendars: PropTypes.array,
		filters: PropTypes.array,
		onClose: PropTypes.func
	}

	state = {}

	render () {
		const { bins, calendars, canCreate, filters, store, onClose } = this.props;
		const { showEventEditor } = this.state;

		return (
			<div className="calendar-main">
				<Header calendars={calendars} filters={filters} addFilter={store.addFilter} removeFilter={store.removeFilter} onClose={onClose}/>
				<div className="calendar-body">
					<BoundaryMonitor>
						{bins && bins.length > 0 && bins.map(bin => <Day key={bin.name} bin={bin} />)}
					</BoundaryMonitor>
				</div>
				{canCreate && <div className="add-event" onClick={() => this.setState({showEventEditor: true})}><i className="icon-add"/></div>}
				{showEventEditor && (
					<Editor
						onCancel={() => this.setState({showEventEditor: false})}
						onSuccess={() => this.setState({showEventEditor: false})}
					/>
				)}
			</div>
		);
	}
}
