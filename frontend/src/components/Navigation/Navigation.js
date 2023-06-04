import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';

const Navigation = ({ isLoaded }) => {
	const sessionUser = useSelector(state => state.session.user);

	let sessionLinks;
	if (sessionUser) {
		sessionLinks = (
			<div className="header__profile-container">
				<NavLink to="/groups/new" className="header__start-group">
					Start a new group
				</NavLink>
				<ul className="header__dropdown-container">
					<li>
						<ProfileButton user={sessionUser} />
					</li>
				</ul>
			</div>
		);
	} else {
		sessionLinks = (
			<div className="header__action-btn-container">
				<OpenModalMenuItem itemText="Log In" modalComponent={<LoginFormModal />} />

				<OpenModalMenuItem itemText="Sign Up" modalComponent={<SignupFormModal />} />
			</div>
		);
	}

	return (
		<div className="header">
			<div className="header__home-link-container">
				<NavLink exact to="/" className="header__greetup-home-link">
					Greetup
				</NavLink>
			</div>
			{isLoaded && sessionLinks}
		</div>
	);
};

export default Navigation;
