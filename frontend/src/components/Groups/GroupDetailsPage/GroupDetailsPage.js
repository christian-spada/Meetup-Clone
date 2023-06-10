import { NavLink, useParams } from 'react-router-dom';
import './GroupDetailsPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
	getGroupEventsThunk as getGroupEvents,
	getSingleGroupThunk as getSingleGroup,
} from '../../../store/groups';
import { setMembershipStatus } from '../../../utils/fetch-helpers';
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem';
import ConfirmDeleteModal from '../../ConfirmDeleteModal/ConfirmDeleteModal';
import { EventCard } from '../../Events/EventsListPage/EventCard';

const GroupDetailsPage = () => {
	const dispatch = useDispatch();
	const { groupId } = useParams();
	const group = useSelector(state => state.groups.singleGroup);
	const events = useSelector(state => state.groups.allGroupEvents);
	const [memberStatus, setMemberStatus] = useState('');
	const [isDeletingGroup, setIsDeletingGroup] = useState(false);
	const user = useSelector(state => state.session.user);

	useEffect(() => {
		dispatch(getSingleGroup(groupId));
	}, [dispatch, groupId]);

	useEffect(() => {
		dispatch(getGroupEvents(groupId));
	}, [dispatch, groupId]);

	const eventsArr = Object.values(events);

	if (!Object.values(group).length) return <h3>Loading...</h3>;

	if (user && !isDeletingGroup) {
		setMembershipStatus(groupId, user, setMemberStatus);
	}

	eventsArr?.sort((event1, event2) => {
		return new Date(event1.startDate) - new Date(event2.startDate);
	});

	const { firstName, lastName } = group.Organizer;

	let actionBtns;
	if (memberStatus === 'host') {
		actionBtns = (
			<div className="group-details__action-btns">
				<NavLink className="group-details__create-event-btn" to={`/groups/${groupId}/events/new`}>
					Create Event
				</NavLink>
				<NavLink className="group-details__update-group-btn" to={`/groups/${groupId}/edit`}>
					Update
				</NavLink>
				<OpenModalMenuItem
					className="group-details__delete-btn"
					itemText="Delete"
					modalComponent={
						<ConfirmDeleteModal groupToDelete={group} setIsDeletingGroup={setIsDeletingGroup} />
					}
				/>
			</div>
		);
	} else {
		actionBtns = (
			<div className="group-details__join-btn-container">
				<button
					className="group-details__join-group-btn"
					onClick={() => alert('Feature coming soon')}
				>
					Join this group
				</button>
			</div>
		);
	}

	return (
		<div className="group-details">
			<section className="group-details__group-section">
				<div className="group-details__img-container">
					<div className="group-details__breadcrumb">
						<span>
							<i className="fa-solid fa-arrow-left"></i>
						</span>
						<NavLink to="/groups">Groups</NavLink>
					</div>
					<img
						className="group-details__group-image"
						src={group?.GroupImages && group.GroupImages[0] && group.GroupImages[0].url}
						alt="img"
					></img>
				</div>
				<div className="group-details__group-info-container">
					<div className="group-details__group-info">
						<h2>{group.name}</h2>
						<p>
							{group.city}, {group.state}
						</p>
						<div className="group-details__group-status-container">
							<p>
								{eventsArr?.length !== 1
									? `${eventsArr.length} Events`
									: `${eventsArr.length} Event`}
							</p>
							<span>•</span>
							<p>{group.private ? 'Private' : 'Public'}</p>
						</div>
						<p>
							Organized by {firstName} {lastName}
						</p>
					</div>
					<div className="group-details__action-btns-container">{user && actionBtns}</div>
				</div>
			</section>
			<section className="group-details__more-details-section">
				<div className="group-details__more-details-container">
					<div className="group-details__organizer-info">
						<h3>Organizer</h3>
						<p>
							{firstName} {lastName}
						</p>
					</div>
					<div className="group-details__about-info">
						<h2>What we're about</h2>
						<p>{group.about}</p>
					</div>
					<div className="group-details__events-container">
						<h3>Upcoming Events (#{eventsArr?.length})</h3>
						<div className="group-details__event-cards">
							{eventsArr?.map(event => (
								<EventCard key={event.id} event={event} />
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default GroupDetailsPage;
