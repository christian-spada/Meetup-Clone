import { useHistory } from 'react-router-dom';
import './EventsListPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleEventThunk as getSingleEvent } from '../../../store/events';
import { formatDateAndTime } from '../../../utils/helpers';
import { useEffect } from 'react';
import { getSingleGroupThunk as getSingleGroup } from '../../../store/groups';

export const EventCard = ({ event }) => {
	const history = useHistory();
	const dispatch = useDispatch();

	const handleEventClick = () => {
		history.push(`/events/${event.id}`);
	};

	console.log(event);
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
		</div>
	);
};
