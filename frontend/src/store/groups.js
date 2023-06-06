import { csrfFetch } from './csrf';
import { normalizeData } from './storeUtils';

// === ACTIONS ===

const GET_ALL_GROUPS = 'groups/getAllGroups';
// const CREATE_GROUP = 'groups/createGroup';

const getAllGroups = groups => {
	return {
		type: GET_ALL_GROUPS,
		payload: groups,
	};
};

// const createGroup = group => {
// 	return {
// 		type: CREATE_GROUP,
// 		payload: group,
// 	};
// };

// === THUNKS ===
export const getAllGroupsThunk = () => async dispatch => {
	const res = await csrfFetch('/api/groups');

	const data = await res.json();
	dispatch(getAllGroups(data.Groups));
	return data.Groups;
};

export const createGroupThunk = (group, image) => async dispatch => {
	const res = await csrfFetch('/api/groups', {
		method: 'POST',
		body: JSON.stringify(group),
	});

	if (res.ok) {
		const newGroup = await res.json();

		await csrfFetch(`/api/groups/${newGroup.id}/images`, {
			method: 'POST',
			body: JSON.stringify(image),
		});

		return newGroup;
	}
};

// === REDUCER ===

const initialState = {};

const groupsReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_ALL_GROUPS:
			return {
				...state,
				allGroups: normalizeData(action.payload),
			};
		default:
			return state;
	}
};

export default groupsReducer;
