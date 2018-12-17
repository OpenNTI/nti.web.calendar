import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default function Icon ({ selected, onClick, url }) {
	return (
		<div className={cx('icon-wrapper', { selected })}>
			{selected && (
				<i className="icon-check" />
			)}
			<div style={{ backgroundImage: `url(${url})`, }} className={cx('calendar-icon', { selected })} onClick={onClick} />
		</div>
	);
}

Icon.propTypes = {
	selected: PropTypes.bool,
	onClick: PropTypes.func,
	url: PropTypes.string
};
