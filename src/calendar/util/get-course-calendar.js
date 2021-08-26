import { getCalendarCollection } from './get-calendar-collection';

export async function getCourseCalendar(courseId) {
	const collection = await getCalendarCollection(true);
	return (collection?.Items || []).find(
		c => (c.CatalogEntry || {}).CourseNTIID === courseId
	);
}
