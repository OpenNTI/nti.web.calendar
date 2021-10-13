
import { Input, Text } from '@nti/web-commons';

import t from './strings';
import { SectionTitle } from './SectionTitle';

const LocationEditor = styled(Input.Text)`
	background-color: white;
	height: 40px;
	width: 100%;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
	border: none;

	/* max-width: calc(100% - 14px); */

	&:focus {
		box-shadow: 0 0 3px 1px var(--primary-blue);
	}
`;

const LocationName = styled(Text.Base).attrs({
	className: 'name',
	linkify: true,
})`
	font-size: 0.75rem;
	color: var(--secondary-grey);
`;

const Container = styled.div`
	&.readOnly {
		margin-right: 100px;
		max-width: 200px;
	}
`;

export function LocationInfo({ location, mode, onChange }) {
	const viewingMode = mode === 'view';
	return viewingMode && !location ? null : (
		<Container readOnly={viewingMode}>
			<SectionTitle>{t('location')}</SectionTitle>
			{viewingMode ? (
				<LocationName>{location}</LocationName>
			) : (
				<LocationEditor
					placeholder={t('eventLocation')}
					value={location}
					onChange={onChange}
					maxLength="140"
				/>
			)}
		</Container>
	);
}
