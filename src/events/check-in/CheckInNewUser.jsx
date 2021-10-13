
import { useReducerState } from '@nti/web-core';

import { EntryForm } from './EntryForm';
import { Success } from './Success';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').BaseEvent} Event */
/** @typedef {() => void} Handler */

//react.lazy only supports default exports...so make one
export default NewUser;

/**
 *
 * @param {Object} props
 * @param {Event} props.event
 * @param {Handler} props.returnView
 * @returns {JSX.Element}
 */
function NewUser({ event, returnView }) {
	const [{ state, user }, dispatch] = useReducerState({
		state: 'input',
		user: null,
	});

	switch (state) {
		case 'input':
			return (
				<EntryForm
					event={event}
					returnView={returnView}
					onSave={async form => {
						// Stubbing 1-off logic outside of model
						const payload = Object.fromEntries(
							new FormData(form).entries()
						);

						const data = await event?.postToLink(
							'checkin-new-user',
							payload,
							true
						);

						dispatch({
							state: 'success',
							user: data.User,
						});
					}}
				/>
			);

		case 'success':
			return <Success user={user} returnView={returnView} />;
	}

	return <>{state}</>;
}
