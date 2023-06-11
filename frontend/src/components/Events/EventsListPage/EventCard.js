import { useHistory } from 'react-router-dom';
import './EventsListPage.css';
import { formatDateAndTime } from '../../../utils/helpers';

export const EventCard = ({ event }) => {
	const history = useHistory();

	const handleEventClick = () => {
		history.push(`/events/${event.id}`);
	};

	const { formattedDate, formattedTime } = formatDateAndTime(event.startDate);

	return (
		<div className="card" onClick={handleEventClick}>
			<div className="card__img-container">
				<img className="card__img" src={event.previewImage} alt="img" />
			</div>
			<div className="card__info-container">
				<div className="card__date-info">
					<span>{formattedDate}</span>
					<span>•</span>
					<span>{formattedTime}</span>
				</div>
				<h2 className="card__title">{event.name}</h2>
				<p className="card__location">
					{event.Venue.city}, {event.Venue.state}
				</p>
			</div>
			<div className="card__description">
				<p>{event.description}</p>
			</div>
		</div>
	);
};
