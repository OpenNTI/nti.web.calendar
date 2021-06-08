import React, { useEffect, useRef } from 'react';
import QrcodeDecoder from 'qrcode-decoder';

import icon from './assets/qr_icon.svg';
import { Box, SubTitle } from './parts.jsx';

//#region 🎨 paint

const Input = styled('input').attrs({})`
	border: 0;
	padding: 4px 0;
	text-align: center;
	color: var(--primary-grey);
	border-bottom: 1px solid var(--primary-blue);
	font-size: 14px;
	line-height: 19px;
	width: 180px;

	&::placeholder {
		color: var(--tertiary-grey);
	}
`;

const Video = styled.video`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	opacity: 0.5;
	width: 100%;
`;

//#endregion

//react.lazy only supports default exports...so make one
export default ScanEntry;

export function ScanEntry(props) {
	const videoRef = useRef();
	const inputRef = useRef();

	useEffect(() => {
		const { current: video } = videoRef;
		const qr = new QrcodeDecoder();

		if (!qr.isCanvasSupported()) {
			video.hidden = true;
			return;
		}

		function stop() {
			video.hidden = true;
			qr.stop();
		}

		qr.decodeFromCamera(video).then(({ data }) => {
			inputRef.current.value = data;
			stop();
		});

		return stop;
	}, [videoRef.current]);

	return (
		<Box>
			<Video ref={videoRef} autoPlay playsInline />
			<img width="83" height="84" src={icon} />
			<SubTitle>Scan your QR code using your reader…</SubTitle>
			<Input placeholder="Or click to manually enter" ref={inputRef} />
		</Box>
	);
}
