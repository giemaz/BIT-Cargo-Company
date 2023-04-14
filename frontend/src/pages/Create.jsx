import React from 'react';

import CreateBox from '../cargo/components/CreateBox';
import CreateContainer from '../cargo/components/CreateContainer';

const Create = () => {
	return (
		<div>
			<h2>Create Box</h2>
			<CreateBox />
			<h2>Create Container</h2>
			<CreateContainer />
		</div>
	);
};

export default Create;
