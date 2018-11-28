import React from 'react';
import PropTypes from 'prop-types';
import { Flyout, Prompt } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

import CalendarList from './calendar-list';

const { Dialog } = Prompt;

const t = scoped('nti.web.calendar.header', {
	title: 'Calendars',
	exportHeader: 'Export your Calendars',
	exportLink: 'Export Calendars',
	exportMessage: 'Export your calendars and add them to your favorite app. They will stay in sync as new events are added.'
});

export default class CalendarHeader extends React.Component {
	state = {
		showOptions: false
	}

	attachFlyoutRef = x => this.flyout = x;

	onOptionsClick = () => {
		this.setState({ showOptions: !this.state.showOptions });
	}

	renderExport () {
		return (
			<div className="export-calendar">
				<div className="export-content">
					<div className="export-header">
						<div className="download-icon">
							<i className="icon-download" />
						</div>
						{t('exportHeader')}
					</div>
					<div className="export-message">{t('exportMessage')}</div>
					<div className="export-link">{t('exportLink')}</div>
				</div>
			</div>
		);
	}

	renderListTrigger () {
		return (
			<div className="calendars-list">
				{t('title')}
				<i className="icon-chevron-down-10" />
				<i className="icon-chevron-up-10" />
			</div>
		);
	}

	render () {
		return (
			<>
				<div className="calendar-header">
					<Flyout.Triggered
						className="calendar-list-trigger"
						trigger={this.renderListTrigger()}
						verticalAlign={Flyout.ALIGNMENTS.BOTTOM}
						horizontalAlign={Flyout.ALIGNMENTS.LEFT}
						ref={this.attachFlyoutRef}

					>
						<CalendarList />
					</Flyout.Triggered>
					<div className="controls">
						<i className="icon-more" onClick={this.onOptionsClick} />
						<i className={cx('icon-bold-x', {active: this.state.showOptions})} />
					</div>
				</div>
				{this.state.showOptions && this.renderExport()}
			</>
		);
	}
}
