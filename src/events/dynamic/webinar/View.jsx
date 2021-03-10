import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { DateTime, List, Presentation } from '@nti/web-commons';

import { Icon } from '../../../calendar/components';
import { Layout } from '../../components';
import Registry from '../../Registry';
export default class WebinarEvent extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			CatalogEntry: PropTypes.object,
			title: PropTypes.string,
			dueDate: PropTypes.string,
			getStartTime: PropTypes.func,
			getEndTime: PropTypes.func,
		}),
		catalogEntry: PropTypes.object,
	};

	render() {
		const {
			item,
			item: { title, CatalogEntry },
		} = this.props;

		const start = DateTime.format(
			item.getStartTime(),
			DateTime.TIME_START_RANGE
		);
		const end = DateTime.format(item.getEndTime(), DateTime.TIME);

		return (
			<Layout className={cx('webinar-event')}>
				<Presentation.Asset
					propName="url"
					contentPackage={CatalogEntry}
					type="thumb"
				>
					<Icon />
				</Presentation.Asset>
				<div className="webinar-content">
					<div className="webinar-meta">
						<div className="webinar-title">{title}</div>
						<List.SeparatedInline className="webinar-subtitle">
							<div className="times">
								{start}-{end}
							</div>
						</List.SeparatedInline>
					</div>
				</div>
			</Layout>
		);
	}
}

Registry.register('application/vnd.nextthought.webinar.webinarcalendarevent')(
	WebinarEvent
);
