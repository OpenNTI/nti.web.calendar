import React from 'react';

import { Button } from '@nti/web-commons';

import { Box } from '../parts/Containers';
import { Table as CommonsTable } from '../parts/Table';
import { TableCellText } from '../columns/shared';
import { Title, SubTitle } from '../parts/Text';

const Container = styled(Box)`
	min-height: 350px;
	display: flex;
	flex-direction: column;
	justify-content: center;

	> * {
		margin: 1rem;
	}
`;

const Btn = styled(Button)`
	align-self: flex-end;
`;

export default function BulkUploadComplete({
	result: { Items: items = [], Issues: issues = [] },
	returnView,
}) {
	return (
		<Container>
			<Title>{items.length} attendees checked in.</Title>
			<Issues issues={issues} />
			<Btn onClick={returnView}>Return</Btn>
		</Container>
	);
}

const column = (prop, name = prop) => {
	const Cmp = ({ item: { [prop]: value } }) => (
		<TableCellText>{value}</TableCellText>
	);
	Cmp.Name = name;
	return Cmp;
};

const LineColumn = column('line');
const MessageColumn = column('message');
const CertIdColumn = ({ item: { data } }) => (
	<TableCellText>{data?.OpCert_ID}</TableCellText>
);
CertIdColumn.Name = 'Cert ID';

const Table = styled(CommonsTable)`
	&& {
		table-layout: auto;
	}
`;

function Issues({ issues, limit = 15 }) {
	return !issues?.length ? null : (
		<div>
			<Title>Encountered {issues.length} issues:</Title>
			<Table
				items={issues.slice(0, limit)}
				columns={[LineColumn, CertIdColumn, MessageColumn]}
			/>
			{issues.length > limit && (
				<SubTitle>…and {issues.length - limit} more</SubTitle>
			)}
		</div>
	);
}
