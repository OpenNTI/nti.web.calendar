import React from 'react';

import { Input, Errors } from '@nti/web-commons';

import { useReducerState } from './parts/use-reducer-state';
import getString from './strings';

const scope = key => `bulk-attendance-upload.filedrop.${key}`;
const t = key => getString(scope(key));
t.isMissing = key => getString.isMissing(scope(key));

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').BaseEvent} Event */
/** @typedef {() => void} Handler */

//react.lazy only supports default exports...so make one
export default BulkUpload;

/**
 *
 * @param {Object} props
 * @param {Event} props.event
 * @param {Handler} props.returnView
 * @returns {JSX.Element}
 */
function BulkUpload({ event, returnView }) {
	const [{ state }, dispatch] = useReducerState({
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
			return <div>Complete</div>;
	}

	return <>{state}</>;
}

const FormContainer = styled.div`
	min-height: 350px;
	display: flex;
	flex-direction: column;

	> * {
		flex: 1;
	}
`;

const FileDrop = styled(Input.FileDrop)`
	border: none;
`;

const BulkUploadForm = ({ event, onComplete }) => {
	const [{ error }, dispatch] = useReducerState({});
	const clearError = () => dispatch({ error: null });
	const onChange = async file => {
		clearError();
		try {
			const formData = new FormData();
			formData.append('source', file);
			const result = await event.postToLink(
				'bulk-attendance-upload',
				formData,
				true
			);
			onComplete?.(result);
		} catch (e) {
			dispatch({ error: e });
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
				error={error && Errors.Messages.getMessage(error)}
			/>
		</FormContainer>
	);
};
