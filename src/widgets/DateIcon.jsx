import React from 'react';
import PropTypes from 'prop-types';

import { DateTime } from '@nti/web-commons';

import Store from './DateIconStore';

const Wrapper = styled.div`
	cursor: pointer;
`;

DateIcon.propTypes = {
	date: PropTypes.object,
};
function DateIcon(props) {
	const { todaysCount, markSeen, hasSeen } = Store.useValue();

	return (
		<Wrapper
			className="nti-calendar-date-icon-container"
			onClick={() => {
				markSeen();
			}}
		>
			<DateTime.DateIcon
				{...props}
				viewed={hasSeen}
				badge={todaysCount || 0}
			/>
		</Wrapper>
	);
}

export default Store.compose(DateIcon);
