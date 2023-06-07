import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ErrorView } from '../UtilComponents/ErrorView';
import './UpdateGroupPage.css';

const UpdateGroupPage = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [location, setLocation] = useState('');
	const [name, setName] = useState('');
	const [desc, setDesc] = useState('');
	const [groupType, setGroupType] = useState('');
	const [groupStatus, setGroupStatus] = useState('');
	const [imgUrl, setImgUrl] = useState('');
	const [errors, setErrors] = useState({});
	const validation = {};

	useEffect(() => {
		if (!location) {
			validation.location = 'Location is required';
		}
		if (!name) {
			validation.name = 'Name is required';
		}
		if (desc.length < 50) {
			validation.desc = 'Description must be at least 50 characters long';
		}
		const isValidImgUrl =
			imgUrl.endsWith('.jpg') || imgUrl.endsWith('.png') || imgUrl.endsWith('.jpeg');
		if (!isValidImgUrl) {
			validation.imgUrl = 'Image Url must end in .png, .jpg, or .jpeg';
		}
		if (!groupType) {
			validation.groupType = 'Group Type is required';
		}
		if (!groupStatus) {
			validation.groupStatus = 'Visibility Type is required';
		}
	}, [desc.length, name, location, imgUrl, groupType, groupStatus, validation]);

	const handleGroupSubmit = async e => {
		if (Object.keys(validation).length) {
			setErrors(validation);
			return;
		}

		const [city, state] = location.split(', ');

		const newImg = { url: imgUrl, preview: true };

		const newGroup = {
			name,
			about: desc,
			type: groupType,
			private: groupStatus === 'Private' ? true : false,
			city,
			state,
		};

		// // const res = await dispatch(createGroup(newGroup, newImg));

		// if (res.id) {
		// 	history.push(`/groups/${res.id}`);
		// }
	};
	return (
		<div className="update-group">
			<section className="update-group__heading">
				<h3>UPDATE YOUR GROUPS INFORMATION</h3>
				<p>We'll walk you through a few steps to update your group's information</p>
			</section>
			<section className="update-group__location-input-section">
				<h3>First, set your group's location</h3>
				<p>
					Meetup groups meet locally, in person and online. We'll connect you with people in your
					area, and more can join you online.
				</p>
				<input
					className="update-group__location-input"
					placeholder="City, STATE"
					value={location}
					onChange={e => setLocation(e.target.value)}
				></input>
				{errors.location && <ErrorView error={errors.location} />}
			</section>
			<section className="update-group__group-name-input-section">
				<h3>What is the name of your group?</h3>
				<p>
					Choose a name that will give people a clear idea of what the group is about. Feel free to
					get creative!
				</p>
				<input
					className="update-group__group-name-input"
					placeholder="What is your group name?"
					value={name}
					onChange={e => setName(e.target.value)}
				></input>
				{errors.name && <ErrorView error={errors.name} />}
			</section>
			<section className="update-group__group-desc-input-section">
				<h3>Now describe what your group will be about</h3>
				<p>
					People will see this when we promote your group, but you'll be able to add to it later,
					too.
				</p>
				<ol className="update-group__group-desc-prompts">
					<li>What's the purpose of the group?</li>
					<li> Who should join?</li>
					<li>What will you do at your events?</li>
				</ol>
				<textarea
					placeholder="Please write at least 50 characters"
					cols="35"
					rows="10"
					value={desc}
					onChange={e => setDesc(e.target.value)}
				></textarea>
				{errors.desc && <ErrorView error={errors.desc} />}
			</section>
			<section className="update-group__final-steps-section">
				<h3>Final steps...</h3>
				<div className="update-group__group-type-container">
					<p>Is this an in person or online group?</p>
					<select
						className="update-group__group-type-input"
						value={groupType}
						onChange={e => setGroupType(e.target.value)}
					>
						<option value="(select one)">(select one)</option>
						<option value="Online">Online</option>
						<option value="In person">In Person</option>
					</select>
					{errors.groupType && <ErrorView error={errors.groupType} />}
				</div>
				<div className="update-group__group-status-container">
					<p>Is this group private or public?</p>
					<select
						className="update-group__group-status-input"
						value={groupStatus}
						onChange={e => setGroupStatus(e.target.value)}
					>
						<option value="(select one)">(select one)</option>
						<option value="Private">Private</option>
						<option value="Public">Public</option>
					</select>
					{errors.groupStatus && <ErrorView error={errors.groupStatus} />}
				</div>
			</section>
			<section className="update-group__submission-section">
				<button className="update-group__submit-btn" onClick={handleGroupSubmit}>
					Update Group
				</button>
			</section>
		</div>
	);
};

export default UpdateGroupPage;
