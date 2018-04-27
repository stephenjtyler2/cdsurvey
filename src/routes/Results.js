import React from 'react';

import Text from 'mineral-ui/Text';
import Box from 'mineral-ui/Box';
import Button from 'mineral-ui/Button';
import Card, { CardBlock, CardFooter } from 'mineral-ui/Card';



export default class Results extends React.Component  {
	
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

		//console.log ("Ctor");
		this.state = {
			questionRespondents : [ 0,0,0,0],
			questionPercentages : [
				[ 0,  0,  0, 0],
				[ 0,  0,  0, 0],
				[ 0,  0,  0, 0],
				[ 0,  0,  0, 0]
			],
			showCorrectAnswers :false
		};
		this.getConfig();
	   	this.showCorrectAnswers = this.showCorrectAnswers.bind(this);
    }

	componentWillMount() {
		//console.log ("WillMount");
		this.refreshDataFromServer();

	}

	refreshDataFromServer() {
		var Config = this.state.Config;
		if (Config==null) {
			// console.log('refreshDataFromServer(): Config not loaded');
	   		setTimeout(function() { this.refreshDataFromServer() }.bind(this), 250);
	   		return;
		}

		var that=this;
		//console.log("refresh");
		var questionCounters = [
			[ 0,  0,  0, 0],
			[ 0,  0,  0, 0],
			[ 0,  0,  0, 0],
			[ 0,  0,  0, 0]
		];

		var questionPercentages = this.state.questionPercentages;
		var questionRespondents = this.state.questionRespondents;
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

			// Now figure out the percentages.
			for (var q=0;q<4;q++)
			{
				var total = 
					parseInt(questionCounters[q][0],10) + 
					parseInt(questionCounters[q][1],10) + 
					parseInt(questionCounters[q][2],10) + 
					parseInt(questionCounters[q][3],10);

				questionRespondents[q] =total;
				
				questionPercentages[q][0] = total>0 ? 100*questionCounters[q][0] / total : 0;
				questionPercentages[q][1] = total>0 ? 100*questionCounters[q][1] / total : 0;
				questionPercentages[q][2] = total>0 ? 100*questionCounters[q][2] / total : 0;
				questionPercentages[q][3] = total>0 ? 100*questionCounters[q][3] / total : 0;
			}

			that.setState({
				questionRespondents : questionRespondents,
				questionPercentages : questionPercentages
    		});

		})
		.catch(function() {
			console.log('error from GetCounters API call');
		});

   		setTimeout(function() { this.refreshDataFromServer() }.bind(this), 2000);

	}

	showCorrectAnswers() {
		console.log('reveal');
		this.setState ({showCorrectAnswers:true});
	}

	renderAnswerBlock(qNum,answerIndex) {
		var Config = this.state.Config;
		if (Config==null) return null;
		var question = Config.Questions[qNum-1];
		var showCorrectAnswers = this.state.showCorrectAnswers;
		return (
			<tr>
				<td height = "100%">
					<Text 
						element = 'span' 
						appearance = 'p'
						color = {showCorrectAnswers ? parseInt(question.correctAnswer,10) === answerIndex+1 ? "green" : "lightgrey" : "black"} 
						fontWeight = {showCorrectAnswers ? parseInt(question.correctAnswer,10) === answerIndex+1 ? "extraBold" : "regular" : "regular"} >
							&nbsp;&nbsp;{answerIndex+1}. {question.answers[answerIndex]} ({this.state.questionPercentages[qNum-1][answerIndex].toFixed(1)}%)
					</Text>
				</td>
			</tr>
		)
	}

	renderQuestionBlock(qNum) {
		var Config = this.state.Config;
		if (Config==null) return null;

		var question = Config.Questions[qNum-1];
		//var showCorrectAnswers = this.state.showCorrectAnswers;

		return (
			<Box height="100%">
				<Card>
					<CardBlock style = {{height:"170px"}}>
						<Text element = "h4" align="center"><i>Question {qNum}</i></Text>
						<Text element = "h5" >{question.question}</Text>
						<table>
							<tbody>
								{this.renderAnswerBlock(qNum,0)}
								{this.renderAnswerBlock(qNum,1)}
								{this.renderAnswerBlock(qNum,2)}
								{this.renderAnswerBlock(qNum,3)}
							</tbody>
						</table>
					</CardBlock>
					<CardFooter style = {{height:"35px"}}>
						<Box padding="4px">
							<center><Text fontWeight ="bold">Responses {this.state.questionRespondents[qNum-1]}</Text></center>
						</Box>
					</CardFooter>
				</Card>
			</Box>

		)

	}

	render() {
		var Config = this.state.Config;
		if (Config==null) return null;


		return  (
			<Box padding = "10px">
				<table height = "100%" width="100%" cellPadding = "10">
					<tbody>
						<tr>
							<td width="50%" height = "100%" >
								<Box height = "100%" grow = {1}>
									{this.renderQuestionBlock(1)}
								</Box>
							</td >
							<td width="50%" height = "100%" >
								<Box height = "100%" grow = {1}>
									{this.renderQuestionBlock(2)}
								</Box>
							</td>
						</tr>
						<tr>
							<td width="50%" height = "100%" >
								<Box height = "100%" grow = {1}>
									{this.renderQuestionBlock(3)}
								</Box>
							</td>
							<td width="50%" height = "100%" >
								<Box height = "100%" grow = {1}>
									{this.renderQuestionBlock(4)}
								</Box>
							</td>
						</tr>

					</tbody>
				</table>
				<br/>
					<center><Button style = {{display: this.state.showCorrectAnswers ? 'none': 'block'}} primary onClick = {this.showCorrectAnswers}>Reveal Correct Answers</Button></center>
			</Box>
		);	
	}
}


