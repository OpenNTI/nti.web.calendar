import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading, Scroll, Errors, Text, Input, Icons, List} from '@nti/web-commons';

import Store from './Store';
import ListItem from './ListItem';

const getSelectedId = (calendar) => calendar.CatalogEntry?.NTIID ?? calendar.getID();
const buildIsSelected = (selected, unselected) => {
	const blacklist = unselected != null;
	const set = blacklist ? new Set(unselected ?? []) : new Set(selected ?? []);

	return (calendar) => {
		const inSet = set.has(getSelectedId(calendar));

		return (blacklist && !inSet) || (!blacklist && inSet);
	};
};

const t = scoped('web-calendar.calendars.Filter', {
	courses: 'courses',
	search: 'Search your Calendars',
	empty: {
		search: 'No Matching Calendars',
		noSearch: 'No Calendars'
	}
});

const Error = styled(Errors.Message).attrs({as: 'p'})`
	text-align: center;
	margin: 0.5rem 0;
`;

const Empty = styled(Text.Base).attrs({as: 'p'})`
	font-style: italic;
	color: var(--tertiary-grey);
	text-align: center;
	margin: 0.5rem 0;
`;

const Label = styled(Text.Label)`
	color: var(--tertiary-grey);
`;

CalendarsFilter.propTypes = {
	className: PropTypes.string,

	onChange: PropTypes.func,
	unselected: PropTypes.array,
	selected: PropTypes.array
};
function CalendarsFilter ({className, onChange, unselected, selected}) {
	const {
		loading,
		error,
		items,

		hasMore,
		loadMore,

		searchTerm,
		updateSearchTerm
	} = Store.useValue();

	const empty = (items ?? []).length === 0;

	const initialLoad = loading && !error && !items;
	const initialEmpty = !loading && !searchTerm && empty;
	const initialError = !loading && empty && error;

	const showEmpty = !initialError && !loading && empty;
	const showCourses = items && items.length > 0;

	const scrollerRef = React.useRef();
	const listRef = React.useCallback(() => {
		if (!loading && hasMore && !scrollerRef.current.canScroll()) {
			loadMore();
		}
	}, [loading, hasMore, loadMore]);

	const isSelected = React.useMemo(() => buildIsSelected(selected, unselected), [selected, unselected]);
	const toggleSelected = React.useCallback((calendar) => {
		const blacklist = unselected != null;
		const wasSelected = isSelected(calendar);
		const id = getSelectedId(calendar);

		const set = blacklist ? new Set(unselected) : new Set(selected ?? []);

		if ((blacklist && wasSelected) || (!blacklist && !wasSelected)) {
			set.add(id);
		}  else {
			set.delete(id);
		}

		onChange?.(Array.from(set));
	}, [selected, unselected, onChange, isSelected]);

	return (
		<Scroll.BoundaryMonitor ref={scrollerRef} className={className} onBottom={hasMore ? loadMore : null} >
			<Input.Icon icon={<Icons.Search />} side="left">
				<Input.LabelPlaceholder variant="underlined">
					<Input.Text placeholder={t('search')} onChange={updateSearchTerm} value={searchTerm} disabled={initialEmpty} />
				</Input.LabelPlaceholder>
			</Input.Icon>
			<Loading.Placeholder loading={initialLoad} fallback={<Loading.Spinner />}>
				{showEmpty && (
					<Empty>{searchTerm ? t('empty.search') : t('empty.noSearch')}</Empty>
				)}
				{showCourses && (
					<Label>{t('courses')}</Label>
				)}
				{showCourses && (
					<List.Unadorned ref={listRef}>
						{(items || []).map((item) => {
							const key = item.getID();

							return (
								<li key={key}>
									<ListItem
										calendar={item}
										selected={isSelected(item)}
										onClick={toggleSelected}
									/>
								</li>
							);
						})}
					</List.Unadorned>
				)}
				{error && (<Error error={error} />)}
			</Loading.Placeholder>
		</Scroll.BoundaryMonitor>
	);
}

export default Store.compose(
	CalendarsFilter,
	{
		deriveBindingFromProps: ({admin}) => ({admin})
	}
);
