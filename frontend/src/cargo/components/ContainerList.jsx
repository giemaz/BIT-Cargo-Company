import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const ContainerList = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [containers, setContainers] = useState([]);

	useEffect(() => {
		const fetchContainers = async () => {
			try {
				const responseData = await sendRequest('http://localhost:3003/containers');
				setContainers(responseData);
			} catch (err) {}
		};
		fetchContainers();
	}, [sendRequest]);

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className='center'>
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && containers && (
				<ul className='story-list'>
					{containers.map((container) => (
						<li key={container.id}>
							<Link to={`/containers/${container.id}`}>
								<div>
									<h2>Container ID: {container.id}</h2>
									<h3>Size: {container.size}</h3>
									<p>Boxes count: {container.boxes_count}</p>
									<p>Total weight: {container.total_weight} kg</p>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</>
	);
};

export default ContainerList;
