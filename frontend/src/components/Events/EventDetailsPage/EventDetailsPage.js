import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './EventDetailsPage.css';
import { getSingleEventThunk as getSingleEvent } from '../../../store/events';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDateAndTime } from '../../../utils/helpers';

const EventDetailsPage = () => {
	const { eventId } = useParams();
	const dispatch = useDispatch();
	const event = useSelector(state => state.events.singleEvent);

	useEffect(() => {
		dispatch(getSingleEvent(eventId));
	}, []);

	if (!Object.values(event).length) {
		return <h3>Loading...</h3>;
	}

	const { formattedDate: startDate, formattedTime: startTime } = formatDateAndTime(event.startDate);
	const { formattedDate: endDate, formattedTime: endTime } = formatDateAndTime(event.endDate);

	return (
		<div className="event-details">
			<section className="event-details__heading-section">
				<div className="event-details__heading-info-container">
					<div className="event-details__breadcrumb-container">
						<span>
							<i className="fa-solid fa-arrow-left"></i>
						</span>
						<NavLink to="/events">Events</NavLink>
					</div>
					<div className="event-details__event-info-container">
						<h2>{event.name}</h2>
						<p>host by firstname lastname</p>
					</div>
				</div>
			</section>
			<section className="event-details__details-section">
				<div className="event-details__details-grid">
					<img
						src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
						alt="img"
					/>
					<div className="event-details__group-card">
						<img
							src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
							alt="img"
						/>
						<div className="event-details__group-card-info">
							<h3>Group name</h3>
							<p>Public</p>
						</div>
					</div>
					<div className="event-details__event-info-card">
						<div className="event-details__date-container">
							<span>
								<i className="fa-regular fa-clock"></i>
							</span>
							<div className="event-details__dates">
								<div>
									<span>START</span>
									<span>{startDate}</span>
									<span>•</span>
									<span>{startTime}</span>
								</div>
								<div>
									<span>END</span>
									<span>{endDate}</span>
									<span>•</span>
									<span>{endTime}</span>
								</div>
							</div>
						</div>
						<div className="event-details__price-container">
							<span>
								<i className="fa-solid fa-dollar-sign"></i>
							</span>
							<span>Price</span>
						</div>
						<div className="event-details__type-container">
							<span>
								<i className="fa-solid fa-map-pin"></i>
							</span>
							<span>In person</span>
						</div>
					</div>
					<div className="event-details__details-desc">
						<h3>Details</h3>
						<p>
							filler text filler text filler text filler text filler text filler text filler text
							filler text filler text filler text filler text filler text filler text filler text
							filler text filler text filler text filler text filler text filler text
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default EventDetailsPage;
