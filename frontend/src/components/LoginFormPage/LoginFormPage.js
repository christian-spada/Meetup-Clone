import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk as login } from '../../store/session';
import { Redirect } from 'react-router-dom';
import './LoginForm.css';

const ErrorView = ({ error }) => {
	return <p>{error}</p>;
};

const LoginFormPage = () => {
	const dispatch = useDispatch();
	const sessionUser = useSelector(state => state.session.user);
	const [credential, setCredential] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});

	if (sessionUser) return <Redirect to="/" />;

	const handleSubmit = e => {
		e.preventDefault();
		setErrors({});
		return dispatch(login({ credential, password })).catch(async res => {
			const data = await res.json();
			if (data && data.errors) setErrors(data.errors);
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

export default LoginFormPage;
