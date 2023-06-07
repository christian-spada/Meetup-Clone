import { csrfFetch } from './csrf';
import { normalizeData } from './storeUtils';

// === ACTIONS ===

const GET_ALL_GROUPS = 'groups/getAllGroups';
const GET_SINGLE_GROUP = 'groups/getSingleGroup';
const CREATE_GROUP = 'groups/createGroup';

const getAllGroups = groups => {
	return {
		type: GET_ALL_GROUPS,
		payload: groups,
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

// === THUNKS ===

export const getAllGroupsThunk = () => async dispatch => {
	const res = await csrfFetch('/api/groups');

	const data = await res.json();
	dispatch(getAllGroups(data.Groups));
	return data.Groups;
};

export const getSingleGroupThunk = groupId => async dispatch => {
	const res = await csrfFetch(`/api/groups/${groupId}`);

	if (res.ok) {
		const group = await res.json();

		dispatch(getSingleGroup([group]));
		return group;
	}
};

export const createGroupThunk = (group, image) => async dispatch => {
	const res = await csrfFetch('/api/groups', {
		method: 'POST',
		body: JSON.stringify(group),
	});

	if (res.ok) {
		const newGroup = await res.json();

		const imgRes = await csrfFetch(`/api/groups/${newGroup.id}/images`, {
			method: 'POST',
			body: JSON.stringify(image),
		});

		const img = await imgRes.json();

		newGroup.GroupImages = [img];

		dispatch(createGroup([newGroup]));

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
		case GET_SINGLE_GROUP:
			return {
				...state,
				singleGroup: normalizeData(action.payload),
			};
		case CREATE_GROUP:
			const newGroup = normalizeData(action.payload);
			return {
				...state,
				allGroups: { ...state.allGroups, ...newGroup },
			};

		default:
			return state;
	}
};

export default groupsReducer;
