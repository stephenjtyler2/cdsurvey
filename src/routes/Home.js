import React from 'react';

import { FormField } from 'mineral-ui/Form';
import TextInput from 'mineral-ui/TextInput';
import Text from 'mineral-ui/Text';
import Box from 'mineral-ui/Box';
import Button from 'mineral-ui/Button';
import IconChevronRight from 'mineral-ui-icons/IconChevronRight';

var Filter = require('bad-words'), filter = new Filter();

export default class Home extends React.Component {
	async getConfig() {
		try {
			const response = await fetch('config.js');
			const json = await response.json();
			this.setState ({
				Config : json
			});
		}
		catch(e) {
			console.log(e);
		}
	}

    constructor(props) {
		super(props);

		this.state = {
			value: ''
		};

		this.getConfig();

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
    }

	

    handleChange(event) {
    	this.setState({
        	value: event.target.value
    	});
    }

    handleSubmit(event) {
    	event.preventDefault();

    	console.log(this.state.value);
    	if (filter.isProfane(this.state.value)){
    		alert('Your entry has failed to pass the profanity filter.  Please try again.');
    	}
    	else {
	    	this.props.history.push('/questions');

    	}


    }

    render() {
    	const icon = <IconChevronRight/>;
    	var Config = this.state.Config;
    	if (Config==null) return null;
		return (
			<Box padding = "10px" height={500}>
				<br/>
				<form onSubmit = {this.handleSubmit}>
					<Text align = "center" element = "h4">To begin our survey, please enter your name.</Text>
					<Box marginVertical = "2em">
						<FormField label = "Full Name" required>
							<TextInput required 
								size = "jumbo" 
								value={this.state.value}
								onChange={this.handleChange} />
						</FormField>
					</Box>
					<Box marginVertical = "10px" >
						<div align="right" width = "100%">
	      					<Button disabled = {!this.state.value} type="submit" primary  size = "jumbo" iconEnd={icon}>Start</Button>
	      				</div>
	  				</Box>
					<Box marginVertical = "10px" >
						<Text><i>CD Survey v1.{Config.BuildNum}</i></Text>
	  				</Box>
				</form>
	   		</Box>
      	);
    }
}