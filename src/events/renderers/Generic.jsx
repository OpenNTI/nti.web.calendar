import React from 'react';
import PropTypes from 'prop-types';

import { List, DateTime, Presentation, Text } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { Icon } from '../../calendar/Icon';
import { Layout } from '../components';

import Registry from './Registry';

//#region 🎨 paint
const Meta = styled.div`
	background-color: #fff;
	border-radius: 5px;
	padding: 5px 10px;
	min-height: 40px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	flex: 1 1 auto;
`;

const Title = styled(Text)`
	color: var(--primary-grey);
	font-size: 14px;
	font-weight: 600;
	hyphens: auto;
	word-break: break-word;
`;

const SubTitle = styled(List.SeparatedInline)`
	color: var(--tertiary-grey);
	font-size: 10px;
	font-weight: bold;
	letter-spacing: -0.21px;
	line-height: 14px;
`;
//#endregion

const t = scoped('calendar.events.generic.View', {
	dayIndex: 'Day %(count)s / %(total)s',
	allDay: 'ALL DAY',
});

const formatTime = x => DateTime.format(x, DateTime.TIME);

export default class GenericEvent extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			CatalogEntry: PropTypes.object,
			getStartTime: PropTypes.func.isRequired,
			getEndTime: PropTypes.func.isRequired,
			title: PropTypes.string.isRequired,
			icon: PropTypes.string,
		}),
		numberOfDays: PropTypes.number,
		day: PropTypes.number,
	};

	renderTime() {
		const { numberOfDays, day, item } = this.props;
		const isMultipleDay = numberOfDays > 1;
		const isLastDay = day + 1 === numberOfDays;
		const isFirstDay = day === 0;

		return (
			<div className="event-generic-time">
				{!isMultipleDay && (
					<>
						<time>{formatTime(item.getStartTime())}</time> -{' '}
						<time>{formatTime(item.getEndTime())}</time>
					</>
				)}
				{isFirstDay && isMultipleDay && (
					<time>STARTS AT {formatTime(item.getStartTime())}</time>
				)}
				{isLastDay && isMultipleDay && (
					<time>ENDS AT {formatTime(item.getEndTime())}</time>
				)}
			</div>
		);
	}

	render() {
		const {
			numberOfDays,
			day,
			item: { title, CatalogEntry },
		} = this.props;
		const showTime =
			(numberOfDays > 1 && (day === 0 || day + 1 === numberOfDays)) ||
			numberOfDays === 1;
		return (
			<Layout className="event-generic">
				<Presentation.Asset
					propName="url"
					contentPackage={CatalogEntry}
					type="thumb"
				>
					<Icon />
				</Presentation.Asset>
				<Meta className="event-generic-meta">
					<Title limitLines={2} className="event-generic-title">
						{title}
					</Title>
					<SubTitle className="event-generic-subtitle">
						{numberOfDays > 1 && (
							<div className="event-day-index">
								{t('dayIndex', {
									count: day + 1,
									total: numberOfDays,
								})}
							</div>
						)}
						{!showTime && t('allDay')}
						{showTime && this.renderTime()}
					</SubTitle>
				</Meta>
			</Layout>
		);
	}
}

Registry.register('application/vnd.nextthought.courseware.coursecalendarevent')(
	GenericEvent
);
