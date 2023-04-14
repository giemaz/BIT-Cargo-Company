import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

const ModalOverlay = ({
	className,
	style,
	header,
	onSubmit,
	contentClass,
	children,
	headerClass,
	footerClass,
	footer,
}) => {
	const content = (
		<div className={`modal ${className}`} style={style}>
			<header className={`modal__header ${headerClass}`}>
				<h2>{header}</h2>
			</header>
			<form onSubmit={onSubmit ? onSubmit : (event) => event.preventDefault()}>
				<div className={`modal__content ${contentClass}`}>{children}</div>
				<footer className={`modal__footer ${footerClass}`}>{footer}</footer>
			</form>
		</div>
	);
	return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = ({ show, onCancel, ...rest }) => {
	return (
		<>
			{show && <Backdrop onClick={onCancel} />}
			<CSSTransition in={show} mountOnEnter unmountOnExit timeout={200} classNames='modal'>
				<ModalOverlay {...rest} />
			</CSSTransition>
		</>
	);
};

export default Modal;
