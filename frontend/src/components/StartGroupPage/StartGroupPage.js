import './StartGroupPage.css';

const StartGroupPage = () => {
	return (
		<div className="start-group">
			<section className="start-group__heading">
				<h3>BECOME AN ORGANIZER</h3>
				<p>We'll walk you through a few steps to build your local community</p>
			</section>
			<section className="start-group__location-input-section">
				<h3>First, set your group's location</h3>
				<p>
					Meetup groups meet locally, in person and online. We'll connect you with people in your
					area, and more can join you online.
				</p>
				<input className="start-group__location-input" placeholder="City, STATE"></input>
			</section>
			<section className="start-group__group-name-input-section">
				<h3>What will your group's name be?</h3>
				<p>
					Choose a name that will give people a clear idea of what the group is about. Feel free to
					get creative! You can edit this later if you change your mind.
				</p>
				<input
					className="start-group__group-name-input"
					placeholder="What is your group name?"
				></input>
			</section>
			<section className="start-group__group-desc-input-section">
				<h3>Now describe what your group will be about</h3>
				<p>
					People will see this when we promote your group, but you'll be able to add to it later,
					too.
				</p>
				<ol className="start-group__group-desc-prompts">
					<li>What's the purpose of the group?</li>
					<li> Who should join?</li>
					<li>What will you do at your events?</li>
				</ol>
				<textarea placeholder="Please write at least 30 characters" cols="35" rows="10"></textarea>
			</section>
			<section className="start-group__final-steps-section">
				<h3>Final steps...</h3>
				<div className="start-group__group-type-container">
					<p>Is this an in person or online group?</p>
					<select className="start-group__group-type-input">
						<option value="online">Online</option>
						<option value="in-person">In Person</option>
					</select>
				</div>
				<div className="start-group__group-status-container">
					<p>Is this group private or public?</p>
					<select className="start-group__group-status-input">
						<option value="private">Private</option>
						<option value="public">Public</option>
					</select>
				</div>
				<div className="start-group__group-img-input">
					<p>Please add an image url for your group below:</p>
					<input placeholder="Image Url"></input>
				</div>
			</section>
			<section className="start-group__submission-section">
				<button className="start-group__submit-btn">Create Group</button>
			</section>
		</div>
	);
};

export default StartGroupPage;
