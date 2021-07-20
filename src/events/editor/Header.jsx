import React from 'react';

import { DateTime, Input, Text } from '@nti/web-commons';
import { ImageUpload } from '@nti/web-whiteboard';

import t from './strings';

//#region 🎨

const Container = styled.div`
	display: flex;

	/* box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15); */

	&.padded {
		padding-top: 30px;
	}

	@media (--respond-to-handhelds) {
		display: block;
	}
`;

const EventInfo = styled.div`
	margin-bottom: 16px;
	width: 100%;
`;

const EventTitle = styled.div`
	font-size: 1.125rem;
	line-height: 1.3;
	color: black;
	text-align: left;
	margin-bottom: 5px;

	input {
		width: 100%;
		background-color: white;
		font-size: 18px;
		height: 40px;
		color: var(--primary-grey);

		&:focus {
			box-shadow: 0 0 3px 1px var(--primary-blue);
		}
	}
`;

const EventTime = styled.div`
	line-height: 14px;
	font-size: 10px;
	font-weight: bold;
	text-transform: uppercase;
	color: var(--tertiary-grey);
	margin-bottom: 16px;
	text-align: left;

	& > span {
		margin-right: 2px;
	}
`;

const ImageAndDescription = styled.div`
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 10px;
`;

const Preview = styled.img`
	max-width: 100%;
	height: auto;
`;

const EventImageEditor = styled(ImageUpload)`
	max-width: 200px;

	& :global(.error) {
		background-color: white;
		color: var(--primary-red);
	}
`;

const DescriptionEditor = styled(Input.TextArea)`
	width: 100%;
	max-width: calc(100% - 210px);
	min-width: 250px;
	background-color: white;

	&:focus-within {
		box-shadow: 0 0 3px 1px var(--primary-blue);
	}

	@media (--respond-to-handhelds) {
		width: 100%;
		max-width: 100%;
	}
`;

const Description = styled(Text.Base).attrs({
	linkify: true,
})`
	color: var(--secondary-grey);
	text-align: left;
`;

//#endregion

export function Header({
	startDate,
	title,
	description,
	img,
	mode,
	onTitleChange,
	onDescriptionChange,
	onImageChange,
}) {
	const viewingMode = mode === 'view';
	return (
		<Container padded={!viewingMode} className="header-info">
			<DateInfo date={startDate} hidden={viewingMode} />
			<EventInfo>
				<EventTitle hidden={viewingMode}>
					{viewingMode ? (
						<Text.Base linkify>{title}</Text.Base>
					) : (
						<Input.Text
							placeholder={t('eventTitle')}
							value={title}
							onChange={onTitleChange}
							maxLength="140"
						/>
					)}
				</EventTitle>
				<EventTime hidden={viewingMode}>
					<DateTime
						className="date"
						date={startDate}
						format={DateTime.WEEKDAY_AT_TIME_PADDED_WITH_ZONE}
					/>
				</EventTime>
				<ImageAndDescription>
					{viewingMode ? (
						img?.src && <Preview src={img?.src} />
					) : (
						<EventImageEditor img={img} onChange={onImageChange} />
					)}
					{viewingMode ? (
						<Description>{description}</Description>
					) : (
						<DescriptionEditor
							value={description}
							onChange={onDescriptionChange}
							placeholder={t('eventDescription')}
						/>
					)}
				</ImageAndDescription>
			</EventInfo>
		</Container>
	);
}

//#region Date Icon

const DateIcon = styled.div`
	min-width: 80px;
	text-align: center;
	margin-left: -40px;

	@media (--respond-to-handhelds) {
		text-align: left;
		margin-left: 0;
	}
`;

const DateIconMonth = styled(DateTime).attrs({
	as: 'div',
	format: DateTime.MONTH_ABBR,
})`
	text-transform: uppercase;
	color: var(--primary-red);
	font-weight: bold;
	font-size: 10px;
	line-height: 14px;

	.day {
		font-size: 28px;
		color: var(--primary-grey);
	}
`;

const DateIconDay = styled(DateTime).attrs({
	as: 'div',
	format: DateTime.DAY_OF_THE_MONTH,
})`
	font-size: 28px;
	color: var(--primary-grey);
`;

function DateInfo({ date, ...props }) {
	return (
		<DateIcon className="date" {...props}>
			<DateIconMonth className="month" date={date} />
			<DateIconDay className="day" date={date} />
		</DateIcon>
	);
}

//#endregion
