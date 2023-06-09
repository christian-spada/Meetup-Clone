import { csrfFetch } from './csrf';
import { normalizeData } from './storeUtils';

// === ACTIONS ===
const GET_ALL_EVENTS = 'events/getAllEvents';
const CREATE_EVENT = 'events/createEvent';
const GET_SINGLE_EVENT = 'events/getSingleEvent';
const ADD_IMAGE_TO_EVENT = 'events/addImageToEvent';

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

const addImageToEvent = image => {
	return {
		type: ADD_IMAGE_TO_EVENT,
		payload: image,
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
		const res = await csrfFetch(`/api/events/${eventId}/images`);
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const createEventThunk = (event, groupId, image) => async dispatch => {
	try {
		const res = await csrfFetch(`/api/groups/${groupId}/events`, {
			method: 'POST',
			body: JSON.stringify(event),
		});

		const newEvent = await res.json();
		dispatch(createEvent(newEvent));

		// === SHOULD I DISPATCH IMAGE?? ===
		// dispatch(addImageToEventThunk(addImageToEvent(image)));

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
			return {
				...state,
				allEvents: { ...state.allEvents, [action.payload.id]: action.payload },
			};
		// case ADD_IMAGE_TO_EVENT:
		//   return {
		//     ...state,
		//   }
		default:
			return state;
	}
};

export default eventsReducer;
