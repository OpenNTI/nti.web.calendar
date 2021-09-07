import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { DateTime } from '@nti/web-commons';
import { useService } from '@nti/web-core';

import Store from './DateIconStore';

const Wrapper = styled.div`
	cursor: pointer;

	&.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
`;

const DateIcon = React.forwardRef((props, ref) => {
	const { todaysCount, markSeen, hasSeen } = Store.useValue();
	const available = !useService()
		.getCollection('Calendars')
		?.getLink('events');
	const disabled = !available
		? null
		: {
				disabled: true,
				onClick: null,
		  };

	return (
		<Wrapper
			ref={ref}
			className="nti-calendar-date-icon-container"
			onClick={() => {
				markSeen();
			}}
			{...disabled}
		>
			<DateTime.DateIcon
				{...props}
				{...disabled}
				viewed={hasSeen}
				badge={todaysCount || 0}
			/>
		</Wrapper>
	);
});

DateIcon.propTypes = {
	date: PropTypes.object,
};

export default Store.compose(
	React.forwardRef((props, ref) => (
		<Suspense fallback={<div />}>
			<DateIcon {...props} ref={ref} />
		</Suspense>
	))
);
