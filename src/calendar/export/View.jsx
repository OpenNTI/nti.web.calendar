import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { decorate } from '@nti/lib-commons';
import { EmptyState, Loading, Input, Button } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Store from './Store';

const t = scoped('nti-calendar.export', {
	unavailable: 'Calendars are not available for export at this time.',
	header: 'Export your Calendars',
	message:
		'Export your calendars and add them to your favorite app. They will stay in sync as new events are added.',
	link: 'Download Calendars',
	exporting: 'Exporting...',
	copyLabel: 'Copy to Clipboard',
	copiedLabel: 'Copied!',
	copyButton: 'Copy',
});

class CalendarExport extends React.Component {
	static deriveBindingFromProps(props) {
		return props.calendar;
	}

	static propTypes = {
		calendar: PropTypes.shape({
			getLink: PropTypes.func,
		}),

		loading: PropTypes.bool,
		error: PropTypes.any,
		exportLink: PropTypes.string,
		feedLink: PropTypes.string,
	};

	state = { copied: false };

	onCopy = () => {
		this.setState({ copied: true });
	};

	render() {
		const { loading, error, exportLink, feedLink } = this.props;
		const { copied } = this.state;

		return (
			<div className="nti-calendar-export">
				{loading && <Loading.Spinner />}
				{!loading && error && (
					<EmptyState subHeader={t('unavailable')} />
				)}
				{!loading && !error && (
					<div className="export-container">
						<div className="header">
							<i className="icon-download" />
							<span>{t('header')}</span>
						</div>
						<div className="message">{t('message')}</div>
						<a href={exportLink} download className="export">
							{t('link')}
						</a>
						{feedLink && (
							<div className="feed">
								<Input.Label
									label={
										copied
											? t('copiedLabel')
											: t('copyLabel')
									}
								>
									<Input.Text readOnly value={feedLink} />
								</Input.Label>
								<CopyToClipboard
									text={feedLink}
									onCopy={this.onCopy}
								>
									<Button>{t('copyButton')}</Button>
								</CopyToClipboard>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}

export default decorate(CalendarExport, [
	Store.connect(['loading', 'error', 'feedLink', 'exportLink']),
]);
