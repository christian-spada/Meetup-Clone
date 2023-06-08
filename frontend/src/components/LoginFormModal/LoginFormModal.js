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
	const [isDisabled, setIsDisabled] = useState(false);
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

	const handleDemoUser = () => {
		dispatch(login({ credential: 'Demo-lition', password: 'password' })).then(() => {
			closeModal();
			history.push('/');
		});
	};

	useEffect(() => {
		if (credential.length < 4 || password.length < 6) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [credential.length, password.length]);

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
				{errors.credential && <ErrorView error={errors.credential} />}
				<button type="submit" className="login-btn" disabled={isDisabled}>
					Log In
				</button>
				<button className="demo-user-btn" onClick={handleDemoUser}>
					Log in as Demo User
				</button>
			</form>
		</div>
	);
};

export default LoginFormModal;
