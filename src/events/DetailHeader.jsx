import React from 'react';
import PropTypes from 'prop-types';

import { Models } from '@nti/lib-interfaces';
import { DateTime, Text } from '@nti/web-commons';
import { Button } from '@nti/web-core';

//#region Parts

const DateIcon = styled(DateTime.DateIcon)`
	> :global(.month) {
		font-size: 8px;
	}
	> :global(.day) {
		font-size: 20px;
	}
`;

const DTLabel = styled(DateTime).attrs({ as: Text.Label })`
	color: var(--tertiary-grey);
	white-space: nowrap;

	/* increase specificity 3x */
	&&& {
		font-size: 0.5rem; /* 8px */
		text-transform: none;
	}
`;

const Label = styled.span`
	display: inline-flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.5em;
`;

const Time = props => {
	return (
		<Label>
			<DTLabel {...props} format={DateTime.MONTH_ABBR_DAY_YEAR} />
			<DTLabel {...props} format={DateTime.TIME} />
		</Label>
	);
};

const WrapChildren = props => ({
	...props,
	children: React.Children.map(props.children, child =>
		React.createElement('li', { key: child.key }, child)
	),
});

const List = styled('ul').attrs(WrapChildren)`
	font-size: 0.5rem;
	list-style: none;
	line-height: 1;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 0;
	margin: 0;
	gap: 15px;

	@media (--respond-to-handhelds) {
		gap: 10px;
	}

	> li {
		flex: 0 1 50%;
		max-width: fit-content;
	}
`;

const Block = styled.div`
	/* being placed in a flex container */
	flex: 0 1 auto;
	[panel-title-bar] & {
		flex: 1 1 auto;
	}

	/* normal stuff */
	display: flex;
	align-items: center;
	gap: 10px;
	text-align: left;
	width: 100%;
	overflow: hidden;

	&.column {
		flex-direction: column;
		align-items: stretch;
		gap: 5px;
	}
`;

const Title = styled(Text)`
	line-height: 1.1;
	font-weight: 600;
	font-size: 0.875rem; /* 14px */

	&.link {
		cursor: pointer;
	}
`;

const InfoMapper = props => ({
	...props,
	inverted: true,
	children: <i className="icon-info" />,
});

const InfoToggle = styled(Button).attrs(InfoMapper)`
	&& {
		box-shadow: none !important;
		padding: 0 0.5em;
		vertical-align: middle;
	}
`;

//#endregion

//#region Registration & Meta

/**
 * @typedef HeadingProps
 * @property {Models.calendar.BaseEvent} event - Event Reference
 */
DetailHeader.propTypes = {
	event: PropTypes.instanceOf(Models.calendar.BaseEvent).isRequired,
	detailToggle: PropTypes.bool,
};
//#endregion

//#region Main Component

/**
 * @param {HeadingProps} props
 * @returns {JSX.Element}
 */
export function DetailHeader({ event, className, detailToggle = true }) {
	const link = (detailToggle && event.hasLink('list-attendance')) || null;
	const toggle = link
		? e => (e.stopPropagation(), event.emit('show-details'))
		: null;
	return (
		<Block className={className} event-details-header="true">
			<DateIcon date={event.getStartTime()} minimal />
			<Block column>
				<Title limitLines={1} link={link} onClick={toggle}>
					{event.title}
					{link && <InfoToggle onClick={toggle} />}
				</Title>

				<List>
					<Time date={event.getStartTime()} />
					<Time date={event.getEndTime()} />
				</List>
			</Block>
		</Block>
	);
}
//#endregion
