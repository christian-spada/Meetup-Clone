import { csrfFetch } from './csrf';

// === ACTIONS ===

const GET_ALL_GROUPS = 'groups/getAllGroups';
const CREATE_GROUP = 'groups/createGroup';

const getAllGroups = groups => {
	return {
		type: GET_ALL_GROUPS,
		payload: groups,
	};
};

const createGroup = group => {
	return {
		type: CREATE_GROUP,
		payload: group,
	};
};

// === THUNKS ===
export const createGroupThunk = group => async dispatch => {
	const res = await csrfFetch('/api/groups', {
		method: 'POST',
		body: JSON.stringify(group),
	});

	if (res.ok) {
		const newGroup = await res.json();
		dispatch(createGroup(newGroup));

		// add image to group
		const imgRes = await csrfFetch(`/api/${newGroup.id}/images`, {
			method: 'POST',
			body: JSON.stringify(),
		});

		return newGroup;
	}
};

// === REDUCER ===

const initalState = {};

const groupsReducer = (state = initalState, action) => {
	switch (action.type) {
		case CREATE_GROUP:
			return {
				...state,
				singleGroup: action.payload,
			};
		case GET_ALL_GROUPS:
			return {
				...state,
				allGroups: action.payload,
			};
		default:
			return state;
	}
};

export default groupsReducer;
