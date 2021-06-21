import React, { useRef } from 'react';

import { CenteredBox as Box } from './parts/Containers';
import { SubTitle } from './parts/Text';
import { useCodeScanner } from './parts/use-code-scanner';
import icon from './assets/qr_icon.svg';
import getString from './strings';

//#region 🎨 paint

const Image = styled('img').attrs({ src: icon })`
	width: 83px;
	height: 84px;
`;

// the "input&&&" selector is a hack to make this more specific than "foundation" in the mobile app
const Input = styled('input').attrs({})`
	input&&& {
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
	}
`;

const Video = styled.video`
	--video-bottom-offset: 145px;

	position: absolute;
	left: 50%;
	transform: translate(-50%, 0);
	bottom: var(--video-bottom-offset);
	height: calc(100% - var(--video-bottom-offset));
`;

//#endregion

export function InputForm({ onLookup }) {
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
			<SubTitle localeKey="lookup-by-license.scan-instruction" />
			<Input
				placeholder={getString('lookup-by-license.placeholder-text')}
				ref={inputRef}
				autoFocus
			/>

			<Video hidden ref={videoRef} />
		</Box>
	);
}
