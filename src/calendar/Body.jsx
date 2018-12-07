import React from 'react';
import PropTypes from 'prop-types';
import { Scroll, Loading } from '@nti/web-commons';

import Day from './day';
import Store from './Store';
import BodyEdge from './BodyEdge';
const { BoundaryMonitor } = Scroll;

@Store.connect(['bins', 'loading', 'error', 'calendars', 'loadMoreAfter', 'loadMoreBefore', 'hasPrev', 'prevLoading', 'hasNext', 'nextLoading'])
export default class CalendarBody extends React.Component {

	static propTypes = {
		bins: PropTypes.array,
		calendars: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.object,
		loadMoreAfter: PropTypes.func,
		loadMoreBefore: PropTypes.func,
		hasNext: PropTypes.bool,
		hasPrev: PropTypes.bool,
		nextLoading: PropTypes.bool,
		prevLoading: PropTypes.bool,
		pullToLoad: PropTypes.bool
	}

	static defaultProps = {
		bins: []
	}

	componentDidUpdate (prevProps) {
		const mainLoading = prevProps.loading === true && this.props.loading === false;
		const prevLoading = prevProps.prevLoading === true && this.props.prevLoading === false;
		if ((mainLoading || prevLoading) && this.boundaryNode) {
			this.boundaryNode.setScrollTop(50);
		}
	}

	attachBoundaryRef = x => this.boundaryNode = x;

	onTop = () => {
		if (!this.props.hasPrev) { return; }

		this.props.loadMoreBefore();
	}

	onBottom = () => {
		if (!this.props.hasNext) { return; }

		this.props.loadMoreAfter();
	}

	renderError () {
		const { error } = this.props;
		return (
			<div className="calendar-error">
				{error.message || 'Unable to load.'}
			</div>
		);
	}

	render () {
		const {
			loading,
			error,
			calendars,
			bins,
			hasPrev,
			prevLoading,
			hasNext,
			nextLoading,
			pullToLoad = true
		} = this.props;

		return (
			<BoundaryMonitor
				ref={this.attachBoundaryRef}
				className="calendar-body"
				onTop={!loading ? this.onTop : null}
				onBottom={!loading ? this.onBottom : null}
			>
				{loading && <Loading.Spinner className="calendar-body-loading"/>}
				{error && this.renderError()}

				{pullToLoad && <BodyEdge mainLoading={loading} loading={prevLoading} hasMore={hasPrev} error={error} />}
				{bins.map(bin => <Day calendars={calendars} key={bin.name} bin={bin} />)}
				{pullToLoad && <BodyEdge mainLoading={loading} loading={nextLoading} hasMore={hasNext} error={error} />}
			</BoundaryMonitor>
		);
	}
}
