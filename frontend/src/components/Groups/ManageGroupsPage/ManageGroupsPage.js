import GroupCard from '../GroupCard';
import { useEffect } from 'react';
import './ManageGroupsPage.css';
import '../GroupCard/GroupCard.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUserGroupsThunk as getUserGroups } from '../../../store/groups';

const ManageGroupsPage = () => {
	const dispatch = useDispatch();
	const userGroupData = useSelector(state => state.groups.allGroups);

	useEffect(() => {
		dispatch(getUserGroups());
	}, [dispatch]);

	const userGroups = Object.values(userGroupData);

	if (!userGroups.length) return <h3>You are not a member of any groups yet!</h3>;

	return (
		<div className="manage-groups-view">
			<section className="manage-groups-view__group-event-selection-section">
				<div className="manage-groups-view__title-container">
					<p>Your groups in Meetup</p>
				</div>
			</section>
			<section className="manage-groups-view__list">
				{userGroups.map(group => (
					<GroupCard key={group.id} group={group} isMemberPage={true} />
				))}
			</section>
		</div>
	);
};

export default ManageGroupsPage;
