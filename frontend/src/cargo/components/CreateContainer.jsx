// src/cargo/components/CreateContainer.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './CreateContainer.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const CreateContainer = () => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const navigate = useNavigate();
	const [formState, inputHandler] = useForm(
		{
			size: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const containerSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			await sendRequest(
				'http://localhost:3003/containers',
				'POST',
				{
					size: formState.inputs.size.value,
				},
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				}
			);
			navigate('/');
		} catch (err) {}
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<form className='story-form' onSubmit={containerSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id='size'
					element='select'
					label='Size'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please select a size.'
					onInput={inputHandler}>
					<option value=''>Select size</option>
					<option value='S'>Small</option>
					<option value='M'>Medium</option>
					<option value='L'>Large</option>
				</Input>
				<Button type='submit' disabled={!formState.isValid}>
					ADD CONTAINER
				</Button>
			</form>
		</>
	);
};

export default CreateContainer;
