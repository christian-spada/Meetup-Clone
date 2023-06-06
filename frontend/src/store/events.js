import { csrfFetch } from './csrf';
import { normalizeData } from './storeUtils';

// === ACTIONS ===
const GET_ALL_EVENTS = 'events/getAllEvents';

const getAllEvents = events => {
	return {
		type: GET_ALL_EVENTS,
		payload: events,
	};
};

// === THUNKS ===
export const getAllEventsThunk = () => async dispatch => {
	const res = await csrfFetch('/api/events');

	if (res.ok) {
		const events = await res.json();
		dispatch(getAllEvents(events));
		return events;
	}
};

// === REDUCER ===

const initialState = {};

const eventsReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_ALL_EVENTS:
			console.log(action.payload);
			return {
				...state,
				allEvents: normalizeData(action.payload.Events),
			};
		default:
			return state;
	}
};

export default eventsReducer;
