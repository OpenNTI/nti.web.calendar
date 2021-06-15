import { Text } from '@nti/web-commons';

export const ActionPrompt = styled.div`
	min-height: 166px;
	margin: 0 calc(var(--padding-inset) * -1);
	background: linear-gradient(180deg, #52c2f6 0%, #2f3176 100%);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const Actions = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	margin-top: 27px;
	min-height: 48px;
	width: 75%;

	@media (--respond-to-handhelds) {
		justify-content: space-around;
		margin-bottom: 10px;
	}
`;

export const Action = styled(Text.Base).attrs({ as: 'button' })`
	flex: 0 0 113px;
	border: 0;
	font-size: 12px;
	line-height: 16px;
	border-radius: 3.75px;
	background: #fff;
	box-shadow: 0 2px 24px 0 #30397c;
	cursor: pointer;
	padding: initial;
	margin: initial;
	color: inherit;
	min-height: 48px;

	@media (--respond-to-handhelds) {
		margin-bottom: 10px;
	}
`;
