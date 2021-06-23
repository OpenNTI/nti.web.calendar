import React, { useCallback, useRef } from 'react';

import { Text } from '@nti/web-commons';
import { Models } from '@nti/lib-interfaces';

import { useReducerState } from './parts/use-reducer-state';
import { ActionButton, Button } from './parts/Buttons';
import { Box, TitleBar } from './parts/Containers';
import { Title } from './parts/Text';
import getString from './strings';
import icon from './assets/qr-code.svg';

//#region 🎨 paint

const TitleArea = styled(TitleBar)`
	align-items: flex-start;
	padding: 0;
	flex-wrap: nowrap;
`;

const Image = styled('img').attrs({ src: icon })`
	float: right;
	width: 84px;
	height: 84px;
	flex: 0 0 auto;
`;

const Required = styled('span').attrs({ children: '*' })`
	color: var(--primary-red);
`;

const Legend = styled(Text.Label).attrs({ as: 'legend', getString })`
	color: var(--tertiary-grey);
`;

const ErrorText = styled(Text.Base).attrs({ as: 'div' })`
	color: var(--primary-red);
	line-height: 1.1 !important;
	font-size: 12px;
	margin: 10px 10px 0;
`;

const ErrorTop = styled(ErrorText).attrs({ as: 'div' })`
	font-size: 14px;
	text-align: center;
`;

const FieldSet = styled.fieldset`
	border: 0;
	padding: 0;
	margin: 0 0 20px 0;

	& > legend {
		padding-bottom: 10px;
	}

	& > input {
		width: 100%;
		border: 2px solid var(--quad-grey);
		font-size: 14px;
		font-weight: 600;
		line-height: 19px;
		border-radius: 3px;
		padding: 4px 8px;
	}
`;

function DecoratedInput({ className, required, label, name, error, ...props }) {
	return (
		<FieldSet className={className}>
			<Legend localeKey={`entry-form.${name}`}>
				{label}
				{required && <Required />}
			</Legend>
			<input
				className={className}
				required={required}
				name={name}
				{...props}
			/>
			{name && error?.field === name && (
				<ErrorText>{error.message}</ErrorText>
			)}
		</FieldSet>
	);
}

const Spacer = styled.span`
	flex: 1 1 auto;
`;

const Controls = styled.div`
	margin-top: 100px;
	display: flex;
	flex-direction: row-reverse;
	align-items: baseline;

	@media (--respond-to-handhelds) {
		margin-top: 50px;
	}

	${Button} {
		font-size: 14px;
	}

	& > :not(${Spacer}) {
		flex: 0 0 auto;
	}
`;

const stop = e => e.preventDefault();

//#endregion

export function EntryForm({ item, returnView, onSave }) {
	const readOnly = !!item;
	const form = useRef();
	/** @type {Models.entities.User} */
	const user = item instanceof Models.entities.User ? item : item?.User;

	const { call, error, busy } = useFormFun();
	const save = useCallback(call(() => onSave(form.current), [onSave]));
	const del = useCallback(
		call(
			() => item.delete(),
			err => !err && returnView()
		),
		[item]
	);

	return (
		<Box>
			<TitleArea>
				<Title localeKey="entry-form.title" />
				<Image />
			</TitleArea>

			<form onSubmit={stop} ref={form}>
				<DecoratedInput
					error={error}
					name="realname"
					required
					value={user?.realname}
					disabled={busy || readOnly}
				/>
				<input
					type="hidden"
					name="external_type"
					value="license_number"
				/>
				<DecoratedInput
					error={error}
					name="external_id"
					required
					value={user?.LicenseNumber}
					disabled={busy || readOnly}
				/>
				<DecoratedInput
					error={error}
					name="uuid"
					value={user?.DEQ_UUID}
					disabled
				/>
				<DecoratedInput
					error={error}
					type="email"
					name="email"
					required
					value={user?.email}
					disabled={busy || readOnly}
				/>
			</form>
			{
				// only show top error if we cannot associate it with a field
				error && form.current?.[error.field] == null && (
					<ErrorTop>{error.message}</ErrorTop>
				)
			}
			<Controls>
				{onSave && (
					<ActionButton
						rounded
						disabled={busy}
						onClick={save}
						localeKey="entry-form.save"
					/>
				)}
				<Button
					inverted
					text
					onClick={returnView}
					disabled={busy}
					localeKey="entry-form.cancel"
				/>

				<Spacer />
				{item?.hasLink('delete') && (
					<ActionButton
						inverted
						destructive
						text
						onClick={del}
						localeKey="entry-form.delete"
					/>
				)}
			</Controls>
		</Box>
	);
}

function useFormFun() {
	const [{ error, busy }, dispatch] = useReducerState({
		error: null,
		busy: false,
	});

	const call = useCallback(
		(f, fin) => async (_, finish) => {
			try {
				dispatch({ busy: true });
				if (fin) {
					finish?.call(fin);
				}
				await f();
			} catch (e) {
				dispatch({ busy: false, error: e });
				throw e;
			}
		},
		[dispatch]
	);

	return {
		call,
		error,
		busy,
	};
}
