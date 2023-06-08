import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { restoreUserThunk as restoreUser } from './store/session';
import StartGroupPage from './components/Groups/StartGroupPage/StartGroupPage';
import LandingPage from './components/LandingPage/LandingPage';
import GroupsListPage from './components/Groups/GroupListPage/GroupsListPage';
import EventsListPage from './components/Events/EventsListPage/EventsListPage';
import GroupDetailsPage from './components/Groups/GroupDetailsPage/GroupDetailsPage';
import ManageGroupsPage from './components/Groups/ManageGroupsPage/ManageGroupsPage';
import UpdateGroupPage from './components/Groups/UpdateGroupPage/UpdateGroupPage';
import CreateEventPage from './components/Events/CreateEventPage/CreateEventPage';
import EventDetailsPage from './components/Events/EventDetailsPage/EventDetailsPage';

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
