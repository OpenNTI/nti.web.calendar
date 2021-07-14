import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Prompt, useReducerState } from '@nti/web-commons';

import Store from '../../calendar/Store';

import t from './strings';
import { Body } from './Body';
import { Header } from './Header';
import { Registration } from './Registration';

//#region 🎨 & 🛠️

const { SaveCancel } = Prompt;

const createScope = t.scoped('create');
const editScope = t.scoped('editor');
const editableScope = t.scoped('editable');

export function getStateFromEvent(event) {
	let defaultStartDate = new Date();

	defaultStartDate.setSeconds(0);
	defaultStartDate.setMinutes(defaultStartDate.getMinutes() + 59);
	defaultStartDate.setMinutes(0);

	// check icon for null string.
	// When we remove an icon and PUT to the record,
	// it won't be null, but "null" ([JG]: Really? Sounds fixable...)
	const has = x => x != null && x !== 'null';

	return {
		event,
		startDate: event?.getStartTime() ?? defaultStartDate,
		endDate:
			event?.getEndTime() ??
			new Date(defaultStartDate.getTime() + 60 * 60 * 1000),
		title: event?.title,
		description: event?.description,
		location: event?.location,
		img: has(event?.icon) && { src: event.icon },
	};
}

const sizing = css`
	dialog & {
		height: 100%;
		max-width: min(765px, 100vw);
	}
`;

export const Contents = styled.div`
	overflow-y: auto;
	padding: 0 40px;
	@media (--respond-to-handhelds) {
		padding: 0 10px;
	}
`;

export const ErrorMessage = styled.div`
	background-color: var(--primary-red);
	color: white;
	text-align: center;
	min-height: 40px;
	line-height: 40px;
	font-size: 14px;
`;

export const EditorFrame = styled.div`
	max-width: calc(100vw);
	padding-top: 10px;

	&.saving {
		opacity: 0.5;
		pointer-events: none;
	}
`;

function getMatchingCalendar(event, availableCalendars) {
	return (
		event &&
		availableCalendars?.filter(c => c.getID() === event.ContainerId)?.[0]
	);
}

function getScope({ editable, create }, readOnly) {
	return readOnly
		? editable
			? editableScope
			: t
		: create
		? createScope
		: editScope;
}

//#endregion

EventEditor.propTypes = {
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

function EventEditor(props) {
	const {
		event,
		availableCalendars,
		create,
		onCancel,
		onDismiss,
		onSuccess,
		editable,

		createEvent,
		createError,
		saving,
		dialog = true,
		controls = true,
		className: css,
	} = props;

	const [state, setState, , change] = useReducerState({});

	useEffect(() => {
		const calendarFromEvent = getMatchingCalendar(
			event,
			availableCalendars
		);

		setState({
			readOnly: !create,
			calendar: calendarFromEvent || availableCalendars?.[0],
			availableCalendars,
			...getStateFromEvent(event),
		});
	}, [event, availableCalendars, create]);

	const cancel = () => {
		if (!state.readOnly && !create) {
			setState({ readOnly: true });

			return;
		}

		onCancel?.();
		onDismiss?.();
	};

	const onSave = async () => {
		if (state.readOnly) {
			if (editable) {
				setState({
					readOnly: false,
				});

				return;
			}

			return cancel();
		}

		const calendarEvent = await createEvent(
			state.calendar,
			event,
			state.title,
			state.description,
			state.location,
			state.startDate,
			state.endDate,
			state.imgBlob
		);

		if (!calendarEvent) return;

		if (create) {
			onSuccess?.(calendarEvent);
		} else {
			setState({
				readOnly: true,
				...getStateFromEvent(calendarEvent),
			});
		}
	};

	const Cmp = !controls ? 'div' : SaveCancel;
	const frameProps = !controls
		? null
		: {
				getString: getScope(props, state.readOnly),
				onCancel: cancel,
				onSave,
				disableSave: saving || (!state.calendar && !state.readOnly),
				dialog,
		  };

	return (
		<Cmp className={cx(sizing, css)} {...frameProps}>
			<Registration event={event} />
			<EditorFrame {...{ saving }} className="calendar-event-editor">
				{createError && <ErrorMessage>{createError}</ErrorMessage>}
				<Contents>
					<Header
						dialog={dialog}
						{...state}
						onDescriptionChange={change('description')}
						onTitleChange={change('title')}
						onImageChange={change('imgBlob')}
					/>
					<Body
						{...props}
						{...state}
						onCalendarSelect={change('calendar')}
						onEndDateChange={change('endDate')}
						onLocationChange={change('location')}
						onStartDateChange={change('startDate')}
					/>
				</Contents>
			</EditorFrame>
		</Cmp>
	);
}

export const Editor = Store.connect([
	'createEvent',
	'createError',
	'saving',
	'availableCalendars',
])(EventEditor);
