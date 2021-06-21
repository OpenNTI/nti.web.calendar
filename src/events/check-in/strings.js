import { scoped } from '@nti/lib-locale';

export default scoped('calendar.events.check-in', {
	'search-placeholder-text': 'Search…',
	'not-found': 'Not Found.',
	empty: 'No Check-ins yet',
	'view-all': 'View All',
	title: 'Checked-In Attendees (%(count)s)',

	action: {
		label: 'Check In',
		success: ' Checked-in',
	},

	actions: {
		title: 'Select an option to check in an attendee.',
		'lookup-by-license': 'Scan or<br />Enter Code',
		lookup: 'Lookup by Name',
		'check-in-new-user': 'Create a<br />New Account',
	},

	'success-screen': {
		'check-in-success': '%(realname)s has been checked in.',
		'scan-another-code': 'Scan another QR code',
		'return-to-main': 'Return to Event Page',
	},

	'lookup-by-license': {
		'scan-instruction': 'Scan your QR code using your reader…',
		'placeholder-text': 'Or click to manually enter',
		'not-found': '&quot;%(query)s&quot; Not found.',
		retry: 'Try again?',
	},

	'entry-form': {
		title: 'Review and Confirm Information',
		realname: 'Full Name',
		external_id: 'License Number',
		uuid: 'UUID',
		email: 'Email Address',
		cancel: 'Cancel',
		delete: 'Delete Attendee',
		save: 'Save',
	},

	columns: {
		'check-in-time': 'Check-in Time',
		name: 'Name',
	},
});
