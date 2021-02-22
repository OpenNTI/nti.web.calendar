import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { decorate } from '@nti/lib-commons';

import Editor from '../events/editor';

import Body from './Body';
import Header from './Header';
import Store from './Store';

class Calendar extends React.Component {
	static deriveBindingFromProps(props) {
		return props.entity || null;
	}

	static propTypes = {
		entity: PropTypes.object,
		canCreate: PropTypes.bool,
		className: PropTypes.string,
		onClose: PropTypes.func,
		readOnly: PropTypes.bool,
		additionalControls: PropTypes.any, // component to be rendered in the header
	};

	state = {};

	render() {
		const {
			additionalControls,
			canCreate,
			className,
			onClose,
			readOnly,
		} = this.props;
		const { showEventEditor } = this.state;

		return (
			<div className={cx('calendar-main', className)}>
				<Header
					onClose={onClose}
					additionalControls={additionalControls}
				/>
				<Body />
				{!readOnly && canCreate && (
					<div
						className="add-event"
						onClick={() => this.setState({ showEventEditor: true })}
					>
						<i className="icon-add" />
					</div>
				)}
				{showEventEditor && (
					<Editor
						onCancel={() =>
							this.setState({ showEventEditor: false })
						}
						onSuccess={() =>
							this.setState({ showEventEditor: false })
						}
						create={!readOnly && canCreate}
					/>
				)}
			</div>
		);
	}
}

export default decorate(Calendar, [Store.connect(['canCreate'])]);
