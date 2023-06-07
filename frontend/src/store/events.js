import { csrfFetch } from './csrf';
import { normalizeData } from './storeUtils';

// === ACTIONS ===
const GET_ALL_EVENTS = 'events/getAllEvents';
const CREATE_EVENT = 'events/createEvent';
const GET_SINGLE_EVENT = 'events/getSingleEvent';

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

// === THUNKS ===
export const getAllEventsThunk = () => async dispatch => {
	try {
		const res = await csrfFetch('/api/events');

		const events = await res.json();
		dispatch(getAllEvents(events));

		return events;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

export const getSingleEventThunk = eventId => async dispatch => {
	try {
		const res = await csrfFetch(`/api/events/${eventId}`);

		const event = await res.json();
		dispatch(getSingleEvent(event));

		return event;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

export const createEventThunk = event => async dispatch => {
	try {
		const res = await csrfFetch('/api/events', {
			method: 'POST',
			body: JSON.stringify(event),
		});

		const newEvent = await res.json();
		dispatch(createEvent(newEvent));

		return newEvent;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

// === REDUCER ===

const initialState = { allEvents: {}, singleEvent: {} };

const eventsReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_ALL_EVENTS:
			return {
				...state,
				allEvents: normalizeData(action.payload.Events),
			};
		case GET_SINGLE_EVENT:
			return {
				...state,
				singleEvent: action.payload,
			};
		case CREATE_EVENT:
			const newEvent = normalizeData(action.payload);
			return {
				...state,
				allEvents: { ...state.allEvents, ...newEvent },
			};
		default:
			return state;
	}
};

export default eventsReducer;
