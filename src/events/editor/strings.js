import { scoped } from '@nti/lib-locale';
const t = scoped('calendar.event.editor', {
	eventTitle: 'Event Title',
	eventDescription: 'Description...',
	eventLocation: 'Location',
	calendar: 'Calendar',
	save: 'Done',
	cancel: 'Cancel',
	close: 'Close',
	edit: 'Edit',
	location: 'Location',
	datesTimes: 'Dates & Times',
	delete: 'Delete',
	event: 'Event',
	start: 'Start',
	end: 'End',
	title: 'View Event',
	searchCalendar: 'Search Calendars',

	create: {
		title: 'Create Event',
		save: 'Create',
		cancel: 'Cancel',
	},

	editor: {
		title: 'Edit Event',
		save: 'Save',
		cancel: 'Cancel',
	},

	editable: {
		title: 'View Event',
		save: 'Edit',
		cancel: 'Cancel',
	},
});

export default t;

const createScope = t.scoped('create');
const editScope = t.scoped('editor');
const editableScope = t.scoped('editable');

export function getScope({ editable, create }, mode) {
	return mode === 'view'
		? editable
			? editableScope
			: t
		: create
		? createScope
		: editScope;
}
