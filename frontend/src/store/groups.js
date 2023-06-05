import { csrfFetch } from './csrf';

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
