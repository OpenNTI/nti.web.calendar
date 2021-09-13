import React, { useCallback, useContext } from 'react';

import { ActionButton } from '../parts/Buttons';
import getString from '../strings';

/** @typedef {import('@nti/lib-interfaces/src/models/calendar').EventUserSearchHit} EventUserSearchHit */

export const CheckInAction = React.createContext();

CheckInColumn.cssClassName = css`
	width: 150px;
	text-align: right;
	flex: 0 0 100% !important;
`;

/**
 * @param {Object} props
 * @param {EventUserSearchHit} props.item
 * @returns {JSX.Element}
 */
export function CheckInColumn({ item }) {
	const action = useContext(CheckInAction);
	const callback = useCallback(
		(_, finish) => {
			finish?.retain();
			return action(item);
		},
		[item, action]
	);
	return (
		<ActionButton
			initialState={
				item?.hasLink?.('attendance') ? 'finished' : undefined
			}
			key={item.User?.getID()}
			onClick={callback}
			renderFinalState={Finish}
			localeKey="action.label"
		/>
	);
}

function Finish() {
	return (
		<b>
			<i className="icon-check" />
			{getString('action.success')}
		</b>
	);
}
