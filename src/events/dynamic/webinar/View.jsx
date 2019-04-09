import React from 'react';
import PropTypes from 'prop-types';
import { DateTime, List, Presentation } from '@nti/web-commons';
import cx from 'classnames';

import { Icon } from '../../../calendar/components';
import { Layout } from '../../components';
import Registry from '../../Registry';

@Registry.register('application/vnd.nextthought.webinar.webinarcalendarevent')
export default class WebinarEvent extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			title: PropTypes.string,
			dueDate: PropTypes.string
		}),
		catalogEntry: PropTypes.object
	}

	render () {
		const { item, item: { title }, catalogEntry} = this.props;

		return (
			<Layout className={cx('webinar-event')}>
				<Presentation.Asset propName="url" contentPackage={catalogEntry} type="thumb">
					<Icon />
				</Presentation.Asset>
				<div className="webinar-content">
					<div className="webinar-meta">
						<div className="webinar-title">{title}</div>
						<List.SeparatedInline className="webinar-subtitle">
							<div className="times">{DateTime.format(item.getStartTime(), 'h:mm')}-{DateTime.format(item.getEndTime(), 'h:mm a')}</div>
						</List.SeparatedInline>
					</div>
				</div>
			</Layout>
		);
	}
}
