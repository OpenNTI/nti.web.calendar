import React, { useCallback, useContext } from 'react';

import { ActionButton } from '../parts/Buttons';
import getString from '../strings';

export const CheckInAction = React.createContext();

CheckInColumn.cssClassName = css`
	width: 150px;
	text-align: right;
	flex: 0 0 100% !important;
`;
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
			key={item.getID()}
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
