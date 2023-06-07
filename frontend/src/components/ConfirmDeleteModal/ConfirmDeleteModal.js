import { useModal } from '../../context/Modal';
import { deleteGroupThunk } from '../../store/groups';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ groupToDelete }) => {
	const { closeModal } = useModal();
	const handleDelete = async e => {
		console.log('click handler', groupToDelete);
		const res = await deleteGroupThunk(groupToDelete);
		console.log(res);
		closeModal();
	};

	const handleKeep = e => {
		closeModal();
	};

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
