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
	static propTypes = {
		calendars: PropTypes.array,
		filters: PropTypes.array,
		addFilter: PropTypes.func,
		removeFilter: PropTypes.func,
		onClose: PropTypes.func,
		exportLink: PropTypes.func
	}

	state = {
		showOptions: false,
		showFilters: false
	}

	attachFlyoutRef = x => this.flyout = x;

	onOptionsClick = () => {
		this.setState({ showOptions: !this.state.showOptions, showFilters: false });
	}

	onFiltersClick = () => {
		this.setState({ showFilters: !this.state.showFilters, showOptions: false });
	}

	onClose = () => {
		const {onClose} = this.props;

		if(onClose) {
			onClose();
		}
	}

	renderExport () {
		const { exportLink } = this.props;

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
					<div className="export-link">
						<a href={exportLink} download>{t('exportLink')}</a>
					</div>
				</div>
			</div>
		);
	}

	render () {
		const { calendars, filters, addFilter, removeFilter } = this.props;
		const { showFilters, showOptions } = this.state;
		return (
			<>
				<div className="calendar-header">
					<div className={cx('calendars-list', { open: showFilters })} onClick={this.onFiltersClick}>
						{t('title')}
						<i className="icon-chevron-down-10" />
						<i className="icon-chevron-up-10" />
					</div>
					<div className="controls">
						<i className={cx('icon-more', { active: showOptions })} onClick={this.onOptionsClick} />
						<i className="icon-bold-x" onClick={this.onClose}/>
					</div>
				</div>
				{showOptions && this.renderExport()}
				{showFilters && (
					<CalendarList calendars={calendars} filters={filters} addFilter={addFilter} removeFilter={removeFilter} />
				)}
			</>
		);
	}
}
