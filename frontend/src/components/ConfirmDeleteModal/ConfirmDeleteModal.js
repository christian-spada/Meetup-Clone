import { deleteGroupThunk as deleteGroup } from '../../store/groups';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ groupToDelete }) => {
	const handleDelete = async e => {
		deleteGroup(groupToDelete);
	};

	const handleKeep = e => {};
	return (
		<div className="delete-group-modal">
			<h2>Confirm Delete</h2>
			<p>Are you sure you want to remove this group</p>
			<button onClick={handleDelete} className="delete-group-modal__delete-btn">
				Yes (Delete Group)
			</button>
			<button onClick={handleKeep} className="delete-group-modal__keep-btn">
				No (Keep Group)
			</button>
		</div>
	);
};

export default ConfirmDeleteModal;
