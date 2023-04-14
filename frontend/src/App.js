import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Home from './pages/Home';
// import Container from './pages/Container';
import Create from './pages/Create';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
	const { token, login, logout, userId, isLoggedIn, username } = useAuth();

	let routes;

	if (token) {
		routes = (
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/create' element={<Create />} />
				<Route path='/auth' element={<Auth />} />
				{isLoggedIn && <Route path='/admin' element={<Admin />} />}
				<Route path='*' element={<Navigate replace to='/' />} />
			</Routes>
		);
	} else {
		routes = (
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/create' element={<Navigate replace to='/auth' />} />
				<Route path='/auth' element={<Auth />} />
				<Route path='*' element={<Navigate replace to='/' />} />
			</Routes>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				userId: userId,
				username: username,
				login: login,
				logout: logout,
			}}>
			<Router>
				<MainNavigation />
				<main>{routes}</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
