import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import './LandingPage.css';
import { useSelector } from 'react-redux';

const LandingPage = () => {
	const userSession = useSelector(state => state.session.user);

	return (
		<div className="main-content">
			<section className="main-content__title-section">
				<h1>The people platform -- Where interests become friendships</h1>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, omnis eaque.
					Laboriosam, natus. Nisi maiores laboriosam exercitationem nulla doloribus amet
					consequuntur illo fugit quasi error repellendus ex quia, quas reiciendis!
				</p>
			</section>
			<section className="main-content__image-section">
				<img
					src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
					className="main-content__image"
					alt="img"
				></img>
			</section>
			<section className="main-content__meetup-works-section">
				<h2>How Meetup works</h2>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, omnis eaque.</p>
			</section>
			<section className="main-content__cards-section">
				<div className="main-content__cards-container">
					<div>
						<img
							src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384"
							alt="img"
						></img>
						<NavLink to="/groups">See all groups</NavLink>
						<p>Lorem ipsum dolor sit amet consectetur</p>
					</div>
					<div>
						<img
							src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384"
							alt="img"
						></img>
						<NavLink to="/events">Find an event</NavLink>
						<p>Lorem ipsum dolor sit amet consectetur</p>
					</div>
					<div>
						<img
							src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
							alt="img"
						></img>
						{userSession ? (
							<NavLink to="/groups/new">Start a new group</NavLink>
						) : (
							<p className="main-content__start-group-link-disabled">Start a new group</p>
						)}
						<p>Lorem ipsum dolor sit amet consectetur</p>
					</div>
				</div>
			</section>
			{!userSession && (
				<section className="main-content__join-meetup-section">
					<button className="main-content__join-meetup-btn">Join Meetup</button>
				</section>
			)}
		</div>
	);
};

export default LandingPage;
