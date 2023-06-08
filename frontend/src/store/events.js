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

export const createEventThunk = (event, groupId) => async dispatch => {
	try {
		const res = await csrfFetch(`/api/groups/${groupId}/events`, {
			method: 'POST',
			body: JSON.stringify(event),
		});

		const newEvent = await res.json();
		dispatch(createEvent(newEvent));

		return newEvent;
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
