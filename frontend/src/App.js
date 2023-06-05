import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { restoreUserThunk as restoreUser } from './store/session';
import StartGroupPage from './components/StartGroupPage/StartGroupPage';
import LandingPage from './components/LandingPage/LandingPage';

function App() {
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(restoreUser()).then(() => setIsLoaded(true));
	}, [dispatch]);

	return (
		<>
			<Navigation isLoaded={isLoaded} />
			{isLoaded && (
				<Switch>
					<Route exact path="/">
						<LandingPage />
					</Route>
					<Route path="/groups/new">
						<StartGroupPage />
					</Route>
				</Switch>
			)}
		</>
	);
}

export default App;
