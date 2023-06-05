import { useHistory } from 'react-router-dom';
import './GroupsListPage.css';

const GroupCard = ({ group }) => {
	const history = useHistory();

	const handleGroupClick = () => {
		history.push(`/groups/${group.id}`);
	};

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
				<p>
					{group.city}, {group.state}
				</p>
				<p>{group.about}</p>
				<div className="card__status-info">
					<p>## events</p>
					<span>•</span>
					<p>{group.private ? 'Private' : 'Public'}</p>
				</div>
			</div>
		</div>
	);
};

export default GroupCard;
