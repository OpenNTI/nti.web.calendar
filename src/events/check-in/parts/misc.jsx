import { Loading as LoadingSpecs } from '@nti/web-commons';

import { SubTitle } from './Text';

export const Empty = styled(SubTitle)`
	color: var(--tertiary-grey);
	display: block;
	text-align: center;
`;

export const Loading = () => (
	<Empty>
		<LoadingSpecs.Spinner />
	</Empty>
);
