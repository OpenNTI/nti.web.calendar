import React from 'react';

export class ErrorBoundary extends React.Component {
	state = {};

	componentDidCatch(error) {
		this.setState({ error });
	}

	render() {
		const {
			props: { children, fallback },
			state: { error },
		} = this;

		let content = children;

		if (!fallback) {
			throw new Error('ErrorBoundary used without fallback');
		}

		if (error) {
			content = React.isValidElement(fallback)
				? React.cloneElement(fallback, { error })
				: fallback
				? React.createElement(fallback, { error })
				: null;
		}

		return content;
	}
}
