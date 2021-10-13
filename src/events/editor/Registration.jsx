
import { DateTime, Icons, Text } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped('calendar.events.check-in', {
	'checked-in-at': 'Checked-In %(date)s',
});

//#region 🎨

const Box = styled.div`
	height: 40px;
	background: linear-gradient(180deg, #dceedd 0%, #e9f6ea 19.04%, #fff 100%);
	box-shadow: inset 0 -1px 0 0 #dfdfdf;
	color: var(--secondary-green);
	padding: 0 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-items: flex-start;

	@media (--respond-to-handhelds) {
		padding: 0 16px;
	}
`;

const Label = styled(Text.Label).attrs({ getString: t })`
	text-transform: none;
	margin-left: 1em;
`;

//#endregion

export function Registration({ event }) {
	const date = event?.getRegistrationTime() ?? null;
	return (
		date && (
			<Box data-testid="checked-in-at">
				<Icons.Check.Circled />
				<Label
					localeKey="checked-in-at"
					with={{
						date: DateTime.format(
							date,
							DateTime.WEEKDAY_MONTH_NAME_DAY_AT_TIME
						),
					}}
				/>
			</Box>
		)
	);
}
