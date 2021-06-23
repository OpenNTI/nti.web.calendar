import React from 'react';
import PropTypes from 'prop-types';

import { DateTime } from '@nti/web-commons';

import Store from './DateIconStore';

const Wrapper = styled.div`
	cursor: pointer;
`;

const DateIcon = React.forwardRef((props, ref) => {
	const { todaysCount, markSeen, hasSeen } = Store.useValue();

	return (
		<Wrapper
			ref={ref}
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
});

DateIcon.propTypes = {
	date: PropTypes.object,
};

export default Store.compose(DateIcon);
