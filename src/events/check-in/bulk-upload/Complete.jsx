import React from 'react';

const Container = styled.div`
	min-height: 350px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	> * {
		margin: 1rem;
	}
`;

export default function BulkUploadComplete({
	result: { Items: items = [], Issues: issues = [] },
	returnView,
}) {
	return (
		<Container>
			<div>{items.length} attendees checked in.</div>
			{issues.length && <div>Encountered {issues.length} issues.</div>}
			<button onClick={returnView}>Return</button>
		</Container>
	);
}
