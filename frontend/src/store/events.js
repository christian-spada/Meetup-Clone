import { csrfFetch } from './csrf';
import { normalizeData } from './storeUtils';

// === ACTIONS ===
const GET_ALL_EVENTS = 'events/getAllEvents';
const CREATE_EVENT = 'events/createEvent';
const GET_SINGLE_EVENT = 'events/getSingleEvent';
const DELETE_EVENT = 'events/deleteEvent';

const getAllEvents = events => {
	return {
		type: GET_ALL_EVENTS,
		payload: events,
	};
};

const getSingleEvent = event => {
	return {
		type: GET_SINGLE_EVENT,
		payload: event,
	};
};

const createEvent = event => {
	return {
		type: CREATE_EVENT,
		payload: event,
	};
};

const deleteEvent = eventToDelete => {
	return {
		type: DELETE_EVENT,
		payload: eventToDelete,
	};
};

// === THUNKS ===
export const getAllEventsThunk = () => async dispatch => {
	try {
		const res = await csrfFetch('/api/events');

		const eventsData = await res.json();
		dispatch(getAllEvents(eventsData.Events));

		return eventsData.Events;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const getSingleEventThunk = eventId => async dispatch => {
	try {
		const res = await csrfFetch(`/api/events/${eventId}`);

		const event = await res.json();
		dispatch(getSingleEvent(event));

		return event;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const addImageToEventThunk = (image, eventId) => async dispatch => {
	try {
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const createEventThunk = (event, groupId, image, venue) => async dispatch => {
	try {
		const res = await csrfFetch(`/api/groups/${groupId}/events`, {
			method: 'POST',
			body: JSON.stringify(event),
		});

		const newEvent = await res.json();
		newEvent.previewImage = image.url;
		newEvent.Venue = { id: venue.id, city: venue.city, state: venue.state };

		csrfFetch(`/api/events/${newEvent.id}/images`, {
			method: 'POST',
			body: JSON.stringify(image),
		});

		dispatch(createEvent(newEvent));

		return newEvent;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

export const deleteEventThunk = eventToDelete => async dispatch => {
	try {
		const res = await csrfFetch(`/api/events/${eventToDelete.id}`, {
			method: 'DELETE',
		});

		const message = await res.json();
		dispatch(deleteEvent(eventToDelete));
		console.log(message);
		return message;
	} catch (err) {
		console.log(err);
		return err;
	}
};

// === REDUCER ===

const initialState = { allEvents: {}, singleEvent: {} };

const eventsReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_ALL_EVENTS:
			return {
				...state,
				allEvents: normalizeData(action.payload),
			};
		case GET_SINGLE_EVENT:
			return {
				...state,
				singleEvent: action.payload,
			};
		case CREATE_EVENT:
			return {
				...state,
				allEvents: { ...state.allEvents, [action.payload.id]: action.payload },
			};
		case DELETE_EVENT:
			const newState = {
				...state,
				allEvents: { ...state.allEvents },
				singleEvent: {},
			};
			delete newState.allEvents[action.payload.id];
			return newState;
		default:
			return state;
	}
};

export default eventsReducer;
