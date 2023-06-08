import { NavLink, useParams } from 'react-router-dom';
import './GroupDetailsPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getSingleGroupThunk as getSingleGroup } from '../../store/groups';
import { setMembershipStatus } from '../../utils/fetch-helpers';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';

const GroupDetailsPage = () => {
	const dispatch = useDispatch();
	const { groupId } = useParams();
	const group = useSelector(state => state.groups.singleGroup);
	const [memberStatus, setMemberStatus] = useState('');
	const user = useSelector(state => state.session.user);

	useEffect(() => {
		dispatch(getSingleGroup(groupId));
	}, [dispatch]);

	console.log(group);
	if (!Object.values(group).length) return <h3>Loading...</h3>;

	setMembershipStatus(groupId, user, setMemberStatus);

	const { firstName, lastName } = group.Organizer;

	let actionBtns;
	if (memberStatus === 'host') {
		actionBtns = (
			<div className="group-details__action-btns">
				<NavLink to={`/groups/${groupId}/events/new`}>Create Event</NavLink>
				<NavLink to={`/groups/${groupId}/edit`}>Update</NavLink>
				<OpenModalMenuItem
					className="card__delete-btn"
					itemText="Delete"
					modalComponent={<ConfirmDeleteModal groupToDelete={group} />}
				/>
			</div>
		);
	} else if (memberStatus === undefined) {
		actionBtns = <button className="group-details__join-group-btn">Join this group</button>;
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
						src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
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
							<p>## events</p>
							<span>•</span>
							<p>{group.private ? 'Private' : 'Public'}</p>
						</div>
						<p>
							Organized by {firstName} {lastName}
						</p>
						{actionBtns}
					</div>
				</div>
			</section>
			<section className="group-details__more-details-section">
				<div className="group-details__more-details-container">
					<div className="group-details__organizer-info">
						<h2>Organizer</h2>
						<p>
							{firstName} {lastName}
						</p>
					</div>
					<div className="group-details__about-info">
						<h2>What we're about</h2>
						<p>{group.about}</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default GroupDetailsPage;
