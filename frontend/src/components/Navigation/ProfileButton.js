import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logoutThunk as logout } from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

const ProfileButton = ({ user }) => {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef();

	const openMenu = () => {
		if (showMenu) return;
		setShowMenu(true);
	};

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = e => {
			const isClickEventInMenu = menuRef.current.contains(e.target);
			if (!isClickEventInMenu) {
				setShowMenu(false);
			}
		};

		document.addEventListener('click', closeMenu);

		return () => document.removeEventListener('click', closeMenu);
	}, [showMenu]);

	const closeMenu = () => setShowMenu(false);

	const handleLogout = e => {
		e.preventDefault();
		dispatch(logout());
		closeMenu();
	};

	const ulClassName = 'profile-dropdown' + (showMenu ? '' : ' hidden');
	const profileArrowDirection = showMenu ? 'up' : 'down';
	return (
		<>
			<i className="fas fa-user-circle header__profile-btn" onClick={openMenu}></i>
			<i
				className={`fa-solid fa-chevron-${profileArrowDirection} header__profile-btn-arrow`}
				onClick={openMenu}
			></i>
			<ul className={ulClassName} ref={menuRef}>
				{user ? (
					<>
						<li>Hello, {user.username}</li>
						<li>{user.email}</li>
						<li className="header__dropdown-logout-btn" onClick={handleLogout}>
							Log Out
						</li>
					</>
				) : (
					<>
						<OpenModalMenuItem
							itemText="Log In"
							onItemClick={closeMenu}
							modalComponent={<LoginFormModal />}
						/>

						<OpenModalMenuItem
							itemText="Sign Up"
							onItemClick={closeMenu}
							modalComponent={<SignupFormModal />}
						/>
					</>
				)}
			</ul>
		</>
	);
};

export default ProfileButton;
