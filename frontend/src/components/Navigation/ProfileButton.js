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

	const handleLogout = e => {
		e.preventDefault();
		dispatch(logout());
	};

	const ulClassName = 'profile-dropdown' + (showMenu ? '' : ' hidden');

	return (
		<>
			<button onClick={openMenu}>
				<i className="fas fa-user-circle"></i>
			</button>
			<ul className={ulClassName} ref={menuRef}>
				<li>{user.username}</li>
				<li>
					{user.firstName} {user.lastName}
				</li>
				<li>{user.email}</li>
				<li>
					<button onClick={handleLogout}>Log Out</button>
				</li>
			</ul>
		</>
	);
};

export default ProfileButton;
