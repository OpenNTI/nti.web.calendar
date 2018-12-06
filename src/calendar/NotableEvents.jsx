import React from 'react';
import PropTypes from 'prop-types';

import Body from './Body';
import Store from './Store';

export default
@Store.connect(['bins', 'loading', 'error',  'calendars'])
class NotableEvents extends React.Component {

	constructor (props) {
		super(props);
		const {store, limit = 5} = props || {};
		(store || {}).batchSize = limit;
	}

	static deriveBindingFromProps  = ({entity} = {}) => entity || null;

	static propTypes = {
		entity: PropTypes.object,
		store: PropTypes.object,
		bins: PropTypes.array,
		calendars: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.object
	}

	render () {
		const {bins, calendars, loading, error, limit = 5} = this.props;
		const props = {
			bins: (bins || []).slice(0, limit),
			calendars,
			loading,
			error
		};

		return (
			<Body {...props} />
		);
	}
}
