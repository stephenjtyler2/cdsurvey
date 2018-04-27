import React from 'react';

import { FormField } from 'mineral-ui/Form';
//import Text from 'mineral-ui/Text';
import Box from 'mineral-ui/Box';
import Button from 'mineral-ui/Button';
import { RadioGroup } from 'mineral-ui/Radio';
import waitImg from '../img/wait.gif';

import IconChevronRight from 'mineral-ui-icons/IconChevronRight';


export default class Questions extends React.Component {
    
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
			value: '0',
			questionIndex: 0,
		    alreadyFartedAbout :false
		};

		this.getConfig();

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
    	console.log(event.target.value);
    	this.setState({
        	value: event.target.value
    	});
    }

    handleSubmit(event) {
    	event.preventDefault();
    	var Config = this.state.Config;
    	if (Config==null) return;

    	//console.log('about to post counter increment for questionId:' + this.state.questionIndex+1 + ', responseId:' + this.state.value);
		fetch(Config.ServerURL, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				questionId: this.state.questionIndex+1,
				responseId: this.state.value
			})
		})



    	// either present next qusetion or move to Thanks page if we're done.
    	if (this.state.questionIndex<3)    		
    		this.setState({
    			questionIndex: this.state.questionIndex+1,
    			value : '0'
    		});
    	else {
	    	this.props.history.push('/thanks');
    	}
    }

    quitFartingAbout() {
    	this.setState({alreadyFartedAbout:true});
    	this.forceUpdate();
    }

    render() {

    	var Config = this.state.Config;
    	if (Config==null) return null;

    	if (Config.Broken==="true" && !this.state.alreadyFartedAbout) {

    		// schedule the end of the waiting...
    		setTimeout(function() { this.quitFartingAbout() }.bind(this), 6000);

    		// return the please wait graphic.   480 x 320

    		const imgStyle = {
			    display: "block",
			    marginLeft: "auto",
			    marginRight: "auto",
			    width: "50%"
    		}

    		return (
				<Box padding = "20px" >
					<center><img src = {waitImg}  className = "pleaseWait" style = {imgStyle} alt = "please wait"/></center>
				</Box>
    		);
    	}


    	const icon = <IconChevronRight/>;
    	var currentQuestion =  Config.Questions[this.state.questionIndex];
    	var answers = currentQuestion.answers;
		return (
			<Box padding = "20px" height={100}>
				<form onSubmit = {this.handleSubmit}>
					<FormField 
						input = {RadioGroup}
						label = {currentQuestion.question}
						name = "answers"
						disabled = {Config.Broken === "true"?true:false}
						checked= {this.state.value}
						onChange = {this.handleChange}
						data={[
							{ label: answers[0], value:  '1'},
							{ label: answers[1], value:  '2'},
							{ label: answers[2], value:  '3'},
							{ label: answers[3], value:  '4'}
					    ]} />

					<Box marginVertical = "20px" >
						<div align="right" width = "100%">
	      					<Button disabled = {Config.Broken === 'true' || this.state.value==='0'} type="submit" primary  size = "jumbo" iconEnd={icon}>{this.state.questionIndex<3 ? 'Next':'Finish'}</Button>
	      				</div>
	  				</Box>
				</form>
	   		</Box>
      	);
    }
}