import React from 'react';
import PropTypes from 'prop-types';

import { reportError } from '@nti/web-client';
import { Error } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';

import Registry from './Registry';

const registry = Registry.getInstance();

function makeContextFor(item) {
	return {
		courseNTIID: item?.CatalogEntry?.CourseNTIID,
	};
}

export default class EventItem extends React.Component {
	static canRender(item) {
		return !!registry.getItemFor(item.MimeType);
	}

	static propTypes = {
		item: PropTypes.object,
		bin: PropTypes.object,
		context: PropTypes.object,
		readOnly: PropTypes.bool,
		onItemClick: PropTypes.func,
	};

	state = {};

	componentDidCatch(error) {
		reportError(error);
		this.setState({ error });
	}

	render() {
		const {
			props: { item, bin },
			state: { error },
			props,
		} = this;

		if (error) {
			return (
				<Error error={error} inline>
					There was an error attempting to render:{' '}
					{(item || {}).MimeType || 'Unknown Item'}
				</Error>
			);
		}

		const Cmp = registry.getItemFor(item.MimeType);

		const bins = bin.getBinsFor(item);
		const dayIndex = bins.indexOf(bin.name);

		return (
			<LinkTo.Object
				className="event-link"
				object={item}
				context={makeContextFor(item)}
			>
				<Cmp
					item={item}
					day={dayIndex}
					numberOfDays={bins.length}
					{...props}
				/>
			</LinkTo.Object>
		);
	}
}
