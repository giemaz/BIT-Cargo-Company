import React, { useState } from 'react';
import MainHeader from './MainHeader';
import Links from './Links';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';

const MainNavigation = (props) => {
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);

	const openDrawerHandler = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawerHandler = () => {
		setDrawerIsOpen(false);
	};

	return (
		<>
			{drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
			<SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
				<nav className='main-navigation__drawer-nav'>
					<Links />
				</nav>
			</SideDrawer>

			<MainHeader>
				<button className='main-navigation__menu-btn' onClick={openDrawerHandler}>
					<span />
					<span />
					<span />
				</button>
				<h1 className='main-navigation__title'>CargoHQ</h1>
				<div className='main-navigation__wrapper'>
					<nav className='main-navigation__header-nav'>
						<Links />
					</nav>
				</div>
			</MainHeader>
		</>
	);
};

export default MainNavigation;
