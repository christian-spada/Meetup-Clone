import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import './LandingPage.css';
import { useSelector } from 'react-redux';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import SignupFormModal from '../SignupFormModal';
const LandingPage = () => {
	const userSession = useSelector(state => state.session.user);

	return (
		<div className="main-content">
			<section className="main-content__title-section">
				<h1>The people platform -- Where interests become friendships</h1>
				<p>
					Whatever your interest, from hiking and reading to networking and skill sharing, there are
					thousands of people who share it on Meetup. Events are happening every day—sign up to join
					the fun.
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
				<p>
					Meet new people who share your interests through online and in-person events. It's free to
					create an account.
				</p>
			</section>
			<section className="main-content__cards-section">
				<div className="main-content__cards-container">
					<div>
						<img
							src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384"
							alt="img"
						></img>
						<NavLink to="/groups">See all groups</NavLink>
						<p>
							Do what you love, meet others who love it, find your community. The rest is history!
						</p>
					</div>
					<div>
						<img
							src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384"
							alt="img"
						></img>
						<NavLink to="/events">Find an event</NavLink>
						<p>
							Events are happening on just about any topic you can think of, from online gaming and
							photography to yoga and hiking.
						</p>
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
						<p>
							You don’t have to be an expert to gather people together and explore shared interests.
						</p>
					</div>
				</div>
			</section>
			{!userSession && (
				<section className="main-content__join-meetup-section">
					<OpenModalMenuItem
						className="main-content__join-meetup-btn"
						itemText="Join Meetup"
						modalComponent={<SignupFormModal />}
					/>
				</section>
			)}
		</div>
	);
};

export default LandingPage;
