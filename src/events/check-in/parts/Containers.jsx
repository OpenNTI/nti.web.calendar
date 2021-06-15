export const Box = styled.div`
	--padding-inset: 30px;

	background: white;
	color: var(--primary-grey);
	overflow: hidden;
	padding: 35px var(--padding-inset);
	position: relative;

	&.flush-top {
		padding-top: 0;
	}

	&.centered {
		text-align: center;
	}
`;

export const CenteredBox = styled(Box)`
	padding-top: 21.74%;
	padding-left: 0;
	padding-right: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const TitleBar = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: baseline;
	justify-content: space-between;
	margin: 18px 21px 18px 0;
	@media (--respond-to-handhelds) {
		margin-right: 0;
		& > * {
			flex: 1 1 auto;
		}
	}
`;
