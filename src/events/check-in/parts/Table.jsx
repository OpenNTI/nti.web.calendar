import { Table as TableSpec } from '@nti/web-commons';

export const Table = styled(TableSpec.Panel)`
	margin: 25px 0 18px;

	th:global(.nti-table-simple-header) div {
		color: inherit;
	}

	thead {
		background: none;
	}

	&.headless thead {
		display: none;
	}

	thead > tr > th {
		color: var(--primary-grey);
	}

	tbody > tr {
		border-top: 1px solid var(--border-grey-light);
	}

	&.capped {
		tbody > tr:last-child {
			border-bottom: 1px solid var(--border-grey-light);
		}
	}

	& tbody > tr:hover {
		background: var(--table-row-highlight);
	}

	@media (--respond-to-handhelds) {
		thead {
			display: none;
		}

		tbody > tr {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: stretch;

			& > td {
				width: auto;
				height: auto;
				display: block;
				flex: 1 1 auto;

				&::before {
					display: block;
					content: attr(data-name);
					line-height: 1;
					font-size: 10px;
					font-weight: bold;
					margin: 0.5em 0;
				}

				[role='button'] {
					width: 90%;
					margin: 0 5% 5%;
				}
			}
		}
	}
`;
