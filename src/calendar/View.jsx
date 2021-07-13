import './View.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Editor } from '../events/editor/Editor';

import Body from './Body';
import Header from './Header';
import Store from './Store';

const Calendar = React.forwardRef(function CalendarRenderer(
	{ additionalControls, className, onClose, readOnly },
	ref
) {
	const { canCreate } = Store.useValue();

	const [show, showEditor] = useState();

	return (
		<div className={cx('calendar-main', className)} ref={ref}>
			<Header onClose={onClose} additionalControls={additionalControls} />
			<Body />
			{!readOnly && canCreate && (
				<div className="add-event" onClick={() => showEditor(true)}>
					<i className="icon-add" />
				</div>
			)}
			{show && (
				<Editor
					onCancel={() => showEditor(false)}
					onSuccess={() => showEditor(false)}
					create={!readOnly && canCreate}
				/>
			)}
		</div>
	);
});

Calendar.propTypes = {
	entity: PropTypes.object,
	className: PropTypes.string,
	onClose: PropTypes.func,
	readOnly: PropTypes.bool,
	additionalControls: PropTypes.any, // component to be rendered in the header
};

export default Store.compose(Calendar, {
	deriveBindingFromProps(props) {
		return props.entity || null;
	},
});
