import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import './EventsListPage.css';
import { getAllEventsThunk as getAllEvents } from '../../../store/events';
import EventCard from '../EventCard';
import { sortEvents } from '../../../utils/helpers';

const EventsListPage = () => {
	const dispatch = useDispatch();
	const allEvents = useSelector(state => state.events.allEvents);
	const [currentSelection, setCurrentSelection] = useState('Events');

	useEffect(() => {
		dispatch(getAllEvents());
	}, [dispatch]);

	if (!allEvents) {
		return (
			<div className="events-view">
				<h3>Loading...</h3>
			</div>
		);
	}

	const allEventsArr = Object.values(allEvents);
	const sortedEvents = sortEvents(allEventsArr);

	return (
		<div className="events-view">
			<section className="events-view__group-event-selection-section">
				<div className="events-view__title-container">
					<NavLink
						to="/events"
						className={isActive => (isActive ? 'active' : 'inactive')}
						onClick={e => setCurrentSelection(e.target.innerText)}
					>
						Events
					</NavLink>
					<NavLink
						to="/groups"
						className={isActive => (isActive ? 'active' : 'inactive')}
						onClick={e => setCurrentSelection(e.target.innerText)}
					>
						Groups
					</NavLink>
				</div>
				<p>{currentSelection} in Meetup</p>
			</section>
			<section className="events-view__list">
				{sortedEvents?.map(event => (
					<EventCard key={event.id} event={event} />
				))}
			</section>
		</div>
	);
};

export default EventsListPage;
