import './Layout.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default function Layout ({ className, children }) {
	return (
		<div className={cx('event-layout', className)}>
			{children}
		</div>
	);
}

Layout.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node
};
