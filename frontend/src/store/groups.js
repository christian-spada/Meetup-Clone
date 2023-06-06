import { csrfFetch } from './csrf';
import { normalizeData } from './storeUtils';

// === ACTIONS ===

const GET_ALL_GROUPS = 'groups/getAllGroups';
const CREATE_GROUP = 'groups/createGroup';
const ADD_GROUP_IMAGE = 'groups/addGroupImage';
const GET_SINGLE_GROUP = 'groups/getSingleGroup';

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

const addGroupImage = image => {
	return {
		type: ADD_GROUP_IMAGE,
		payload: image,
	};
};

// === THUNKS ===
export const getAllGroupsThunk = () => async dispatch => {
	const res = await csrfFetch('/api/groups');

	const data = await res.json();
	dispatch(getAllGroups(data.Groups));
	return data.Groups;
};

export const addImageToGroupThunk = (image, groupId) => async dispatch => {
	const imgRes = await csrfFetch(`/api/groups/${groupId}/images`, {
		method: 'POST',
		body: JSON.stringify(image),
	});

	if (imgRes.ok) {
		const img = await imgRes.json();
		dispatch(addGroupImage(img));
		return img;
	}
};

export const createGroupThunk = (group, image) => async dispatch => {
	const res = await csrfFetch('/api/groups', {
		method: 'POST',
		body: JSON.stringify(group),
	});

	if (res.ok) {
		const newGroup = await res.json();
		dispatch(createGroup(newGroup));
		dispatch(addImageToGroupThunk(image, newGroup.id));

		return newGroup;
	}
};

// === REDUCER ===

const initialState = {};

const groupsReducer = (state = initialState, action) => {
	switch (action.type) {
		case CREATE_GROUP:
			return {
				...state,
				singleGroup: action.payload,
			};
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
