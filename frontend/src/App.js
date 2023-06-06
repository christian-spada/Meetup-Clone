import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { restoreUserThunk as restoreUser } from './store/session';
import StartGroupPage from './components/StartGroupPage/StartGroupPage';
import LandingPage from './components/LandingPage/LandingPage';
import GroupsListPage from './components/GroupListPage/GroupsListPage';
import EventsListPage from './components/EventsListPage/EventsListPage';
import GroupDetailsPage from './components/GroupDetailsPage/GroupDetailsPage';
import ManageGroupsPage from './components/ManageGroupsPage/ManageGroupsPage';

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
					<Route exact path="/groups">
						<GroupsListPage />
					</Route>
					<Route path="/groups/new">
						<StartGroupPage />
					</Route>
					<Route path="/groups/current">
						<ManageGroupsPage />
					</Route>
					<Route exact path="/groups/:groupId">
						<GroupDetailsPage />
					</Route>
					<Route exact path="/events">
						<EventsListPage />
					</Route>
				</Switch>
			)}
		</>
	);
}

export default App;
