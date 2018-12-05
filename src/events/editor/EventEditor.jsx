import React from 'react';
import PropTypes from 'prop-types';
import {DialogButtons, DateTime, Input, Prompt} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {ImageUpload} from '@nti/web-whiteboard';
import {Connectors} from '@nti/lib-store';
import cx from 'classnames';

import DateInput from './DateInput';

const {Dialog} = Prompt;

const t = scoped('calendar.editor.Editor', {
	eventTitle: 'Event Title',
	eventDescription: 'Description...',
	eventLocation: 'Location',
	calendar: 'Calendar',
	save: 'Save',
	cancel: 'Cancel',
	close: 'Close',
	edit: 'Edit',
	location: 'Location',
	datesTimes: 'Dates & Times',
	delete: 'Delete',
	event: 'Event',
	start: 'Start',
	end: 'End',
	searchCalendar: 'Search Calendars'
});

export default
@Connectors.Any.connect(['createEvent', 'createError', 'saving', 'getAvailableCalendars'])
class EventEditor extends React.Component {
	static propTypes = {
		calendar: PropTypes.object.isRequired,
		event: PropTypes.object,
		onCancel: PropTypes.func,
		onSuccess: PropTypes.func,
		createEvent: PropTypes.func,
		createError: PropTypes.string,
		saving: PropTypes.bool,
		editable: PropTypes.bool,
		create: PropTypes.bool,
		getAvailableCalendars: PropTypes.func
	}

	state = {}

	constructor (props) {
		super(props);

		const {event, getAvailableCalendars, create} = props;

		let defaultStartDate = new Date();
		defaultStartDate.setSeconds(0);
		defaultStartDate.setMinutes(defaultStartDate.getMinutes() + 59);
		defaultStartDate.setMinutes(0);

		const availableCalendars = getAvailableCalendars();
		const calendarFromEvent = event && this.getMatchingCalendar(event, availableCalendars);

		this.state = {
			viewMode: !create,
			startDate: event ? event.getStartTime() : defaultStartDate,
			endDate: event ? event.getEndTime() : new Date(defaultStartDate.getTime() + (60 * 60 * 1000)),
			title: event && event.title,
			description: event && event.description,
			location: event && event.location,
			calendar: calendarFromEvent || availableCalendars[0],
			event: props.event,
			// check icon for null string.  if we remove an icon and PUT to the record, it won't be null, but "null"
			img: props.event && props.event.icon && props.event.icon !== 'null' && {src: props.event.icon},
			availableCalendars
		};
	}

	getMatchingCalendar (event, availableCalendars) {
		return availableCalendars.filter(c => {
			return c.getID() === event.ContainerId;
		})[0];
	}

	renderDateInfo () {
		const {startDate} = this.state;

		return (
			<div className="date">
				<div className="month">{DateTime.format(startDate, 'MMM')}</div>
				<div className="day">{DateTime.format(startDate, 'D')}</div>
			</div>
		);
	}

	renderEventInfo () {
		const {startDate, title, description, img, viewMode} = this.state;

		return (
			<div className="event-info">
				<div className="title">
					{
						viewMode
							? title
							: <Input.Text placeholder={t('eventTitle')} value={title} onChange={(val) => this.setState({title: val})} maxLength="140"/>
					}
				</div>
				<div className="time-info">
					<span className="date">{DateTime.format(startDate, 'dddd [at] hh:mm a z')}</span>
				</div>
				<div className="image-and-description">
					{
						viewMode
							? img && <img className="preview" src={img.src}/>
							: <ImageUpload img={img} onChange={imgBlob => this.setState({imgBlob})}/>
					}
					{
						viewMode
							? <div className="desc">{description}</div>
							: <Input.TextArea value={description} onChange={(val) => this.setState({description: val})} placeholder={t('eventDescription')}/>
					}
				</div>
			</div>
		);
	}

	onCalendarSelect = (calendar) => {
		this.setState({calendar});
	}

	renderCalendarSelect () {
		const { event } = this.props;
		const { availableCalendars, calendar } = this.state;

		return (
			<div className="input-section calendar">
				<div className="section-title">{t('calendar')}</div>
				<Input.Select onChange={this.onCalendarSelect} value={calendar} placeholder={t('searchCalendar')} disabled={!!event} searchable>
					{availableCalendars.map((choice, choiceIndex) => {
						return (
							<Input.Select.Option
								value={choice}
								key={choiceIndex}
								matches={(targetOption, term) => {
									const lowerTerm = term && term.toLowerCase();
									const catalogEntryTitle = (choice.CatalogEntry && choice.CatalogEntry.Title && choice.CatalogEntry.Title.toLowerCase()) || '';

									return choice.title && choice.title.toLowerCase().indexOf(lowerTerm) >= 0
										|| catalogEntryTitle.indexOf(lowerTerm) >= 0;
								}}>
								{(choice.CatalogEntry && choice.CatalogEntry.Title) || choice.title}
							</Input.Select.Option>
						);
					})}
				</Input.Select>
			</div>
		);
	}

	renderLocation () {
		const {location, viewMode} = this.state;

		if(viewMode && !location) {
			return null;
		}

		return (
			<div className="input-section location">
				<div className="section-title">{t('location')}</div>
				{
					viewMode
						? <div className="name">{location}</div>
						: <Input.Text placeholder={t('eventLocation')} value={location} onChange={(val) => this.setState({location: val})} maxLength="140"/>
				}
			</div>
		);
	}

	renderDate (value, label, field) {
		const {viewMode} = this.state;

		if(viewMode) {
			return <div className="date-display">{DateTime.format(value, 'LLL')}</div>;
		}

		return <DateInput date={value} label={label} onChange={(val) => this.setState({[field]: val})}/>;
	}

	renderDateInputs () {
		return (
			<div className="input-section times">
				<div className="section-title">{t('datesTimes')}</div>
				<div className="dates">
					{this.renderDate(this.state.startDate, t('start'), 'startDate')}
					{this.renderDate(this.state.endDate, t('end'), 'endDate')}
				</div>
			</div>
		);
	}

	renderOtherInfo () {
		const {viewMode} = this.state;

		return (
			<div className="other-info">
				{!viewMode && this.renderCalendarSelect()}
				{this.renderLocation()}
				{this.renderDateInputs()}
			</div>
		);
	}

	onCancel = () => {
		const {onCancel} = this.props;

		if(onCancel) {
			onCancel();
		}
	}

	onSave = async () => {
		const {event, createEvent, onSuccess, create} = this.props;
		const {calendar, title, description, location, startDate, endDate, imgBlob} = this.state;

		const calendarEvent = await createEvent(calendar, event, title, description, location, startDate, endDate, imgBlob);

		if(create && onSuccess) {
			onSuccess(calendarEvent);
		}

		if(!create) {
			this.setState({viewMode: true});
		}
	}

	renderButtons () {
		const {saving, editable} = this.props;
		const {viewMode} = this.state;

		if(viewMode) {
			let buttons = [
				{
					label: t('close'),
					onClick: this.onCancel,
				}
			];

			if(editable) {
				buttons.push({
					label: t('edit'),
					onClick: () => { this.setState({viewMode: false});}
				});
			}

			return (
				<DialogButtons
					buttons={buttons}
				/>
			);
		}


		return (
			<DialogButtons
				buttons={[
					{
						label: t('cancel'),
						onClick: this.onCancel,
					},
					{
						label: t('save'),
						disabled: saving,
						onClick: this.onSave
					}
				]}
			/>
		);
	}

	renderError () {
		const {createError} = this.props;

		if(createError) {
			return <div className="error">{createError}</div>;
		}
	}

	render () {
		const {saving} = this.props;
		const {viewMode} = this.state;
		const cls = cx('calendar-event-editor', {saving, 'view-only': viewMode});

		return (
			<Dialog>
				<div className={cls}>
					{this.renderError()}
					<div className="contents">
						<div className="header-info">
							{this.renderDateInfo()}
							{this.renderEventInfo()}
						</div>
						{this.renderOtherInfo()}
					</div>
					{this.renderButtons()}
				</div>
			</Dialog>
		);
	}
}
