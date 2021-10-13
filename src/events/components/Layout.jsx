import './Layout.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

export function Layout({ className, children }) {
	return <div className={cx('event-layout', className)}>{children}</div>;
}

Layout.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
};
