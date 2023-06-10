import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import './EventsListPage.css';
import { getAllEventsThunk as getAllEvents } from '../../../store/events';
import { EventCard } from './EventCard';

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
	allEventsArr.sort((event1, event2) => {
		return new Date(event1.startDate) - new Date(event2.startDate);
	});

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
				{allEventsArr?.map(event => (
					<EventCard key={event.id} event={event} />
				))}
			</section>
		</div>
	);
};

export default EventsListPage;
