import React from 'react';

import { Input, Text } from '@nti/web-commons';

import t from './strings';

export function LocationInfo({ location, readOnly, onChange }) {
	return !location ? null : (
		<div className="input-section location">
			<div className="section-title">{t('location')}</div>
			{readOnly ? (
				<Text.Base className="name" linkify>
					{location}
				</Text.Base>
			) : (
				<Input.Text
					placeholder={t('eventLocation')}
					value={location}
					onChange={onChange}
					maxLength="140"
				/>
			)}
		</div>
	);
}
