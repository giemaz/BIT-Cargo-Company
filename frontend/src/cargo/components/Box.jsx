import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import boxImg from '../../assets/defaultBox.jpg';
import './BoxItem.css';

const Box = ({ id, onDelete, weight, content, image, is_flamable, is_spoilable, container_id }) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [currentAction, setCurrentAction] = useState(null);
	const navigate = useNavigate();

	const navigateToBoxPage = () => {
		navigate(`/boxes/${id}`);
	};

	const showDeleteWarningHandler = () => {
		setCurrentAction('delete');
		setShowConfirmModal(true);
	};

	const cancelHandler = () => {
		setShowConfirmModal(false);
	};

	const confirmHandler = async () => {
		setShowConfirmModal(false);
		try {
			if (currentAction === 'delete') {
				await sendRequest(`http://localhost:3003/boxes/${id}`, 'DELETE', null, {
					Authorization: 'Bearer ' + auth.token,
				});
				onDelete(id);
			}
		} catch (err) {}
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showConfirmModal}
				onCancel={cancelHandler}
				header={'Are you sure?'}
				footerClass='box-item__modal-actions'
				footer={
					<>
						<Button inverse onClick={cancelHandler}>
							CANCEL
						</Button>
						<Button danger onClick={confirmHandler}>
							DELETE
						</Button>
					</>
				}>
				<p>Do you want to proceed and delete this box?</p>
			</Modal>
			<li className='box-item'>
				<Card className='box-item__content'>
					{isLoading && <LoadingSpinner asOverlay />}
					<div className='box-item__link' onClick={navigateToBoxPage}>
						<div className='box-item__image'>
							<img
								src={image ? `http://localhost:3003/${image}` : boxImg}
								alt={content}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = boxImg;
								}}
							/>
						</div>
						<div className='box-item__info'>
							<h2>{content}</h2>
							<h3>Weight: {weight} kg</h3>
							<p>Flamable: {is_flamable ? 'Yes' : 'No'}</p>
							<p>Spoilable: {is_spoilable ? 'Yes' : 'No'}</p>
						</div>
					</div>
					<div className='box-item__actions'>
						{auth.isLoggedIn && (
							<div>
								<Button danger onClick={showDeleteWarningHandler}>
									DELETE
								</Button>
							</div>
						)}
					</div>
				</Card>
			</li>
		</>
	);
};

export default Box;
