import { useEffect, useRef } from 'react';

import { Input, Errors, Loading } from '@nti/web-commons';
import { useReducerState } from '@nti/web-core';

import getString from '../strings';

import Complete from './Complete';

const t = getString.scoped('bulk-attendance-upload.file-drop');

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').BaseEvent} Event */
/** @typedef {() => void} Handler */

//react.lazy only supports default exports...so make one
export default BulkUpload;

//#region 🎨

const FormContainer = styled.div`
	min-height: 350px;
	display: flex;
	flex-direction: column;
	position: relative;

	> * {
		flex: 1;
	}
`;

const FileDrop = styled(Input.FileDrop)`
	border: none;
`;

const Spinner = styled(Loading.Spinner.Large)`
	position: absolute;
	inset: 0;
`;

const Mask = styled.div`
	content: '';
	position: absolute;
	inset: 0;
	background: rgba(255, 255, 255, 0.8);
`;

const BulkUploadForm = ({ event, onComplete }) => {
	const [{ error, loading }, dispatch, reset] = useReducerState({
		error: null,
		loading: false,
	});

	const active = useRef(true);
	useEffect(() => () => (active.current = false), []);

	const onChange = async file => {
		const update = (...args) => active.current && dispatch(...args);
		reset();
		update({ loading: true });
		try {
			const formData = new FormData();
			formData.append('source', file);
			const result = await event.postToLink(
				'bulk-attendance-upload',
				formData
			);
			onComplete?.(result);
		} catch (e) {
			update({ error: e });
		} finally {
			update({ loading: false });
		}
	};

	return (
		<FormContainer>
			<FileDrop
				onChange={onChange}
				allowedTypes={{
					'text/csv': true,
				}}
				getString={t}
				error={Errors.Messages.getMessage(error)}
			/>
			{loading && (
				<Mask>
					<Spinner />
				</Mask>
			)}
		</FormContainer>
	);
};

//#endregion

/**
 *
 * @param {Object} props
 * @param {Event} props.event
 * @param {Handler} props.returnView
 * @returns {JSX.Element}
 */
function BulkUpload({ event, returnView }) {
	const [{ state, result }, dispatch] = useReducerState({
		state: 'input',
	});

	switch (state) {
		case 'input':
			return (
				<BulkUploadForm
					event={event}
					onComplete={result =>
						dispatch({ state: 'complete', result })
					}
				/>
			);
		case 'complete':
			return <Complete result={result} returnView={returnView} />;
	}

	return <>{state}</>;
}
