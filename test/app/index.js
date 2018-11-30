import React from 'react';
import ReactDOM from 'react-dom';

window.$AppConfig = window.$AppConfig || { server: '/dataserver2/' };

import Generic from '../../src/events/generic/View';
import Calendar from '../../src/calendar';
import AssignmentEvent from '../../src/events/dynamic/assignment';

class Test extends React.Component {

	render () {
		let today = new Date();
		today.setHours(14);
		let endDate = new Date();
		endDate.setHours(19);
		const event = {
			'Creator': 'josh.birdwell@nextthought.com',
			'CreatedTime': 1543511803.680686,
			'Last Modified': 1543511803.680686,
			'NTIID': 'tag:nextthought.com,2011-10:josh.birdwell@nextthought.com-OID-0x0601e5:5573657273:Vsavve2Xugc',
			'MimeType': 'application/vnd.nextthought.courseware.coursecalendarevent',
			'OID': 'tag:nextthought.com,2011-10:josh.birdwell@nextthought.com-OID-0x0601e5:5573657273:Vsavve2Xugc',
			'Links': [
				{
					'Class': 'Link',
					'href': '/dataserver2/users/josh.birdwell@nextthought.com/Objects/tag%3Anextthought.com%2C2011-10%3Ajosh.birdwell%40nextthought.com-OID-0x0601e5%3A5573657273%3AVsavve2Xugc',
					'ntiid': 'tag:nextthought.com,2011-10:josh.birdwell@nextthought.com-OID-0x0601e5:5573657273:Vsavve2Xugc',
					'rel': 'edit'
				}
			],
			'href': '/dataserver2/users/josh.birdwell@nextthought.com/Objects/tag%3Anextthought.com%2C2011-10%3Ajosh.birdwell%40nextthought.com-OID-0x0601e5%3A5573657273%3AVsavve2Xugc',
			'startTime': '2018-12-06T06:00:00Z',
			'endTime': '2018-12-09T06:00:00Z',
			'description': 'stuff',
			'icon': '/dataserver2/cf.io/Vsavve2Xuga/blob',
			'location': 'Hard Rock Hotel 4455 Paradise Road Las Vegas NV',
			'title': 'Call of duty World League'
		};
		const assignment = {
			title: 'Pop Quiz',
			dueDate: '2018-12-09T06:00:00Z'
		};
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
