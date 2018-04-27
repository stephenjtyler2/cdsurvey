import React from 'react';

import Box from 'mineral-ui/Box';
import Text from 'mineral-ui/Text';


export default class Thanks extends React.Component {
	render() {
		return (
			<Box padding="30px">
				<Text align="center" element = "h2">Thank you for completing our survey!</Text>
			</Box>
		);	
	}
}