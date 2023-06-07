import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginThunk as login } from '../../store/session';
import { ErrorView } from '../UtilComponents/ErrorView.js';
import './LoginForm.css';
import { useModal } from '../../context/Modal';

const LoginFormModal = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [credential, setCredential] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();

	const handleSubmit = e => {
		e.preventDefault();
		setErrors({});
		return dispatch(login({ credential, password }))
			.then(() => {
				closeModal();
				history.push('/');
			})
			.catch(async res => {
				const data = await res.json();
				if (data && data.errors) {
					setErrors(data.errors);
				}
			});
	};

	// useEffect(() => {
	// 	const validation = {};

	// 	if (credential.length < 4) {
	// 		validation.username = 'Username must be at least 4 characters';
	// 	}
	// 	if (password.length < 6) {
	// 		validation.password = 'Password must be at least 6 characters';
	// 	}

	// 	if (Object.keys(validation).length) {
	// 		setErrors(validation);
	// 	}
	// }, [credential.length, password.length]);

	return (
		<div className="login-modal">
			<h1 className="login-title">Log In</h1>
			<form onSubmit={handleSubmit} className="login-form">
				<div className="login-input-container">
					<label htmlFor="credential" className="login-input-label">
						Username or Email
					</label>
					<input
						id="credential"
						type="text"
						value={credential}
						onChange={e => setCredential(e.target.value)}
						required
					/>
				</div>
				{/* {errors.username && <ErrorView error={errors.username} />} */}
				<div className="login-input-container">
					<label htmlFor="password" className="login-input-label">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</div>
				{/* {errors.password && <ErrorView error={errors.password} />} */}
				{errors.credential && <ErrorView error={errors.credential} />}
				<button type="submit" className="login-btn" disabled={Object.keys(errors).length > 0}>
					Log In
				</button>
			</form>
		</div>
	);
};

export default LoginFormModal;
