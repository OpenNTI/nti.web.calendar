import React from 'react';
import PropTypes from 'prop-types';
import {Presentation, Icons, Text} from '@nti/web-commons';

const getTitle = (calendar) => calendar.title;
const getSubtitle = (calendar) => calendar.CatalogEntry?.ProviderUniqueID;
const getIcon = (calendar) => {
	if (calendar.CatalogEntry) {
		return (
			<Presentation.Asset contentPackage={calendar.CatalogEntry} type="thumb">
				<img />
			</Presentation.Asset>
		);
	}

	return null;
};

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 5px 0;
	cursor: pointer;
`;

const Meta = styled.div`
	flex: 1 1 auto;
	padding-left: 10px;
`;

const IconContainer = styled.div`
	position: relative;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	overflow: hidden;

	& img {
		width: 100%;
		height: auto;
	}

	&.selected img {
		opacity: 0.55;
	}

	&.selected {
		background-color: black;

	}
`;

const IconMask = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: white;
`;

const Title = styled(Text.Base)`
	display: block;
	color: var(--primary-grey);
	font-size: 0.875rem;
	line-height: 1.3;
	font-weight: 600;
	word-break: break-all;
`;

const SubTitle = styled(Text.Base)`
	display: block;
	color: var(--tertiary-grey);
	font-size: 0.625rem;
	font-weight: bold;
	text-transform: uppercase;
`;

CalendarListItem.propTypes = {
	calendar: PropTypes.shape({
		CatalogEntry: PropTypes.shape({
			ProviderUniqueID: PropTypes.string
		}),
		title: PropTypes.string
	}),

	selected: PropTypes.bool,
	onClick: PropTypes.func
};
export default function CalendarListItem ({calendar, selected, onClick}) {
	const doClick = React.useCallback(() => onClick(calendar), [calendar, onClick]);

	return (
		<Container onClick={doClick}>
			<IconContainer selected={selected}>
				{getIcon(calendar)}
				{selected && (
					<IconMask>
						<Icons.Check />
					</IconMask>
				)}
			</IconContainer>
			<Meta>
				<Title>{getTitle(calendar)}</Title>
				<SubTitle>{getSubtitle(calendar)}</SubTitle>
			</Meta>
		</Container>
	);
}
