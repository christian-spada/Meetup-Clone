import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './GroupCard.css';
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
	}, [group.id, user, isMemberPage]);

	let memberBtns;
	if (isMemberPage) {
		memberStatus === 'host'
			? (memberBtns = (
					<div className="group-card__host-btns">
						<Link to={`/groups/${group.id}/edit`} className="group-card__update-btn">
							Update
						</Link>
						<OpenModalMenuItem
							className="group-card__delete-btn"
							itemText="Delete"
							modalComponent={<ConfirmDeleteModal groupToDelete={group} />}
						/>
					</div>
			  ))
			: (memberBtns = (
					<div>
						<button className="group-card__member-btn">Unjoin</button>
					</div>
			  ));
	}

	return (
		<div className="group-card" onClick={handleGroupClick}>
			<div className="group-card__img-container">
				<img className="group-card__img" src={group.previewImage} alt="img" />
			</div>
			<div className="group-card__info-container">
				<h2 className="group-card__title">{group.name}</h2>
				<p className="group-card__location">
					{group.city}, {group.state}
				</p>
				<p className="group-card__group-about">{group.about}</p>
				<div className="group-card__btn-row">
					<div className="group-card__event-visibility-info">
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
