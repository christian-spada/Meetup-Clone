import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGroupsThunk as getAllGroups } from '../../store/groups';
import GroupCard from './GroupCard';
import './GroupsListPage.css';

const GroupsListPage = () => {
	const dispatch = useDispatch();
	const allGroups = useSelector(state => state.groups.allGroups);
	const [currentSelection, setCurrentSelection] = useState('Groups');

	useEffect(() => {
		dispatch(getAllGroups());
	}, []);

	if (!allGroups) {
		return (
			<div className="groups-view">
				<h3>Loading...</h3>
			</div>
		);
	}

	const allGroupsArr = Object.values(allGroups);

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
				{allGroupsArr?.map(group => (
					<GroupCard key={group.id} group={group} />
				))}
			</section>
		</div>
	);
};

export default GroupsListPage;
