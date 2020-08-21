import './Body.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Scroll, Loading } from '@nti/web-commons';
import { Connectors } from '@nti/lib-store';
import { scoped } from '@nti/lib-locale';

import Day from './day';
import BodyEdge from './BodyEdge';
const { BoundaryMonitor } = Scroll;

const t = scoped('nti.web.calendar.body', {
	empty: 'No Calendar Events.'
});

function hasRealData (bins) {
	if(!bins || bins.length === 0) {
		return false;
	}

	for(let bin of bins) {
		if(bin.items && bin.items.length > 0) {
			return true;
		}
	}

	return false;
}

export default
@Connectors.Any.connect([
	'bins',
	'loading',
	'error',
	'calendars',
	'loadMoreAfter',
	'loadMoreBefore',
	'hasPrev',
	'prevLoading',
	'hasNext',
	'nextLoading',
	'loaded'
])
class CalendarBody extends React.Component {

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
		pullToLoad: PropTypes.bool,
		loaded: PropTypes.bool
	}

	static defaultProps = {
		bins: []
	}

	componentDidUpdate (prevProps) {
		const { hasPrev, loading, loadMoreBefore } = this.props;

		const hasFinishedLoading = prevProps.loading === true && loading === false;
		const prevLoading = prevProps.prevLoading === true && this.props.prevLoading === false;

		if ((hasFinishedLoading || prevLoading) && this.boundaryNode && this.today) {
			if (this.todayScrollPosition) {
				this.boundaryNode.setScrollTop(this.today.offsetTop - this.todayScrollPosition - this.boundaryNode.getOffsetTop());
			} else {
				this.boundaryNode.setScrollTop(this.today.offsetTop - this.boundaryNode.getOffsetTop());
			}
		}

		if (hasFinishedLoading && this.boundaryNode && !this.boundaryNode.canScroll() && hasPrev) {
			this.todayScrollPosition = this.today && this.today.offsetTop;

			loadMoreBefore();
		}
	}

	attachBoundaryRef = x => this.boundaryNode = x;
	setToday = x => this.today = x;

	onTop = () => {
		if (!this.props.hasPrev) { return; }
		this.todayScrollPosition = this.today.offsetTop;
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

	renderEmpty () {
		return (
			<div className="calendar-body">
				<div className="calendar-empty">{t('empty')}</div>
			</div>
		);
	}

	render () {
		const {
			loading,
			loaded,
			error,
			calendars,
			bins,
			hasPrev,
			prevLoading,
			hasNext,
			nextLoading,
			pullToLoad = true
		} = this.props;

		const isEmpty = !hasNext && !hasPrev && !hasRealData(bins);

		if (isEmpty) {
			return this.renderEmpty();
		}

		return (
			<BoundaryMonitor
				ref={this.attachBoundaryRef}
				className="calendar-body"
				onTop={loaded ? this.onTop : null}
				onBottom={loaded ? this.onBottom : null}
			>
				<div>
					{loading && <Loading.Spinner className="calendar-body-loading"/>}
					{error && this.renderError()}

					{pullToLoad && <BodyEdge mainLoading={!!loading} loading={prevLoading} hasMore={hasPrev} error={error} />}
					{bins.map(bin => (
						<Day
							setToday={this.setToday}
							calendars={calendars}
							key={bin.name}
							bin={bin}
						/>
					))}
					{pullToLoad && <BodyEdge mainLoading={!!loading} loading={nextLoading} hasMore={hasNext} error={error} />}
				</div>
			</BoundaryMonitor>
		);
	}
}
