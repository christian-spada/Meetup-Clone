import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorView } from '../UtilComponents/ErrorView';
import './CreateEventPage.css';

const CreateEventPage = () => {
	const [name, setName] = useState('');
	const [type, setType] = useState('');
	const [visibility, setVisibility] = useState('');
	const [price, setPrice] = useState(0);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [imgUrl, setImgUrl] = useState('');
	const [desc, setDesc] = useState('');
	const [errors, setErrors] = useState({});
	const validation = {};

	useEffect(() => {
		if (!name) {
			validation.name = 'Name is required';
		}
		if (!type || type === '(select one)') {
			validation.type = 'Event type is required';
		}
		if (!visibility || visibility === '(select one)') {
			validation.visibility = 'Visibility is required';
		}
		if (!price) {
			validation.price = 'Price is required';
		}
		if (!startDate) {
			validation.eventStart = 'Event start is required';
		}
		if (!endDate) {
			validation.eventEnd = 'Event end is required';
		}
		const isValidImgUrl =
			imgUrl.endsWith('.jpg') || imgUrl.endsWith('.png') || imgUrl.endsWith('.jpeg');
		if (!isValidImgUrl) {
			validation.imgUrl = 'Image Url must end in .png, .jpg, or .jpeg';
		}
		if (desc.length < 30) {
			validation.desc = 'Description must be at least 30 characters long';
		}
	}, [name, type, visibility, price, startDate, endDate, imgUrl, desc.length]);

	const handleSubmit = e => {
		if (Object.values(validation).length > 0) {
			setErrors(validation);
			return;
		}

		const newEvent = {};
	};
	return (
		<div className="create-event">
			<section className="create-event__heading-section">
				<h3>Create an event for 'group name'</h3>
				<div className="create-event__name-input-container">
					<p>What is the name of your event?</p>
					<input value={name} onChange={e => setName(e.target.value)} placeholder="Event Name" />
				</div>
				{errors.name && <ErrorView error={errors.name} />}
			</section>
			<section className="create-event__visibility-price-section">
				<div className="create-event__type-input-container">
					<p>Is this an in person or online event?</p>
					<select value={type} onChange={e => setType(e.target.value)}>
						<option value="(select one)">(select one)</option>
						<option value="In person">In Person</option>
						<option value="Online">Online</option>
					</select>
					{errors.type && <ErrorView error={errors.type} />}
				</div>
				<div className="create-event__visibility-input-container">
					<p>Is this event private or public?</p>
					<select value={visibility} onChange={e => setVisibility(e.target.value)}>
						<option value="(select one)">(select one)</option>
						<option value="Private">Private</option>
						<option value="Public">Public</option>
					</select>
					{errors.visibility && <ErrorView error={errors.visibility} />}
				</div>
				<div className="create-event__price-input-container">
					<p>What is the price for your event?</p>
					<input value={price} onChange={e => setPrice(e.target.value)} type="number" />
					{errors.price && <ErrorView error={errors.price} />}
				</div>
			</section>
			<section className="create-event__date-section">
				<div className="create-event__start-date-container">
					<p>When does your event start?</p>
					<input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
					{errors.eventStart && <ErrorView error={errors.eventStart} />}
				</div>
				<div className="create-event__end-date-container">
					<p>When does your event end?</p>
					<input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
					{errors.eventEnd && <ErrorView error={errors.eventEnd} />}
				</div>
			</section>
			<section className="create-event__image-section">
				<div className="create-event__image-input-container">
					<p>Please add an image url for your event below:</p>
					<input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="Image URL" />
					{errors.imgUrl && <ErrorView error={errors.imgUrl} />}
				</div>
			</section>
			<section className="create-event__desc-section">
				<div className="create-event__desc-input-container">
					<p>Please describe your event:</p>
					<textarea
						value={desc}
						onChange={e => setDesc(e.target.value)}
						placeholder="Please include at least 30 characters"
					/>
					{errors.desc && <ErrorView error={errors.desc} />}
				</div>
			</section>
			<button onClick={handleSubmit} className="create-event__create-event-btn">
				Create Event
			</button>
		</div>
	);
};

export default CreateEventPage;
