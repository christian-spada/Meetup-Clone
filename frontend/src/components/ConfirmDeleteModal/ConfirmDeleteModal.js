import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = () => {
	return (
		<div className="delete-group-modal">
			<h2>Confirm Delete</h2>
			<p>Are you sure you want to remove this group</p>
			<button className="delete-group-modal__delete-btn">Yes (Delete Group)</button>
			<button className="delete-group-modal__keep-btn">No (Keep Group)</button>
		</div>
	);
};

export default ConfirmDeleteModal;
