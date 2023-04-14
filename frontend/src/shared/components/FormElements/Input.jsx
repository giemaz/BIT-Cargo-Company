import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
	switch (action.type) {
		case 'CHANGE':
			return {
				...state,
				value: action.val,
				isValid: validate(action.val, action.validators),
			};
		case 'TOUCH':
			return {
				...state,
				isTouched: true,
			};
		default:
			return state;
	}
};

const Input = ({
	id,
	element,
	type,
	label,
	placeholder,
	rows,
	initialValue = '',
	initialValid = false,
	errorText,
	validators,
	onInput,
	children,
}) => {
	const [inputState, dispatch] = useReducer(inputReducer, {
		value: initialValue,
		isTouched: false,
		isValid: initialValid,
	});

	const { value, isValid } = inputState;

	useEffect(() => {
		onInput(id, value, isValid);
	}, [id, value, isValid, onInput]);

	const changeHandler = (event) => {
		dispatch({
			type: 'CHANGE',
			val: event.target.value,
			validators,
		});
	};

	const touchHandler = () => {
		dispatch({
			type: 'TOUCH',
		});
	};

	const inputElement =
		element === 'input' ? (
			<input
				id={id}
				type={type}
				placeholder={placeholder}
				onChange={changeHandler}
				onBlur={touchHandler}
				value={value}
			/>
		) : element === 'select' ? (
			<select id={id} onChange={changeHandler} onBlur={touchHandler} value={value}>
				{children}
			</select>
		) : (
			<textarea id={id} rows={rows || 3} onChange={changeHandler} onBlur={touchHandler} value={value} />
		);

	return (
		<div className={`form-control ${!isValid && inputState.isTouched && 'form-control--invalid'}`}>
			<label htmlFor={id}>{label}</label>
			{inputElement}
			{!isValid && inputState.isTouched && <p>{errorText}</p>}
		</div>
	);
};

export default Input;
