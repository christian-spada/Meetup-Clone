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

	return (
		<>
			<button onClick={openMenu}>
				<i className="fas fa-user-circle"></i>
			</button>
			<ul className={ulClassName} ref={menuRef}>
				{user ? (
					<>
						<li>{user.username}</li>
						<li>
							{user.firstName} {user.lastName}
						</li>
						<li>{user.email}</li>
						<li>
							<button onClick={handleLogout}>Log Out</button>
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
