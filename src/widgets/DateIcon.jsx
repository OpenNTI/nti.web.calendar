import './DateIcon.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { decorate } from '@nti/lib-commons';
import { DateTime } from '@nti/web-commons';

import Store from './DateIconStore';

class DateIcon extends React.PureComponent {
	static propTypes = {
		className: PropTypes.string,
		date: PropTypes.object,
		todaysCount: PropTypes.number,
		markSeen: PropTypes.func,
		hasSeen: PropTypes.bool,
	};

	render() {
		const { hasSeen, todaysCount, markSeen, ...otherProps } = this.props;

		return (
			<div
				className="nti-calendar-date-icon-container"
				onClick={() => {
					markSeen();
				}}
			>
				<DateTime.DateIcon
					{...otherProps}
					viewed={hasSeen}
					badge={todaysCount || 0}
				/>
			</div>
		);
	}
}

export default decorate(DateIcon, [
	Store.connect(['todaysCount', 'markSeen', 'hasSeen']),
]);
