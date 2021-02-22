import getCollection from './get-calendar-collection';

export default async function getCourseCalendar(courseId) {
	const collection = await getCollection(true);
	return (collection.Items || []).find(
		c => (c.CatalogEntry || {}).CourseNTIID === courseId
	);
}
