import React from 'react';

//import Text from 'mineral-ui/Text';
import Box from 'mineral-ui/Box';
import Button from 'mineral-ui/Button';
import Flex, { FlexItem } from 'mineral-ui/Flex';


//import Questions from '../questions.json';



export default class Admin extends React.Component  {
	
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

		//console.log ("Admin Ctor");
		this.state = {
			questionCounters : [
				[ 0,  0,  0, 0],
				[ 0,  0,  0, 0],
				[ 0,  0,  0, 0],
				[ 0,  0,  0, 0]
			]
		};

		this.getConfig();

		this.goToPresenter = this.goToPresenter.bind(this);
		this.goToParticipant = this.goToParticipant.bind(this);
		this.resetCounters = this.resetCounters.bind(this);
		this.refreshDataFromServer = this.refreshDataFromServer.bind(this);
    }

	componentWillMount() {
		//console.log ("WillMount");
		this.refreshDataFromServer();

	}

	refreshDataFromServer() {
		var Config = this.state.Config;
		if (Config==null)  {
			setTimeout(this.refreshDataFromServer, 250);
			return;
		}
		//console.log("refresh");

		var that=this;
		var questionCounters = this.state.questionCounters;

//		console.log(questionCounters);
//		console.log("about to grab counters");
		fetch(Config.ServerURL)
		.then((resp)=>resp.json())
		.then(function(data) {

			// the data in the format DynamoDB table scan returns it which is random in terms of order
			// and the structure's not great.  So iterate over it and populate the simple 4x4 arrays of counts.
			for (var i=0;i<data.Count;i++) {
				var currentItem = data.Items[i];
				questionCounters[currentItem.questionId.N-1][currentItem.responseId.N-1] = currentItem.counterValue.N;
			}

			that.setState({
				questionCounters : questionCounters
    		});
		})
		.catch(function() {
			console.log('error from GetCounters API call');
		});
	}

	renderQuestionCounters() {

		var qc = this.state.questionCounters;
		if (qc==null) return null;

		return (
			<Box padding="20px">
				<i>Counters</i>
				<Flex gutterWidth = {5}>
					<FlexItem>Question 1: </FlexItem>
					<FlexItem><b>{qc[0][0]}</b></FlexItem>
					<FlexItem><b>{qc[0][1]}</b></FlexItem>
					<FlexItem><b>{qc[0][2]}</b></FlexItem>
					<FlexItem><b>{qc[0][3]}</b></FlexItem>
				</Flex>
				<Flex gutterWidth = {5}>
					<FlexItem>Question 2: </FlexItem>
					<FlexItem><b>{qc[1][0]}</b></FlexItem>
					<FlexItem><b>{qc[1][1]}</b></FlexItem>
					<FlexItem><b>{qc[1][2]}</b></FlexItem>
					<FlexItem><b>{qc[1][3]}</b></FlexItem>
				</Flex>
				<Flex gutterWidth = {5}>
					<FlexItem>Question 3: </FlexItem>
					<FlexItem><b>{qc[2][0]}</b></FlexItem>
					<FlexItem><b>{qc[2][1]}</b></FlexItem>
					<FlexItem><b>{qc[2][2]}</b></FlexItem>
					<FlexItem><b>{qc[2][3]}</b></FlexItem>
				</Flex>
				<Flex gutterWidth = {5}>
					<FlexItem>Question 4: </FlexItem>
					<FlexItem><b>{qc[3][0]}</b></FlexItem>
					<FlexItem><b>{qc[3][1]}</b></FlexItem>
					<FlexItem><b>{qc[3][2]}</b></FlexItem>
					<FlexItem><b>{qc[3][3]}</b></FlexItem>
				</Flex>
			</Box>
		);
	}

	goToPresenter() {
		this.props.history.push('/presenter');
	}
	goToParticipant() {
		this.props.history.push('/');
	}

	resetCounters() {
		console.log ('resetCounters')
		var Config = this.state.Config;
		if (Config ==null) {
			console.log('config not loaded')
			return;
		}
		for (var q = 0;q<4;q++) {
			for (var a =0; a<4; a++) {

				

				fetch(Config.ServerURL, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						questionId: q+1,
						responseId: a+1
					})
				})
				.then((resp)=>resp.json())
				.then(function(data) {
					// TODO: validate the response

				})
				.catch(function() {
					console.log('error from ResetCounters API Response Handler');
				});
			}
		}
   		setTimeout(function() { this.refreshDataFromServer() }.bind(this), 2000);
	}


	render() {
		var Config = this.state.Config;
		if (Config ==null ) {
			console.log('render() config not loaded')
			return null;
		}


		return  (
			<Box>
				<br/>
				<i>Build Num</i> = <b>{Config.BuildNum}</b>, <i>Broken</i> = <b>{Config.Broken==='true'?"true":"false"}</b>, <i>ServerURL</i> = <b>{Config.ServerURL}</b>
				<br/><br/>
				{this.renderQuestionCounters()}
				<br/><br/>				
				<Box width = "100%" align="center">
					<Button padding="10px" primary onClick = {this.refreshDataFromServer}>Refresh Data</Button>&nbsp;
					<Button primary onClick = {this.resetCounters}>Reset Counters</Button>&nbsp;
					<Button primary onClick = {this.goToPresenter}>Go to Presenter</Button>&nbsp;
					<Button primary onClick = {this.goToParticipant}>Go to Participant</Button>
				</Box>
			</Box>
		);	
	}
}


