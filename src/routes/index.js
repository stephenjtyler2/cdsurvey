import React from 'react';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { ThemeProvider } from 'mineral-ui/themes';
import Text from 'mineral-ui/Text';
import Box from 'mineral-ui/Box';
import Flex, { FlexItem } from 'mineral-ui/Flex';

import Home from './Home';
import Admin from './Admin';
import Results from './Results';
import Presenter from './Presenter';
import Questions from './Questions';
import Thanks from './Thanks';

import '../css/App.css'

import logo from '../img/msflogo.png';

export default () => (
	<ThemeProvider>
		<Box padding="0px" margin="0px">
			<header>
				<Flex 
					breakpoints={[800,'wide']}
					direction = {['column','row','row']} >
					<FlexItem  align = {['center','left','left']}>
						<div className = 'frame'><span className = "helper">
								<img src = {logo} alt = "logo" className = "logo"/>
						</span></div>
					</FlexItem>
					<FlexItem grow={5} margin ={[10,50,50]} >
						<Text  align = "center" element = "h2" color = "white">Continuous Testing and Delivery Survey</Text>
						{/* <Text  align = "center" element = "h5" color = "white">A CA Modern Software Factory Application</Text> */}
					</FlexItem>
				</Flex>
			</header>
			<BrowserRouter>
					<Switch>
						<Route path = "/presenter" exact render = {props => <Presenter {...props} />} />
						<Route path = "/results" exact render = {props => <Results {...props} />} />
						<Route path = "/admin" exact render = {props => <Admin {...props} />} />
						<Route path = "/questions" exact render = {props => <Questions {...props} />} />
						<Route path = "/thanks" exact render = {props => <Thanks {...props} />} />
						<Route path = "/" render = {props => <Home {...props} />} />
					</Switch>
			</BrowserRouter>
		</Box>
	</ThemeProvider>
);