import React from 'react';

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

export const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	& > li {
		display: inline;

		&:not(:first-child)::before {
			content: ', ';
		}
	}
`;

List.Item = function ListItem({ children, ...props }) {
	const empty = React.Children.count(children) === 0;
	return empty ? null : <li {...props}>{children}</li>;
};
