import { NavLink, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import './GroupDetailsPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllGroupsThunk as getAllGroups } from '../../store/groups';

const GroupDetailsPage = () => {
	const dispatch = useDispatch();
	const { groupId } = useParams();
	const groups = useSelector(state => state.groups.allGroups);

	let groupToDisplay;
	if (groups) {
		groupToDisplay = groups[groupId];
	}

	useEffect(() => {
		dispatch(getAllGroups());
	}, []);

	if (!groupToDisplay) return <h3>Loading...</h3>;

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
						<h2>{groupToDisplay.name}</h2>
						<p>
							{groupToDisplay.city}, {groupToDisplay.state}
						</p>
						<div className="group-details__group-status-container">
							<p>## events</p>
							<span>•</span>
							<p>{groupToDisplay.private ? 'Private' : 'Public'}</p>
						</div>
						<p>Organized by first last</p>
					</div>
					<button className="group-details__join-group-btn">Join this group</button>
				</div>
			</section>
		</div>
	);
};

export default GroupDetailsPage;
