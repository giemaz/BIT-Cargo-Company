import React, { useState, useEffect } from 'react';
import Box from './Box';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './Container.css';

const Container = ({ containerId }) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [boxes, setBoxes] = useState([]);

	useEffect(() => {
		const fetchBoxes = async () => {
			try {
				const responseData = await sendRequest(`http://localhost:3003/boxes/container/${containerId}`);
				setBoxes(responseData);
			} catch (err) {}
		};
		fetchBoxes();
	}, [sendRequest, containerId]);

	const boxDeleteHandler = (deletedBoxId) => {
		setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== deletedBoxId));
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className='center'>
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && boxes && (
				<ul className='container'>
					{boxes.map((box) => (
						<Box
							key={box.id}
							id={box.id}
							onDelete={boxDeleteHandler}
							weight={box.weight}
							content={box.content}
							image={box.image}
							is_flamable={box.is_flamable}
							is_spoilable={box.is_spoilable}
							container_id={box.container_id}
						/>
					))}
				</ul>
			)}
		</>
	);
};

export default Container;
