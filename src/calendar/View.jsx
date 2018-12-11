import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Editor from '../events/editor';

import Body from './Body';
import Header from './Header';
import Store from './Store';

@Store.connect(['calendars', 'canCreate', 'filters'])
export default class Calendar extends React.Component {
	static deriveBindingFromProps (props) {
		return props.entity || null;
	}

	static propTypes = {
		entity: PropTypes.object,
		store: PropTypes.object,
		canCreate: PropTypes.bool,
		calendars: PropTypes.array,
		className: PropTypes.string,
		filters: PropTypes.array,
		onClose: PropTypes.func,
	}

	state = {}

	render () {
		const {
			calendars,
			canCreate,
			className,
			filters,
			store,
			onClose,
		} = this.props;
		const { showEventEditor } = this.state;
		const exportLink = store && store.collection && store.collection.getLink('export');

		return (
			<div className={cx('calendar-main', className)}>
				<Header
					calendars={calendars}
					filters={filters}
					addFilter={store.addFilter}
					removeFilter={store.removeFilter}
					onClose={onClose}
					exportLink={exportLink}
				/>
				<Body />
				{canCreate && (
					<div
						className="add-event"
						onClick={() => this.setState({showEventEditor: true})}
					>
						<i className="icon-add"/>
					</div>
				)}
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
