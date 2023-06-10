import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { signupThunk as signup } from '../../store/session';
import { ErrorView } from '../UtilComponents/ErrorView';
import './SignupForm.css';

const SignupFormModal = () => {
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [isDisabled, setIsDisabled] = useState(true);
	const { closeModal } = useModal();

	useEffect(() => {
		const isBtnEnabled =
			firstName.length &&
			lastName.length &&
			username.length >= 4 &&
			password.length >= 6 &&
			password === confirmPassword;

		if (isBtnEnabled) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [firstName, lastName, username, password.length, password, confirmPassword]);

	const handleSubmit = async e => {
		e.preventDefault();

		if (password !== confirmPassword) {
			return setErrors({
				confirmPassword: 'Confirm Password field must be the same as the Password field',
			});
		}

		const user = {
			email,
			username,
			firstName,
			lastName,
			password,
		};

		const res = await dispatch(signup(user));

		if (res.id) {
			closeModal();
		} else {
			setErrors(res.errors);
		}
		// if (password === confirmPassword) {
		// 	setErrors({});
		// 	return dispatch(
		// 		signup({
		// 			email,
		// 			username,
		// 			firstName,
		// 			lastName,
		// 			password,
		// 		})
		// 	)
		// 		.then(closeModal)
		// 		.catch(async res => {
		// 			const data = await res.json();
		// 			if (data && data.errors) {
		// 				setErrors(data.errors);
		// 			}
		// 		});
		// }
		// return setErrors({
		// 	confirmPassword: 'Confirm Password field must be the same as the Password field',
		// });
	};

	return (
		<div className="signup-modal">
			<h1 className="signup-modal__title">Sign Up</h1>
			<form className="signup-modal__form" onSubmit={handleSubmit}>
				<label htmlFor="signup-email">Email</label>
				<input
					id="signup-email"
					type="text"
					value={email}
					onChange={e => setEmail(e.target.value)}
					required
				/>
				{errors.email && <ErrorView error={errors.email} />}
				<label htmlFor="username">Username</label>
				<input
					id="username"
					type="text"
					value={username}
					onChange={e => setUsername(e.target.value)}
					required
				/>
				{errors.username && <ErrorView error={errors.username} />}
				<label htmlFor="first-name">First Name</label>
				<input
					id="first-name"
					type="text"
					value={firstName}
					onChange={e => setFirstName(e.target.value)}
					required
				/>
				{errors.firstName && <ErrorView error={errors.firstName} />}
				<label htmlFor="last-name">Last Name</label>
				<input
					id="last-name"
					type="text"
					value={lastName}
					onChange={e => setLastName(e.target.value)}
					required
				/>
				{errors.lastName && <ErrorView error={errors.lastName} />}
				<label htmlFor="signup-password">Password</label>
				<input
					id="signup-password"
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>
				{errors.password && <ErrorView error={errors.password} />}
				<label htmlFor="signup-confirm-password">Confirm Password</label>
				<input
					id="signup-confirm-password"
					type="password"
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
					required
				/>
				{errors.confirmPassword && <ErrorView error={errors.confirmPassword} />}
				<button
					className={isDisabled ? 'signup-modal__disabled-btn' : 'signup-modal__signup-btn'}
					type="submit"
				>
					Sign Up
				</button>
			</form>
		</div>
	);
};

export default SignupFormModal;
