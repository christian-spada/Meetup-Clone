import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './GroupsListPage.css';
import { setMembershipStatus } from '../../../utils/fetch-helpers.js';
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem';
import ConfirmDeleteModal from '../../ConfirmDeleteModal/ConfirmDeleteModal';
import { Link } from 'react-router-dom';

const GroupCard = ({ group, isMemberPage }) => {
	const history = useHistory();
	const [memberStatus, setMemberStatus] = useState('');
	const user = useSelector(state => state.session.user);

	const handleGroupClick = ({ target }) => {
		const isActionBtn =
			target.innerText === 'Update' ||
			target.innerText === 'Delete' ||
			target.innerText === 'Unjoin';
		if (isActionBtn) return;

		history.push(`/groups/${group.id}`);
	};

	useEffect(() => {
		if (isMemberPage) {
			setMembershipStatus(group.id, user, setMemberStatus);
		}
	}, []);

	let memberBtns;
	if (isMemberPage) {
		memberStatus === 'host'
			? (memberBtns = (
					<div className="card__host-btns">
						<Link to={`/groups/${group.id}/edit`} className="card__update-btn">
							Update
						</Link>
						<OpenModalMenuItem
							className="card__delete-btn"
							itemText="Delete"
							modalComponent={<ConfirmDeleteModal groupToDelete={group} />}
						/>
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
						<span>
							{group.numMembers !== 1
								? `${group.numMembers} Members`
								: `${group.numMembers} Member`}
						</span>
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
