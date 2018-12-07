import React from 'react';
import ReactDOM from 'react-dom';

window.$AppConfig = window.$AppConfig || { server: '/dataserver2/' };

import { Calendar } from '../../src/calendar';

class Test extends React.Component {

	render () {
		return (
			<div className="container">
				<Calendar />
			</div>
		);
	}
}

ReactDOM.render(
	<Test />,
	document.getElementById('content')
);
