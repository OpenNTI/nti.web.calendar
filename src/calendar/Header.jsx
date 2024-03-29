import './Header.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { Connectors } from '@nti/lib-store';

import CalendarList from './calendar-list';
import CalendarExport from './export';

const t = scoped('calendar.header', {
	title: 'Calendars',
});

class CalendarHeader extends React.Component {
	static propTypes = {
		calendars: PropTypes.array,
		filters: PropTypes.array.isRequired,
		onClose: PropTypes.func,
		collection: PropTypes.shape({
			getLink: PropTypes.func.isRequired,
		}),
		setFilters: PropTypes.func,
		additionalControls: PropTypes.any,
	};

	state = {
		showOptions: false,
		showFilters: false,
	};

	attachFlyoutRef = x => (this.flyout = x);

	onOptionsClick = () => {
		this.setState({
			showOptions: !this.state.showOptions,
			showFilters: false,
		});
	};

	onFiltersClick = () => {
		this.setState({
			showFilters: !this.state.showFilters,
			showOptions: false,
		});
	};

	onClose = () => {
		const { onClose } = this.props;

		if (onClose) {
			onClose();
		}
	};

	renderExport() {
		const { collection } = this.props;

		return (
			<div className="export-calendar">
				<CalendarExport calendar={collection} />
			</div>
		);
	}

	render() {
		const {
			additionalControls: AdditionalControls = null,
			calendars,
			filters,
			setFilters,
		} = this.props;
		const { showFilters, showOptions } = this.state;
		return (
			<>
				<div className="calendar-header">
					<div
						className={cx('calendars-list', { open: showFilters })}
						onClick={this.onFiltersClick}
					>
						{t('title')}
						<i className="icon-chevron-down-10" />
					</div>
					<div className="controls">
						{AdditionalControls && <AdditionalControls />}
						<i
							className={cx('icon-more', { active: showOptions })}
							onClick={this.onOptionsClick}
						/>
						<i className="icon-bold-x" onClick={this.onClose} />
					</div>
				</div>
				{showOptions && this.renderExport()}
				{showFilters && (
					<CalendarList
						calendars={calendars}
						filters={filters}
						setFilters={setFilters}
					/>
				)}
			</>
		);
	}
}

export default decorate(CalendarHeader, [
	Connectors.Any.connect([
		'calendars',
		'filters',
		'setFilters',
		'collection',
		'addFilter',
		'removeFilter',
	]),
]);
