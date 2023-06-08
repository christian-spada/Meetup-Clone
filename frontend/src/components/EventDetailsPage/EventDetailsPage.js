import { NavLink } from 'react-router-dom';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
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
						<h2>Event Name</h2>
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
									<span>YYYY-MM-DD</span>
									<span>•</span>
									<span>Time</span>
								</div>
								<div>
									<span>END</span>
									<span>YYYY-MM-DD</span>
									<span>•</span>
									<span>Time</span>
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
