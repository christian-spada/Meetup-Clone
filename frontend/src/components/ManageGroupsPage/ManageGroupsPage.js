import GroupCard from '../GroupListPage/GroupCard';
import { useEffect, useState } from 'react';
import { csrfFetch } from '../../store/csrf';
import './ManageGroupsPage.css';

const ManageGroupsPage = () => {
	const [userGroups, setUserGroups] = useState([]);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		csrfFetch('/api/groups/current')
			.then(res => res.json())
			.then(data => setUserGroups(data.Groups))
			.catch(err => setErrors(err));
	}, []);

	if (!userGroups) return <h3>Loading...</h3>;

	return (
		<div className="manage-groups-view">
			<section className="manage-groups-view__group-event-selection-section">
				<div className="manage-groups-view__title-container">
					<p>Your groups in Meetup</p>
				</div>
			</section>
			<section className="manage-groups-view__list">
				{userGroups.map((group, idx, arr) => (
					<GroupCard key={group.id} group={group} isMemberPage={true} />
				))}
			</section>
		</div>
	);
};

export default ManageGroupsPage;
