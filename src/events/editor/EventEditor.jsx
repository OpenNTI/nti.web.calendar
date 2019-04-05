import React from 'react';
import PropTypes from 'prop-types';
import {DateTime, Input, Prompt} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {ImageUpload} from '@nti/web-whiteboard';
import cx from 'classnames';

import Store from '../../calendar/Store';

import DateInput from './DateInput';

const {SaveCancel} = Prompt;

const t = scoped('calendar.editor.Editor', {
	eventTitle: 'Event Title',
	eventDescription: 'Description...',
	eventLocation: 'Location',
	calendar: 'Calendar',
	save: 'Done',
	cancel: 'Cancel',
	close: 'Close',
	edit: 'Edit',
	location: 'Location',
	datesTimes: 'Dates & Times',
	delete: 'Delete',
	event: 'Event',
	start: 'Start',
	end: 'End',
	title: 'View Event',
	searchCalendar: 'Search Calendars'
});


const createScope = scoped('calendar.editor.Editor.create', {
	title: 'Create Event',
	save: 'Create',
	cancel: 'Cancel'
});
const editScope = scoped('calendar.editor.Editor.edit', {
	title: 'Edit Event',
	save: 'Save',
	cancel: 'Cancel'
});
const editableScope = scoped('calendar.editor.Editor.editable', {
	title: 'View Event',
	save: 'Edit',
	cancel: 'Cancel'
});

function getStateFromEvent (event) {
	let defaultStartDate = new Date();

	defaultStartDate.setSeconds(0);
	defaultStartDate.setMinutes(defaultStartDate.getMinutes() + 59);
	defaultStartDate.setMinutes(0);

	return {
		startDate: event ? event.getStartTime() : defaultStartDate,
		endDate: event ? event.getEndTime() : new Date(defaultStartDate.getTime() + (60 * 60 * 1000)),
		title: event && event.title,
		description: event && event.description,
		location: event && event.location,
		// check icon for null string.  if we remove an icon and PUT to the record, it won't be null, but "null"
		img: event && event.icon && event.icon !== 'null' && {src: event.icon},
	};
}

export default
@Store.connect(['createEvent', 'createError', 'saving', 'availableCalendars'])
class EventEditor extends React.Component {
	static propTypes = {
		event: PropTypes.object,
		onCancel: PropTypes.func,
		onDismiss: PropTypes.func,
		onSuccess: PropTypes.func,
		createEvent: PropTypes.func,
		createError: PropTypes.string,
		saving: PropTypes.bool,
		editable: PropTypes.bool,
		create: PropTypes.bool,
		nonDialog: PropTypes.bool,
		noControls: PropTypes.bool,
		availableCalendars: PropTypes.array
	}

	state = {}

	constructor (props) {
		super(props);

		const {event, availableCalendars, create} = props;

		const calendarFromEvent = event && this.getMatchingCalendar(event, availableCalendars);

		this.state = {
			viewMode: !create,
			calendar: calendarFromEvent || (availableCalendars && availableCalendars[0]),
			event: props.event,
			availableCalendars,
			...getStateFromEvent(event)
		};
	}

	componentDidUpdate (oldProps) {
		if(oldProps.availableCalendars !== this.props.availableCalendars) {
			const {event, availableCalendars} = this.props;

			const calendarFromEvent = event && this.getMatchingCalendar(event, availableCalendars);

			this.setState({
				calendar: calendarFromEvent || availableCalendars[0],
			});
		}
	}

	getMatchingCalendar (event, availableCalendars) {
		return (availableCalendars || []).filter(c => {
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
		const { event, availableCalendars } = this.props;
		const { calendar } = this.state;

		return (
			<div className="input-section calendar">
				<div className="section-title">{t('calendar')}</div>
				<Input.Select onChange={this.onCalendarSelect} value={calendar} placeholder={t('searchCalendar')} disabled={!!event} searchable>
					{(availableCalendars || []).map((choice, choiceIndex) => {
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
		const {onCancel, onDismiss, create} = this.props;
		const {viewMode} = this.state;

		if(!viewMode && !create) {
			this.setState({viewMode: true});

			return;
		}

		if(onCancel) {
			onCancel();
		}

		if(onDismiss) {
			onDismiss();
		}
	}

	onSave = async () => {
		const {event, createEvent, onSuccess, editable, create} = this.props;
		const {viewMode, calendar, title, description, location, startDate, endDate, imgBlob} = this.state;

		if(viewMode) {
			if(editable) {
				this.setState({
					viewMode: false
				});

				return;
			}

			return this.onCancel();
		}

		const calendarEvent = await createEvent(calendar, event, title, description, location, startDate, endDate, imgBlob);

		if(create && onSuccess && calendarEvent) {
			onSuccess(calendarEvent);
		}

		if(!create && calendarEvent) {
			this.setState({
				viewMode: true,
				...getStateFromEvent(calendarEvent)
			});
		}
	}


	renderError () {
		const {createError} = this.props;

		if(createError) {
			return <div className="error">{createError}</div>;
		}
	}

	getScope () {
		const {editable, create} = this.props;
		const {viewMode} = this.state;

		if(viewMode) {
			if(editable) {
				return editableScope;
			}

			return t;
		}
		else {
			if(create) {
				return createScope;
			}
			else {
				return editScope;
			}
		}
	}

	renderEvent () {
		const {
			props: {saving},
			state: {viewMode}
		} = this;

		const cls = cx('calendar-event-editor', {saving, 'view-only': viewMode});

		return (
			<div className={cls}>
				{this.renderError()}
				<div className="contents">
					<div className="header-info">
						{this.renderDateInfo()}
						{this.renderEventInfo()}
					</div>
					{this.renderOtherInfo()}
				</div>
			</div>
		);
	}

	render () {
		const {saving, nonDialog, noControls} = this.props;
		const {viewMode, calendar} = this.state;
		const className = 'event-view-dialog';

		const Cmp = noControls ? 'div' : SaveCancel;
		const props = noControls ? {className} : {
			className,
			getString: this.getScope(),
			onCancel: this.onCancel,
			onSave: this.onSave,
			disableSave: saving || (!calendar && !viewMode),
			nonDialog
		};

		return (
			<Cmp {...props}>
				{this.renderEvent()}
			</Cmp>
		);
	}
}
