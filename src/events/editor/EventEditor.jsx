import './EventEditor.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { decorate } from '@nti/lib-commons';
import { Prompt } from '@nti/web-commons';

import Store from '../../calendar/Store';

import t from './strings';
import { Body } from './Body';
import { Header } from './Header';

const { SaveCancel } = Prompt;

const createScope = t.scoped('create');
const editScope = t.scoped('editor');
const editableScope = t.scoped('editable');

function getStateFromEvent(event) {
	let defaultStartDate = new Date();

	defaultStartDate.setSeconds(0);
	defaultStartDate.setMinutes(defaultStartDate.getMinutes() + 59);
	defaultStartDate.setMinutes(0);

	return {
		startDate: event ? event.getStartTime() : defaultStartDate,
		endDate: event
			? event.getEndTime()
			: new Date(defaultStartDate.getTime() + 60 * 60 * 1000),
		title: event && event.title,
		description: event && event.description,
		location: event && event.location,
		// check icon for null string.  if we remove an icon and PUT to the record, it won't be null, but "null"
		img: event &&
			event.icon &&
			event.icon !== 'null' && { src: event.icon },
	};
}

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
		dialog: PropTypes.bool,
		controls: PropTypes.bool,
		availableCalendars: PropTypes.array,
	};

	state = {};

	constructor(props) {
		super(props);

		const { event, availableCalendars, create } = props;

		const calendarFromEvent =
			event && this.getMatchingCalendar(event, availableCalendars);

		this.state = {
			readOnly: !create,
			calendar:
				calendarFromEvent ||
				(availableCalendars && availableCalendars[0]),
			event: props.event,
			availableCalendars,
			...getStateFromEvent(event),
		};
	}

	componentDidUpdate({ availableCalendars: prevCals, event: prevEvent }) {
		const { availableCalendars, event } = this.props;
		let state = null;

		if (event !== prevEvent) {
			state = { ...getStateFromEvent(event) };
		}

		if (prevCals !== availableCalendars) {
			const calendarFromEvent =
				event && this.getMatchingCalendar(event, availableCalendars);

			state = state || {};
			state.calendar = calendarFromEvent || availableCalendars[0];
		}

		if (state) {
			this.setState(state);
		}
	}

	getMatchingCalendar(event, availableCalendars) {
		return (availableCalendars || []).filter(c => {
			return c.getID() === event.ContainerId;
		})[0];
	}

	onCalendarSelect = calendar => {
		this.setState({ calendar });
	};

	onCancel = () => {
		const { onCancel, onDismiss, create } = this.props;
		const { readOnly } = this.state;

		if (!readOnly && !create) {
			this.setState({ readOnly: true });

			return;
		}

		if (onCancel) {
			onCancel();
		}

		if (onDismiss) {
			onDismiss();
		}
	};

	onSave = async () => {
		const { event, createEvent, onSuccess, editable, create } = this.props;
		const {
			readOnly,
			calendar,
			title,
			description,
			location,
			startDate,
			endDate,
			imgBlob,
		} = this.state;

		if (readOnly) {
			if (editable) {
				this.setState({
					readOnly: false,
				});

				return;
			}

			return this.onCancel();
		}

		const calendarEvent = await createEvent(
			calendar,
			event,
			title,
			description,
			location,
			startDate,
			endDate,
			imgBlob
		);

		if (create && onSuccess && calendarEvent) {
			onSuccess(calendarEvent);
		}

		if (!create && calendarEvent) {
			this.setState({
				readOnly: true,
				...getStateFromEvent(calendarEvent),
			});
		}
	};

	getScope() {
		const { editable, create } = this.props;
		const { readOnly } = this.state;

		if (readOnly) {
			if (editable) {
				return editableScope;
			}

			return t;
		} else {
			if (create) {
				return createScope;
			} else {
				return editScope;
			}
		}
	}

	render() {
		const {
			createError,
			saving,
			dialog = true,
			controls = true,
			className: css,
		} = this.props;
		const { readOnly, calendar } = this.state;
		const className = cx('event-view-dialog', css);

		const Cmp = !controls ? 'div' : SaveCancel;
		const props = !controls
			? null
			: {
					getString: this.getScope(),
					onCancel: this.onCancel,
					onSave: this.onSave,
					disableSave: saving || (!calendar && !readOnly),
					dialog,
			  };

		return (
			<Cmp className={className} {...props}>
				<div
					className={cx('calendar-event-editor', {
						saving,
						'view-only': readOnly,
					})}
				>
					{createError && <div className="error">{createError}</div>}
					<div className="contents">
						<Header
							{...this.state}
							onDescriptionChange={val =>
								this.setState({ description: val })
							}
							onTitleChange={val => this.setState({ title: val })}
							onImageChange={imgBlob =>
								this.setState({ imgBlob })
							}
						/>
						<Body
							{...this.props}
							{...this.state}
							onCalendarSelect={this.onCalendarSelect}
							onEndDateChange={x => this.setState({ endDate: x })}
							onLocationChange={val =>
								this.setState({ location: val })
							}
							onStartDateChange={x =>
								this.setState({ startDate: x })
							}
						/>
					</div>
				</div>
			</Cmp>
		);
	}
}

export default decorate(EventEditor, [
	Store.connect([
		'createEvent',
		'createError',
		'saving',
		'availableCalendars',
	]),
]);
