import React from 'react';
import cx from 'classnames';

import { DateTime, Input, Text } from '@nti/web-commons';
import { ImageUpload } from '@nti/web-whiteboard';

import t from './strings';

export function Header({
	dialog,
	event,
	startDate,
	title,
	description,
	img,
	readOnly,
	onTitleChange,
	onDescriptionChange,
	onImageChange,
}) {
	const suppressDuplicateInfoFromCustomHeader =
		dialog || (event?.hasLink('list-attendance') && readOnly);
	return (
		<div
			className={cx('header-info', {
				padded: !suppressDuplicateInfoFromCustomHeader,
			})}
		>
			<DateInfo
				date={startDate}
				hidden={suppressDuplicateInfoFromCustomHeader}
			/>
			<div className="event-info">
				<div
					className="title"
					hidden={suppressDuplicateInfoFromCustomHeader}
				>
					{readOnly ? (
						<Text.Base linkify>{title}</Text.Base>
					) : (
						<Input.Text
							placeholder={t('eventTitle')}
							value={title}
							onChange={onTitleChange}
							maxLength="140"
						/>
					)}
				</div>
				<div
					className="time-info"
					hidden={suppressDuplicateInfoFromCustomHeader}
				>
					<DateTime
						className="date"
						date={startDate}
						format={DateTime.WEEKDAY_AT_TIME_PADDED_WITH_ZONE}
					/>
				</div>
				<div className="image-and-description">
					{readOnly ? (
						img && <img className="preview" src={img.src} />
					) : (
						<ImageUpload img={img} onChange={onImageChange} />
					)}
					{readOnly ? (
						<Text.Base className="desc" linkify>
							{description}
						</Text.Base>
					) : (
						<Input.TextArea
							value={description}
							onChange={onDescriptionChange}
							placeholder={t('eventDescription')}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

function DateInfo({ date, ...props }) {
	return (
		<div className="date" {...props}>
			<DateTime
				as="div"
				className="month"
				date={date}
				format={DateTime.MONTH_ABBR}
			/>
			<DateTime
				as="div"
				className="day"
				date={date}
				format={DateTime.DAY_OF_THE_MONTH}
			/>
		</div>
	);
}
