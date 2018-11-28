import React from 'react';
import ReactDOM from 'react-dom';

window.$AppConfig = window.$AppConfig || { server: '/dataserver2/' };

import Day from '../../src/calendar/day';
import Calendar from '../../src/calendar';

class Test extends React.Component {

	render () {
		let today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		return (
			<>
				<Calendar />
			</>
		);
	}
}

ReactDOM.render(
	<Test />,
	document.getElementById('content')
);
