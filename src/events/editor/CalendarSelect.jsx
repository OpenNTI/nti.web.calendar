import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Flyout, Text, Icons} from '@nti/web-commons';

import ListItem from '../../calendars/ListItem';
import Select from '../../calendars/Select';
import CalendarsStore from '../../calendars/Store';

const t = scoped('calendar.events.editor.CalendarSelect', {
	none: 'No Calendar Selected'
});

const Container = styled.div`
	width: 440px;
	max-width: calc(100% - 14px);
	border-radius: 2px;
	padding: 0 0.625rem;
	overflow: hidden;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	&:not(:focus) {
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
	}
`;

const Empty = styled(Text.Base)`
	display: inline-block;
	font-size: 0.875rem;
	font-family: italic;
	line-height: 1;
	padding: 0.875rem 0;
`;

const StyledSelect = styled(Select)`
	padding: 0 0.875rem 2rem;
	min-height: 200px;
	max-height: var(--flyout-max-height);
	overflow: auto;
`;

export default function CalendarSelect ({selected, event, onChange}) {
	React.useEffect(() => {
		if (selected) { return; }

		let mounted = true;
		const findCalendar = async () => {
			let calendar = null;

			try {
				calendar = await CalendarsStore.getCalendarForEvent(event);
			} catch (e) {
				calendar = await CalendarsStore.getFirstAdminCalendar();
			}

			if (!mounted) { return; }
			onChange?.(calendar);
		};

		findCalendar();
		return () => mounted = false;
	}, [event]);

	const flyoutRef = React.useRef();

	const selectedCalendar = React.useMemo(() => selected ? ([selected.getID()]) : null, [selected]);
	const doChange = React.useCallback((_, calendar) => (
		onChange(calendar),
		flyoutRef.current?.dismiss()
	), []);

	const trigger = (
		<Container>
			{
				selected ?
					(<ListItem calendar={selected} />) :
					(<Empty>{t('none')}</Empty>)
			}
			<Icons.Chevron.Down large />
		</Container>
	);

	return (
		<Flyout.Triggered
			trigger={trigger}
			sizing={Flyout.SIZES.MATCH_SIDE}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			constrain
			ref={flyoutRef}
		>
			<StyledSelect selected={selectedCalendar} admin onChange={doChange} autoFocus />
		</Flyout.Triggered>
	);
}

CalendarSelect.propTypes = {
	event: PropTypes.object,
	selected: PropTypes.object,
	onChange: PropTypes.func
};

CalendarSelect.getInitialCalendar = (event) => {

};
