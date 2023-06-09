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
	const group = useSelector(state => state.groups.singleGroup);

	useEffect(() => {
		dispatch(getSingleGroup(event.groupId));
	}, [dispatch, event]);

	const handleEventClick = () => {
		dispatch(getSingleEvent(event.id));

		history.push(`/events/${event.id}`);
	};

	const { formattedDate, formattedTime } = formatDateAndTime(event.startDate);

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
				<div className="card__date-info">
					<span>{formattedDate}</span>
					<span>•</span>
					<span>{formattedTime}</span>
				</div>
				<h2 className="card__title">{event.name}</h2>
				<p className="card__location">
					{event.Venue?.city || group?.city}, {event.Venue?.state || group?.state}
				</p>
			</div>
		</div>
	);
};
