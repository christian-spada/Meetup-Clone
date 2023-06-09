import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteGroupThunk as deleteGroup } from '../../store/groups';
import './ConfirmDeleteModal.css';
import { useHistory } from 'react-router-dom';
import { deleteEventThunk as deleteEvent } from '../../store/events';

const ConfirmDeleteModal = ({ groupToDelete, setIsDeletingGroup, eventToDelete, eventGroupId }) => {
	const { closeModal } = useModal();
	const dispatch = useDispatch();
	const history = useHistory();

	const handleGroupDelete = async e => {
		if (setIsDeletingGroup) {
			setIsDeletingGroup(true);
		}

		const res = await dispatch(deleteGroup(groupToDelete));
		closeModal();
		history.push('/groups');
	};

	const handleEventDelete = async e => {
		try {
			const res = await dispatch(deleteEvent(eventToDelete));

			closeModal();
			history.push(`/groups/${eventGroupId}`);
		} catch (err) {
			console.log(err);
		}
	};

	const handleKeep = e => {
		closeModal();
	};

	if (groupToDelete) {
		return (
			<div className="delete-modal">
				<h2>Confirm Delete</h2>
				<p>Are you sure you want to remove this group</p>
				<button onClick={handleGroupDelete} className="delete-modal__delete-btn">
					Yes (Delete Group)
				</button>
				<button onClick={handleKeep} className="delete-modal__keep-btn">
					No (Keep Group)
				</button>
			</div>
		);
	}

	if (eventToDelete) {
		return (
			<div className="delete-modal">
				<h2>Confirm Delete</h2>
				<p>Are you sure you want to remove this event</p>
				<button onClick={handleEventDelete} className="delete-modal__delete-btn">
					Yes (Delete Event)
				</button>
				<button onClick={handleKeep} className="delete-modal__keep-btn">
					No (Keep Event)
				</button>
			</div>
		);
	}
};

export default ConfirmDeleteModal;
