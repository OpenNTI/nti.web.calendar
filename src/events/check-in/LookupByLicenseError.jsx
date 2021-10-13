
import { Button } from './parts/Buttons';
import { CenteredBox as Box } from './parts/Containers';
import { SubTitle } from './parts/Text';
import icon from './assets/qr_icon.svg';

//#region 🎨 paint

const Image = styled('img').attrs({ src: icon })`
	width: 83px;
	height: 84px;
`;

//#endregion

export function LookupError({ error, reset, query }) {
	const is404 = error.statusCode === 404;
	return (
		<Box>
			<Image />
			<SubTitle
				localeKey={
					is404
						? 'lookup-by-license.not-found'
						: 'lookup-by-license.scan-error'
				}
				with={{ query }}
			/>
			<Button inverted text onClick={reset} localeKey="retry" />
		</Box>
	);
}
