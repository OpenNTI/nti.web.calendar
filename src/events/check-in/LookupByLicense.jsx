import React, { Suspense, useReducer, useRef } from 'react';

import { useLink } from '@nti/web-commons';

import icon from './assets/qr_icon.svg';
import { CenteredBox as Box } from './parts/Containers';
import { Empty, Loading } from './parts/misc';
import { SubTitle } from './parts/Text';
import { useCodeScanner } from './parts/use-code-scanner';
import { Button } from './parts/Buttons';
import { EntryForm } from './EntryForm';
import { Success } from './Success';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').BaseEvent} Event */
/** @typedef {import('@nti/lib-interfaces/src/models/entities/User').default} User */
/** @typedef {() => void} Handler */
/**
 * @typedef {{
 * 	event: Event,
 *  returnView: Handler
 * }} LookupProps
 */

//#region 🎨 paint

const Image = styled('img').attrs({ src: icon })`
	width: 83px;
	height: 84px;
`;

const Input = styled('input').attrs({})`
	border: 0;
	padding: 4px 0;
	text-align: center;
	color: currentColor;
	border-bottom: 1px solid var(--primary-blue);
	font-size: 14px;
	line-height: 19px;
	width: 180px;

	&::placeholder {
		color: var(--tertiary-grey);
	}
`;

const Video = styled.video`
	--video-bottom-offset: 134px;

	position: absolute;
	left: 50%;
	transform: translate(-50%, 0);
	bottom: var(--video-bottom-offset);
	height: calc(100% - var(--video-bottom-offset));
`;

//#endregion

//react.lazy only supports default exports...so make one
export default Lookup;

/**
 * @param {LookupProps} props
 * @returns {JSX.Element}
 */
export function Lookup({ event, returnView }) {
	const [{ state, query, user }, dispatch] = useReducer(
		(s, a) => ({ ...s, ...a }),
		{
			state: 'input',
			query: null,
			user: null,
		}
	);

	const reset = query =>
		dispatch({ query: null, user: null, state: 'input' });

	switch (state) {
		case 'input':
			return (
				<InputForm
					onLookup={query => dispatch({ query, state: 'query' })}
				/>
			);

		case 'query':
			return (
				<Suspense fallback={<Loading />}>
					<Query
						event={event}
						query={query}
						onResolve={user =>
							dispatch({ state: 'resolved', user })
						}
						onReset={reset}
					/>
				</Suspense>
			);

		case 'resolved':
			return (
				<EntryForm
					item={user}
					onSave={async () => {
						await event.recordAttendance(user);
						dispatch({ state: 'success' });
					}}
					returnView={reset}
				/>
			);

		case 'success':
			return (
				<Success user={user} reset={reset} returnView={returnView} />
			);
	}

	// shouldn't get here
	return <>{state}</>;
}

function InputForm({ onLookup }) {
	const inputRef = useRef();

	const videoRef = useCodeScanner(({ data }) => {
		inputRef.current.value = data;
		onLookup?.(data);
	});

	const submit = e => {
		e.preventDefault();
		e.stopPropagation();
		onLookup?.(inputRef.current?.value);
	};

	return (
		<Box as="form" onSubmit={submit}>
			<Image />
			<SubTitle>Scan your QR code using your reader…</SubTitle>
			<Input
				placeholder="Or click to manually enter"
				ref={inputRef}
				autoFocus
			/>

			<Video hidden ref={videoRef} />
		</Box>
	);
}

function Query({ event, query, onResolve, onReset }) {
	/** @type {User[]} */
	const users = useLink(
		event,
		`lookup-by-license-number/${encodeURIComponent(query)}`
	);

	const user = users?.[0];

	if (user) onResolve(user);

	return user ? null : (
		<Box>
			<Empty>&quot;{query}&quot; Not found.</Empty>
			<Button inverted text onClick={onReset}>
				Try again?
			</Button>
		</Box>
	);
}
