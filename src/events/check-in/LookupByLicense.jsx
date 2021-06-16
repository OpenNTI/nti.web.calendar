import React, { useCallback, useRef } from 'react';

import icon from './assets/qr_icon.svg';
import { CenteredBox as Box } from './parts/Containers';
import { SubTitle } from './parts/Text';
import { useCodeScanner } from './parts/use-code-scanner';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').BaseEvent} Event */
/** @typedef {() => void} Handler */
/**
 * @typedef {{
 * 	event: Event
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
export function Lookup({ event }) {
	return <Scanner />;
}

function Scanner() {
	const inputRef = useRef();

	const handleScan = useCallback(({ data }) => {
		inputRef.current.value = data;
	}, []);

	const videoRef = useCodeScanner(handleScan);

	const submit = e => {
		e.preventDefault();
		e.stopPropagation();
		console.log('submit');
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
