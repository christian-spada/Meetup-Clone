import { useHistory } from 'react-router-dom';
import './EventsListPage.css';
import { useDispatch } from 'react-redux';
import { getSingleEventThunk as getSingleEvent } from '../../../store/events';

export const EventCard = ({ event }) => {
	const history = useHistory();
	const dispatch = useDispatch();

	const handleEventClick = () => {
		dispatch(getSingleEvent(event.id));

		history.push(`/events/${event.id}`);
	};

	console.log(event.name, event.startDate, event.endDate);

	return (
		<div className="card" onClick={handleEventClick}>
			<div className="card__img-container">
				<img
					className="card__img"
					src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
					alt="img"
				/>
			</div>
			<div className="card__info-container">
				<span>{event.startDate}</span>
				<h2 className="card__title">{event.name}</h2>
				<p className="card__location">
					{event.Venue.city}, {event.Venue.state}
				</p>
				<p className="card__event-about">{event.about}</p>
				<div className="card__status-info">
					<p>## events</p>
					<span>•</span>
					<p>{event.private ? 'Private' : 'Public'}</p>
				</div>
			</div>
		</div>
	);
};
