import React, { useState } from 'react';
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
	const { closeModal } = useModal();

	const handleSubmit = e => {
		e.preventDefault();
		if (password === confirmPassword) {
			setErrors({});
			return dispatch(
				signup({
					email,
					username,
					firstName,
					lastName,
					password,
				})
			)
				.then(closeModal)
				.catch(async res => {
					const data = await res.json();
					if (data && data.errors) {
						setErrors(data.errors);
					}
				});
		}
		return setErrors({
			confirmPassword: 'Confirm Password field must be the same as the Password field',
		});
	};

	return (
		<>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Email
					<input type="text" value={email} onChange={e => setEmail(e.target.value)} required />
				</label>
				{errors.email && <ErrorView error={errors.email} />}
				<label>
					Username
					<input
						type="text"
						value={username}
						onChange={e => setUsername(e.target.value)}
						required
					/>
				</label>
				{errors.username && <ErrorView error={errors.username} />}
				<label>
					First Name
					<input
						type="text"
						value={firstName}
						onChange={e => setFirstName(e.target.value)}
						required
					/>
				</label>
				{errors.firstName && <ErrorView error={errors.firstName} />}
				<label>
					Last Name
					<input
						type="text"
						value={lastName}
						onChange={e => setLastName(e.target.value)}
						required
					/>
				</label>
				{errors.lastName && <ErrorView error={errors.lastName} />}
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</label>
				{errors.password && <ErrorView error={errors.password} />}
				<label>
					Confirm Password
					<input
						type="password"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				{errors.confirmPassword && <ErrorView error={errors.confirmPassword} />}
				<button type="submit">Sign Up</button>
			</form>
		</>
	);
};

export default SignupFormModal;
