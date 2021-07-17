import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Models } from '@nti/lib-interfaces';
import { Button, DateTime, Text } from '@nti/web-commons';

//#region Parts

const DateIcon = styled(DateTime.DateIcon)`
	> :global(.month) {
		font-size: 8px;
	}
	> :global(.day) {
		font-size: 20px;
	}
`;

const Time = props => (
	<DateTime
		{...props}
		as={Text.Label}
		format={DateTime.MONTH_ABBR_DAY_YEAR_TIME}
		className={cx(
			props.className,
			css`
				color: var(--tertiary-grey);

				/* increase specificity 3x */
				&&& {
					font-size: 0.5rem; /* 8px */
					text-transform: none;
				}
			`
		)}
	/>
);

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

	& > li:not(:first-child) {
		margin-left: 1rem;
	}
`;

const Block = styled.div`
	display: flex;
	flex: 1 1 auto;
	align-items: center;

	& > :not(:first-child) {
		margin: 0 0 0 1em;
	}

	&.column {
		flex-direction: column;
		align-items: stretch;

		& > :not(:first-child) {
			margin: 0;
		}
	}
`;

const Title = styled(Text)`
	line-height: 1;
	font-weight: 600;
	font-size: 0.875rem; /* 14px */
`;

const InfoMapper = props => ({
	...props,
	inverted: true,
	children: <i className="icon-info" />,
});

const InfoToggle = styled(Button).attrs(InfoMapper)`
	box-shadow: none !important;
	padding: 0 0.5em;
	vertical-align: middle;
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
 * @returns {React.ReactElement}
 */
export function DetailHeader({ event, className, detailToggle = true }) {
	return (
		<Block className={className}>
			<DateIcon date={event.getStartTime()} minimal />
			<Block column>
				<Title>
					{event.title}
					{detailToggle && event.hasLink('list-attendance') && (
						<InfoToggle
							onClick={() => event.emit('show-details')}
						/>
					)}
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