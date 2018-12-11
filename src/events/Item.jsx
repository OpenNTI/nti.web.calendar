import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

import Registry from './Registry';

const registry = Registry.getInstance();

function makeContextFor (catalogEntry) {
	return {
		courseNTIID: catalogEntry && catalogEntry.CourseNTIID
	};
}

export default class EventItem extends React.Component {
	static canRender (item) {
		return !!registry.getItemFor(item.MimeType);
	}

	static propTypes = {
		item: PropTypes.object,
		bin: PropTypes.object,
		context: PropTypes.object,
		readOnly: PropTypes.bool,
		onItemClick: PropTypes.func,
		catalogEntry: PropTypes.object
	}

	state = {}

	componentDidCatch (error) {
		this.setState({ error });
	}

	render () {
		const {
			props: { item, bin },
			state: { error },
			props
		} = this;

		if (error) {
			return (
				<div>There was an error attempting to render: {(item || {}).MimeType || 'Unknown Item'}</div>
			);
		}

		const Cmp = registry.getItemFor(item.MimeType);

		const bins = bin.getBinsFor(item);
		const dayIndex = bins.indexOf(bin.name);

		return (
			<LinkTo.Object className="event-link" object={item} context={makeContextFor(props.catalogEntry)}>
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
