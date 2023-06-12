import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './EventDetailsPage.css';
import { getSingleEventThunk as getSingleEvent } from '../../../store/events';
import { getSingleGroupThunk as getSingleGroup } from '../../../store/groups';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDateAndTime } from '../../../utils/helpers';
import ConfirmDeleteModal from '../../ConfirmDeleteModal';
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const EventDetailsPage = () => {
	const history = useHistory();
	const { eventId } = useParams();
	const dispatch = useDispatch();
	const event = useSelector(state => state.events.singleEvent);
	const group = useSelector(state => state.groups.singleGroup);
	const user = useSelector(state => state.session.user);

	useEffect(() => {
		dispatch(getSingleEvent(eventId));
	}, [dispatch, eventId]);

	useEffect(() => {
		if (Object.keys(event).length) {
			dispatch(getSingleGroup(event.groupId));
		}
	}, [dispatch, event]);

	if (!Object.keys(event).length) {
		return <h3>Loading...</h3>;
	}

	const { formattedDate: startDate, formattedTime: startTime } = formatDateAndTime(event.startDate);
	const { formattedDate: endDate, formattedTime: endTime } = formatDateAndTime(event.endDate);

	const groupOrganizer = group?.Organizer;

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
					<div className="event-details__heading-info">
						<h2>{event.name}</h2>
						<p>
							Hosted by {groupOrganizer?.firstName} {groupOrganizer?.lastName}
						</p>
					</div>
				</div>
			</section>
			<section className="event-details__details-section">
				<img
					className="event-details__event-img"
					src={event?.EventImages && event.EventImages[0] && event.EventImages[0].url}
					alt="img"
				/>
				<div className="event-details__event-info-container">
					<div
						onClick={() => history.push(`/groups/${group.id}`)}
						className="event-details__group-card"
					>
						<img
							src={group?.GroupImages && group.GroupImages[0] && group.GroupImages[0].url}
							alt="img"
						/>
						<div className="event-details__group-card-info">
							<h3>{group?.name}</h3>
							<p>{group?.private ? 'Private' : 'Public'}</p>
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
							<span>{event.price === 0 ? 'FREE' : `$ ${event.price}`}</span>
						</div>
						<div className="event-details__type-container">
							<div>
								<span>
									<i className="fa-solid fa-map-pin"></i>
								</span>
								<span className="event-details__margin-left">{event.type}</span>
							</div>
							<div>
								{user?.id === groupOrganizer?.id && (
									<OpenModalMenuItem
										className="event-details__delete-event-btn"
										itemText="Delete"
										modalComponent={
											<ConfirmDeleteModal eventToDelete={event} eventGroupId={group?.id} />
										}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="event-details__details-desc-section">
				<h3>Details</h3>
				<p>{event.description}</p>
			</section>
		</div>
	);
};

export default EventDetailsPage;
