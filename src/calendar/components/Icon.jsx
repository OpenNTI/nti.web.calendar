import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default function Icon ({ selected, onClick, url }) {
	return (
		<div className={cx('calendar-icon', { selected })} onClick={onClick}>
			{selected && (
				<i className="icon-check" />
			)}
		</div>
	);
}
// style={{ backgroundImage: `url(${url})`, }}
Icon.propTypes = {
	selected: PropTypes.bool,
	onClick: PropTypes.func,
	url: PropTypes.string
};
