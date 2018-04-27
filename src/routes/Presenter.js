import React from 'react';

import StartEnd from 'mineral-ui/StartEnd';
import Box from 'mineral-ui/Box';
import Text from 'mineral-ui/Text';
import Button from 'mineral-ui/Button';

export default class Presenter extends React.Component  {

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
	
		this.state = {};

		this.getConfig();

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		this.props.history.push('/results');
	}

	render() {
		var Config = this.state.Config;
		if (Config==null) return null;

		return (
			<StartEnd priority = "start" direction = "column">
				<Box>
					<br/><br/><br/><br/>
					<Text align = "center" element = "h2">Go to</Text>
					<br/><br/>
					<Text align = "center" element = "h1">"http://survey.cdbu.io"</Text>
					<br/><br/>
					<Text align = "center" element = "h2">to complete the survey!</Text>
					<br/><br/><br/>
					<Box marginVertical = "10px" >
						<Text fontWeight ="bold" align="center"><i>CD Survey Build v1.{Config.BuildNum}</i></Text>
  					</Box>

				</Box>
				<Box>
					<form onSubmit = {this.handleSubmit}>
						<Box marginVertical = "20px" >
							<div align="right" width = "100%">
								<Button primary type="submit">Results</Button>
							</div>
						</Box>
					</form>
				</Box>

			</StartEnd>
		);	
	}
}