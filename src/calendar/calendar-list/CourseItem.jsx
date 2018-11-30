import React from 'react';
import PropTypes from 'prop-types';
import { Presentation } from '@nti/web-commons';

import { Icon } from '../components';

export default class CourseItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		selected: PropTypes.bool
	}

	render () {
		const { item: { CatalogEntry = {} }, selected } = this.props;
		const { title, providerId } = CatalogEntry;
		return (
			<div className="course-item">
				<Presentation.Asset propName="url" contentPackage={CatalogEntry} type="thumb">
					<Icon selected={selected} />
				</Presentation.Asset>
				<div className="course-item-meta">
					<div className="course-item-title">{title}</div>
					<div className="course-item-provider-id">{providerId}</div>
				</div>
			</div>
		);
	}
}
