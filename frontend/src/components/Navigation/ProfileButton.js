import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logoutThunk as logout } from '../../store/session';

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
			<div className="header__profile-btn-container" onClick={openMenu}>
				<i className="fas fa-user-circle header__profile-btn"></i>
				<i className={`fa-solid fa-chevron-${profileArrowDirection} header__profile-btn-arrow`}></i>
			</div>
			<ul className={ulClassName} ref={menuRef}>
				<>
					<li>Hello, {user.username}</li>
					<li>{user.email}</li>
					<li className="header__dropdown-logout-btn" onClick={handleLogout}>
						Log Out
					</li>
				</>
			</ul>
		</>
	);
};

export default ProfileButton;
