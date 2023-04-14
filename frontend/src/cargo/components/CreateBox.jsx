// src/cargo/components/CreateBox.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './CreateBox.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const CreateBox = () => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const navigate = useNavigate();
	const [containers, setContainers] = useState([]);
	const [formState, inputHandler] = useForm(
		{
			weight: {
				value: '',
				isValid: false,
			},
			content: {
				value: '',
				isValid: false,
			},
			is_flamable: {
				value: false,
				isValid: true,
			},
			is_spoilable: {
				value: false,
				isValid: true,
			},
			containerId: {
				value: '',
				isValid: false,
			},
			image: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	useEffect(() => {
		const fetchContainers = async () => {
			try {
				const responseData = await sendRequest('http://localhost:3003/containers', 'GET', null, {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				});
				setContainers(responseData.containers);
			} catch (err) {}
		};

		fetchContainers();
	}, [sendRequest, auth.token]);

	const boxSubmitHandler = async (event) => {
		event.preventDefault();

		try {
			await sendRequest(
				'http://localhost:3003/boxes',
				'POST',
				{
					weight: formState.inputs.weight.value,
					content: formState.inputs.content.value,
					is_flamable: formState.inputs.is_flamable.value,
					is_spoilable: formState.inputs.is_spoilable.value,
					containerId: formState.inputs.containerId.value,
					image: formState.inputs.image.value,
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
			<form className='story-form' onSubmit={boxSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id='weight'
					element='input'
					type='number'
					label='Weight'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid weight.'
					onInput={inputHandler}
				/>
				<Input
					id='content'
					element='textarea'
					label='Content'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a description.'
					onInput={inputHandler}
				/>
				<label htmlFor='is_flamable'>
					<input id='is_flamable' type='checkbox' onChange={inputHandler} />
					Flamable
				</label>
				<label htmlFor='is_spoilable'>
					<input id='is_spoilable' type='checkbox' onChange={inputHandler} />
					Spoilable
				</label>
				<Input
					id='containerId'
					element='select'
					label='Container'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please select a container.'
					onInput={inputHandler}>
					<option value=''>Select container</option>
					{containers &&
						containers.length > 0 &&
						containers.map((container) => (
							<option key={container.id} value={container.id}>
								{container.name} ({container.size})
							</option>
						))}
				</Input>
				<ImageUpload id='image' onInput={inputHandler} errorText='Please provide an image.' />

				<Button type='submit' disabled={!formState.isValid}>
					ADD BOX
				</Button>
			</form>
		</>
	);
};

export default CreateBox;
