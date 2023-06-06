import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './GroupsListPage.css';
import { csrfFetch } from '../../store/csrf';

const GroupCard = ({ group, isMemberPage }) => {
	const history = useHistory();
	const [memberStatus, setMemberStatus] = useState('');
	const user = useSelector(state => state.session.user);

	const handleGroupClick = () => {
		history.push(`/groups/${group.id}`);
	};

	useEffect(() => {
		if (isMemberPage) {
			csrfFetch(`/api/groups/${group.id}/members`)
				.then(res => res.json())
				.then(data => data.Members.filter(member => member.id === user.id)[0])
				.then(userMemberData => setMemberStatus(userMemberData.Membership.status));
		}
	}, []);

	let memberBtns;
	if (isMemberPage) {
		memberStatus === 'host'
			? (memberBtns = (
					<div className="card__host-btns">
						<button className="card__update-btn">Update</button>
						<button className="card__delete-btn">Delete</button>
					</div>
			  ))
			: (memberBtns = (
					<div>
						<button className="card__member-btn">Unjoin</button>
					</div>
			  ));
	}

	return (
		<div className="card" onClick={handleGroupClick}>
			<div className="card__img-container">
				<img
					className="card__img"
					src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
					alt="img"
				/>
			</div>
			<div className="card__info-container">
				<h2 className="card__title">{group.name}</h2>
				<p className="card__location">
					{group.city}, {group.state}
				</p>
				<p className="card__group-about">{group.about}</p>
				<div className="card__btn-row">
					<div className="card__event-visibility-info">
						<span>## events</span>
						<span>•</span>
						<span>{group.private ? 'Private' : 'Public'}</span>
					</div>
					{memberBtns}
				</div>
			</div>
		</div>
	);
};

export default GroupCard;
