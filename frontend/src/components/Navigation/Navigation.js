import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className="header">
			<div className="header__home-link-container">
				<NavLink exact to="/" className="header__greetup-home-link">
					Greetup
				</NavLink>
			</div>

			<div>
				<ul className="header__dropdown-container">
					{isLoaded && (
						<li>
							<ProfileButton user={sessionUser} />
						</li>
					)}
				</ul>
			</div>
		</div>
	);
};

export default Navigation;
