import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginThunk as login } from '../../store/session';
import { ErrorView } from '../UtilComponents/ErrorView.js';
import './LoginForm.css';
import { useModal } from '../../context/Modal';

const LoginFormModal = () => {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();

	const handleSubmit = e => {
		e.preventDefault();
		setErrors({});
		return dispatch(login({ credential, password }))
			.then(closeModal)
			.catch(async res => {
				const data = await res.json();
				if (data && data.errors) {
					setErrors(data.errors);
				}
			});
	};

	return (
		<>
			<h1>Log In</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Username or Email
					<input
						type="text"
						value={credential}
						onChange={e => setCredential(e.target.value)}
						required
					/>
				</label>
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</label>
				{errors.credential && <ErrorView error={errors.credential} />}
				<button type="submit" className="login-btn">
					Log In
				</button>
			</form>
		</>
	);
};

export default LoginFormModal;
