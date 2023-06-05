import { useState } from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import GroupCard from './GroupCard';
import './GroupsListPage.css';

const GroupsListPage = () => {
	const [currentSelection, setCurrentSelection] = useState('');
	return (
		<div className="groups-view">
			<section className="groups-view__group-event-selection-section">
				<div className="groups-view__title-container">
					<NavLink
						to="/events"
						className={isActive => (isActive ? 'active' : 'inactive')}
						onClick={e => setCurrentSelection(e.target.innerText)}
					>
						Events
					</NavLink>
					<NavLink
						to="/groups"
						className={isActive => (isActive ? 'active' : 'inactive')}
						onClick={e => setCurrentSelection(e.target.innerText)}
					>
						Groups
					</NavLink>
				</div>
				<p>{currentSelection} in Meetup</p>
			</section>
			<section className="groups-view__list">
				{[1, 2, 3].map(el => {
					return <GroupCard />;
				})}
			</section>
		</div>
	);
};

export default GroupsListPage;
