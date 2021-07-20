import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Router } from '@nti/web-routing';
import { useReducerState, Prompt } from '@nti/web-commons';

import Store from '../../calendar/Store';
import { DetailHeader } from '../DetailHeader';

import { Body } from './Body';
import { Header } from './Header';
import { Registration } from './Registration';
import { getScope } from './strings';

//#region 🎨 & 🛠️

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
		img: (has(event?.icon) && { src: event.icon }) || null,
	};
}

const Frame = styled.div`
	& > i:global(.icon-close) {
		display: none;
	}

	& dialog & {
		max-width: min(765px, 100vw);
		box-shadow: 0 0 3px 0 black;

		/* max-height: calc(100vh - var(--navigation-top, 0)); */
	}
`;

const SaveCancel = styled(Prompt.SaveCancel)`
	[panel-title-bar] {
		padding: 15px 40px;
		padding-right: 10px;
		@media (--respond-to-handhelds) {
			padding: 15px 10px;
		}

		& > i {
			width: 40px;
			text-align: center;

			@media (--respond-to-handhelds) {
				width: 30px;
				text-align: left;
			}
		}
	}
`;

export const Contents = styled.div`
	overflow-y: auto;
	padding: 0 40px;
	@media (--respond-to-handhelds) {
		padding: 0 10px;
	}
`;

const DetailHeader2 = styled(DetailHeader)`
	padding-top: 10px;
`;

const Titled = props => (
	<>
		<Contents>
			<DetailHeader2 event={props.event} detailToggle={false} />
		</Contents>
		{props.children}
	</>
);

function Framer({ calendar, controls, ...props }) {
	const { saving } = Store.useValue();
	const customTitle = props.mode === 'view'; // && props.event?.hasLink('list-attendance');

	const frameIt = props.dialog || controls;

	return (
		<Frame
			{...props}
			as={frameIt ? SaveCancel : Titled}
			title={
				!customTitle ? undefined : (
					<DetailHeader event={props.event} detailToggle={false} />
				)
			}
			disableSave={saving || (props.mode === 'edit' && !calendar)}
		/>
	);
}

export const ErrorMessage = styled.div`
	background-color: var(--primary-red);
	color: white;
	text-align: center;
	min-height: 40px;
	line-height: 40px;
	font-size: 14px;
`;

export const EditorFrame = styled.div`
	/* max-width: 100vw; */
	padding-top: 10px;

	&.saving {
		opacity: 0.5;
		pointer-events: none;
	}
`;

function getCalendar(event, availableCalendars) {
	return (
		(event &&
			availableCalendars?.filter(
				c => c.getID() === event.ContainerId
			)?.[0]) ||
		availableCalendars?.[0]
	);
}

const getInitialMode = props => (props?.create ? 'edit' : 'view');

//#endregion

//#region main

function EventEditor(props) {
	const {
		event,
		create,
		onCancel,
		onDismiss,
		onSuccess,
		editable,

		dialog,
	} = props;

	const router = Router.useRouter();
	const { createEvent, createError, saving, availableCalendars } =
		Store.useValue();

	const [state, setState, , change] = useReducerState({});

	useEffect(() => {
		const calendar = getCalendar(event, availableCalendars);

		setState({
			calendar,
			availableCalendars,
			mode: getInitialMode(props),
			...getStateFromEvent(event),
		});
	}, [event, availableCalendars]);

	const t = getScope(props, state.mode);

	const cancel = () => {
		if (state.mode === 'edit' && getInitialMode(props) === 'view') {
			setState({ mode: 'view' });

			return;
		}

		onCancel?.();
		onDismiss?.();
	};

	const save = async () => {
		if (state.mode === 'view') {
			if (editable) {
				setState({
					mode: 'edit',
				});

				return;
			}

			return router.routeTo.object(event);
			// return cancel();
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
				mode: 'view',
				...getStateFromEvent(calendarEvent),
			});
		}
	};

	return (
		<Framer
			{...props}
			{...state}
			getString={t}
			onSave={save}
			onCancel={cancel}
		>
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
		</Framer>
	);
}

EventEditor.defaultProps = {
	dialog: true,
};

EventEditor.propTypes = {
	event: PropTypes.object,
	disableSave: PropTypes.func,
	onCancel: PropTypes.func,
	onDismiss: PropTypes.func,
	onSuccess: PropTypes.func,
	createEvent: PropTypes.func,
	createError: PropTypes.string,
	saving: PropTypes.bool,
	editable: PropTypes.bool,
	create: PropTypes.bool,
	controls: PropTypes.bool,
	dialog: PropTypes.bool,
	availableCalendars: PropTypes.array,
};

export const Editor = Store.compose(EventEditor);

//#endregion
