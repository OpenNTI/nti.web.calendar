export { default as getCourseCalendar } from './get-course-calendar';
export { default as getCalendarCollection } from './get-calendar-collection';

export function getToday() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
}
