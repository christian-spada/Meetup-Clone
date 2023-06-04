import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
	const sessionUser = useSelector(state => state.session.user);

	return (
		<ul className="dropdown-container">
			<li>
				<NavLink exact to="/">
					Greetup
				</NavLink>
			</li>
			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</ul>
	);
};

export default Navigation;
