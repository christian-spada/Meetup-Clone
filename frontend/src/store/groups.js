import { csrfFetch } from './csrf';
import { normalizeData } from './storeUtils';

// === ACTIONS ===

const GET_ALL_GROUPS = 'groups/getAllGroups';
const GET_USER_GROUPS = 'groups/getUserGroups';
const GET_GROUP_EVENTS = 'groups/getGroupEvents';
const GET_SINGLE_GROUP = 'groups/getSingleGroup';
const CREATE_GROUP = 'groups/createGroup';
const DELETE_GROUP = 'groups/deleteGroup';
const UPDATE_GROUP = 'groups/updateGroup';

const getAllGroups = groups => {
	return {
		type: GET_ALL_GROUPS,
		payload: groups,
	};
};

const getUserGroups = groups => {
	return {
		type: GET_USER_GROUPS,
		payload: groups,
	};
};

const getGroupEvents = events => {
	return {
		type: GET_GROUP_EVENTS,
		payload: events,
	};
};

const getSingleGroup = group => {
	return {
		type: GET_SINGLE_GROUP,
		payload: group,
	};
};

const createGroup = group => {
	return {
		type: CREATE_GROUP,
		payload: group,
	};
};

const deleteGroup = group => {
	return {
		type: DELETE_GROUP,
		payload: group,
	};
};

const updateGroup = group => {
	return {
		type: UPDATE_GROUP,
		payload: group,
	};
};
// === THUNKS ===

export const getAllGroupsThunk = () => async dispatch => {
	try {
		const res = await csrfFetch('/api/groups');

		const data = await res.json();
		dispatch(getAllGroups(data.Groups));
		return data.Groups;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

export const getUserGroupsThunk = () => async dispatch => {
	try {
		const res = await csrfFetch('/api/groups/current');
		const groupData = await res.json();
		dispatch(getUserGroups(groupData.Groups));
		return groupData.Groups;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

export const getGroupEventsThunk = groupId => async dispatch => {
	try {
		const res = await csrfFetch(`/api/groups/${groupId}/events`);

		const eventData = await res.json();
		dispatch(getGroupEvents(eventData.Events));
		return eventData.Events;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

export const getSingleGroupThunk = groupId => async dispatch => {
	try {
		const res = await csrfFetch(`/api/groups/${groupId}`);

		const group = await res.json();

		dispatch(getSingleGroup(group));
		return group;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

export const createGroupThunk = (group, image) => async dispatch => {
	try {
		const res = await csrfFetch('/api/groups', {
			method: 'POST',
			body: JSON.stringify(group),
		});

		const newGroup = await res.json();

		const imgRes = await csrfFetch(`/api/groups/${newGroup.id}/images`, {
			method: 'POST',
			body: JSON.stringify(image),
		});

		const img = await imgRes.json();

		newGroup.GroupImages = [img];

		dispatch(createGroup(newGroup));

		return newGroup;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

export const updateGroupThunk = (newGroup, groupId) => async dispatch => {
	try {
		const res = await csrfFetch(`/api/groups/${groupId}`, {
			method: 'PUT',
			body: JSON.stringify(newGroup),
		});
		const updatedGroup = await res.json();
		dispatch(updateGroup(updatedGroup));

		return updatedGroup;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

export const deleteGroupThunk = groupToDelete => async dispatch => {
	try {
		const res = await csrfFetch(`/api/groups/${groupToDelete.id}`, {
			method: 'DELETE',
		});

		const message = await res.json();
		dispatch(deleteGroup(groupToDelete));

		return message;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

// === REDUCER ===

const initialState = { allGroups: {}, singleGroup: {}, allGroupEvents: {} };

const groupsReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_ALL_GROUPS:
			return {
				...state,
				allGroups: normalizeData(action.payload),
			};
		case GET_SINGLE_GROUP:
			return {
				...state,
				singleGroup: action.payload,
			};
		case GET_USER_GROUPS:
			return {
				...state,
				allGroups: normalizeData(action.payload),
			};
		case GET_GROUP_EVENTS:
			return {
				...state,
				allGroupEvents: normalizeData(action.payload),
			};
		case CREATE_GROUP:
			return {
				...state,
				allGroups: { ...state.allGroups, [action.payload.id]: action.payload },
				singleGroup: {},
			};
		case DELETE_GROUP:
			const newState = {
				...state,
				allGroups: { ...state.allGroups },
				singleGroup: {},
			};
			delete newState.allGroups[action.payload.id];
			return newState;
		case UPDATE_GROUP:
			return {
				...state,
				allGroups: {
					...state.allGroups,
					[action.payload.id]: { ...state.allGroups[action.payload.id], ...action.payload },
				},
				singleGroup: { ...state.singleGroup, ...action.payload },
			};

		default:
			return state;
	}
};

export default groupsReducer;
