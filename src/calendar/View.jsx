import React from 'react';
import PropTypes from 'prop-types';
import { Scroll, Loading } from '@nti/web-commons';
import cx from 'classnames';

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
		className: PropTypes.string,
		filters: PropTypes.array,
		onClose: PropTypes.func,
		loading: PropTypes.bool,
		error: PropTypes.object
	}

	state = {}

	renderError () {
		const { error } = this.props;
		return (
			<div className="calendar-error">
				{error.message || 'Unable to load.'}
			</div>
		);
	}

	render () {
		const {
			bins,
			calendars,
			canCreate,
			className,
			filters,
			store,
			onClose,
			loading,
			error
		} = this.props;
		const { showEventEditor } = this.state;

		return (
			<div className={cx('calendar-main', className)}>
				<Header calendars={calendars} filters={filters} addFilter={store.addFilter} removeFilter={store.removeFilter} onClose={onClose}/>
				<div className="calendar-body">
					{loading && <Loading.Spinner className="calendar-body-loading"/>}
					{error && this.renderError()}
					<BoundaryMonitor>
						{bins && bins.length > 0 && bins.map(bin => <Day calendars={calendars} key={bin.name} bin={bin} />)}
					</BoundaryMonitor>
				</div>
				{canCreate && <div className="add-event" onClick={() => this.setState({showEventEditor: true})}><i className="icon-add"/></div>}
				{showEventEditor && (
					<Editor
						onCancel={() => this.setState({showEventEditor: false})}
						onSuccess={() => this.setState({showEventEditor: false})}
						create
					/>
				)}
			</div>
		);
	}
}
