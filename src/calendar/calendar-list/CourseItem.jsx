import './CourseItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Presentation } from '@nti/web-commons';

import { Icon } from '../components';

export default class CourseItem extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			CatalogEntry: PropTypes.shape({
				NTIID: PropTypes.string.isRequired,
				title: PropTypes.string.isRequired,
				ProviderUniqueID: PropTypes.string.isRequired,
			}).isRequired,
			NTIID: PropTypes.string.isRequired,
		}),
		selected: PropTypes.bool.isRequired,
		onClick: PropTypes.func.isRequired,
	};

	onClick = () => {
		const {
			item: { CatalogEntry },
		} = this.props;
		this.props.onClick(CatalogEntry && CatalogEntry.NTIID);
	};

	render() {
		const {
			item: { CatalogEntry = {} },
			selected,
		} = this.props;
		const { title, ProviderUniqueID } = CatalogEntry;

		return (
			<div className="course-item" onClick={this.onClick}>
				<Presentation.Asset
					propName="url"
					contentPackage={CatalogEntry}
					type="thumb"
				>
					<Icon selected={selected} />
				</Presentation.Asset>
				<div className="course-item-meta">
					<div className="course-item-title">{title}</div>
					<div className="course-item-provider-id">
						{ProviderUniqueID}
					</div>
				</div>
			</div>
		);
	}
}
