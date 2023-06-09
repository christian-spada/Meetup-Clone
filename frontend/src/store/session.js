import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = user => {
	return {
		type: SET_USER,
		payload: user,
	};
};

const removeUser = () => {
	return {
		type: REMOVE_USER,
	};
};

export const loginThunk = user => async dispatch => {
	const { credential, password } = user;
	const res = await csrfFetch('/api/session', {
		method: 'POST',
		body: JSON.stringify({
			credential,
			password,
		}),
	});
	const data = await res.json();
	dispatch(setUser(data.user));
	return res;
};

export const logoutThunk = () => async dispatch => {
	const res = await csrfFetch('/api/session', {
		method: 'DELETE',
	});
	dispatch(removeUser());
	return res;
};

export const restoreUserThunk = () => async dispatch => {
	const res = await csrfFetch('/api/session');
	const data = await res.json();
	dispatch(setUser(data.user));
	return res;
};

export const signupThunk = user => async dispatch => {
	try {
		const res = await csrfFetch('/api/users', {
			method: 'POST',
			body: JSON.stringify(user),
		});

		const data = await res.json();
		dispatch(setUser(data.user));

		return data.user;
	} catch (err) {
		const error = await err.json();
		return error;
	}
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_USER:
			return {
				...state,
				user: action.payload,
			};
		case REMOVE_USER:
			return {
				...state,
				user: null,
			};
		default:
			return state;
	}
};

export default sessionReducer;
