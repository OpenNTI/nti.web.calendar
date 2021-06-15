import { Table as TableSpec } from '@nti/web-commons';

export const Table = styled(TableSpec.Panel)`
	margin: 25px 0 18px;

	th:global(.nti-table-simple-header) div {
		color: inherit;
	}

	&.headless thead {
		display: none;
	}

	thead > tr > th {
		color: var(--primary-grey);
	}

	tbody > tr > td {
		border-top: 1px solid var(--border-grey-light);
	}

	&.capped {
		tbody > tr:last-child > td {
			border-bottom: 1px solid var(--border-grey-light);
		}
	}

	& tr:hover td {
		background: var(--table-row-highlight);
	}
`;
