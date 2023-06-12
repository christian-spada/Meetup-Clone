import { useHistory } from 'react-router-dom';
import './EventCard.css';
import { formatDateAndTime } from '../../../utils/helpers';

const EventCard = ({ event }) => {
	const history = useHistory();

	const handleEventClick = () => {
		history.push(`/events/${event.id}`);
	};

	const { formattedDate, formattedTime } = formatDateAndTime(event.startDate);

	return (
		<div className="event-card" onClick={handleEventClick}>
			<div className="event-card__details">
				<div className="event-card__img-container">
					<img className="event-card__img" src={event.previewImage} alt="img" />
				</div>
				<div className="event-card__info-container">
					<div className="event-card__date-info">
						<span>{formattedDate}</span>
						<span>•</span>
						<span>{formattedTime}</span>
					</div>
					<h2 className="event-card__title">{event.name}</h2>
					<p className="event-card__location">
						{event.Venue.city}, {event.Venue.state}
					</p>
				</div>
			</div>
			<div className="event-card__description">
				<p>{event.description}</p>
			</div>
		</div>
	);
};

export default EventCard;
