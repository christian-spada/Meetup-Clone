import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { restoreUserThunk as restoreUser } from './store/session';
import LandingPage from './components/LandingPage';
import StartGroupPage from './components/Groups/StartGroupPage';
import GroupsListPage from './components/Groups/GroupListPage';
import EventsListPage from './components/Events/EventsListPage';
import GroupDetailsPage from './components/Groups/GroupDetailsPage';
import ManageGroupsPage from './components/Groups/ManageGroupsPage';
import UpdateGroupPage from './components/Groups/UpdateGroupPage';
import CreateEventPage from './components/Events/CreateEventPage';
import EventDetailsPage from './components/Events/EventDetailsPage';

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
					<Route exact path="/groups/:groupId/edit">
						<UpdateGroupPage />
					</Route>
					<Route path="/groups/:groupId/events/new">
						<CreateEventPage />
					</Route>
					<Route exact path="/events">
						<EventsListPage />
					</Route>
					<Route path="/events/:eventId">
						<EventDetailsPage />
					</Route>
				</Switch>
			)}
		</>
	);
}

export default App;
