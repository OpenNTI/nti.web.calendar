import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Editor from '../events/editor';

import Body from './Body';
import Header from './Header';
import Store from './Store';

@Store.connect(['canCreate'])
export default class Calendar extends React.Component {
	static deriveBindingFromProps (props) {
		return props.entity || null;
	}

	static propTypes = {
		entity: PropTypes.object,
		canCreate: PropTypes.bool,
		className: PropTypes.string,
		onClose: PropTypes.func,
		headless: PropTypes.bool
	}

	state = {}

	render () {
		const {
			canCreate,
			className,
			headless,
			onClose,
		} = this.props;
		const { showEventEditor } = this.state;

		return (
			<div className={cx('calendar-main', className)}>
				{!headless && <Header onClose={onClose} />}
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
