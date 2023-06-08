import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteGroupThunk as deleteGroup } from '../../store/groups';
import './ConfirmDeleteModal.css';
import { useHistory } from 'react-router-dom';

const ConfirmDeleteModal = ({ groupToDelete, setIsDeletingGroup }) => {
	const { closeModal } = useModal();
	const dispatch = useDispatch();
	const history = useHistory();

	const handleDelete = async e => {
		if (setIsDeletingGroup) {
			setIsDeletingGroup(true);
		}

		const res = await dispatch(deleteGroup(groupToDelete));
		closeModal();
		history.push('/groups');
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
