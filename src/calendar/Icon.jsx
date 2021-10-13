import PropTypes from 'prop-types';

//#region 🎨 paint

const Wrapper = styled.div`
	align-self: flex-start;
	margin-top: 5px;
	position: relative;
`;

const IconSocket = styled.div`
	height: 32px;
	width: 32px;
	min-width: 32px;
	border-radius: 50%;
	background-size: cover;
	background-position: center;
	cursor: pointer;
	box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.15);

	&.selected {
		opacity: 0.55;
	}
`;

const Check = styled('i').attrs({ className: 'icon-check' })`
	position: absolute;
	top: 8px;
	left: 8px;
	color: white;
	right: 0;
	z-index: 1;
`;

//#endregion

export function Icon({ selected, onClick, url }) {
	return (
		<Wrapper className="icon-wrapper">
			{selected && <Check />}
			<IconSocket
				style={{ backgroundImage: `url(${url})` }}
				className="calendar-icon"
				onClick={onClick}
				selected={selected}
			/>
		</Wrapper>
	);
}

Icon.propTypes = {
	selected: PropTypes.bool,
	onClick: PropTypes.func,
	url: PropTypes.string,
};
