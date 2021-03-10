import React from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@nti/web-commons';

export default class BodyEdge extends React.Component {
	static propTypes = {
		mainLoading: PropTypes.bool.isRequired,
		loading: PropTypes.bool.isRequired,
		hasMore: PropTypes.bool.isRequired,
		error: PropTypes.object,
	};

	render() {
		const { mainLoading, loading, hasMore, error } = this.props;
		const isLoading = mainLoading || loading;
		const hasMoreEvents = !isLoading && !error && hasMore;
		return (
			<>
				{loading && (
					<Loading.Spinner className="calendar-edge-loading" />
				)}
				{hasMoreEvents && <div className="calendar-edge-spacer" />}
			</>
		);
	}
}
