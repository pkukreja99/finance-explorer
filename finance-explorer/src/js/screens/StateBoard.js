import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Spinning from 'grommet/components/icons/Spinning';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Animate from 'grommet/components/Animate';
import Paragraph from 'grommet/components/Paragraph';
import Button from 'grommet/components/Button';
import Scorecard from 'grommet/components/icons/base/Scorecard';
import Formtrash from 'grommet/components/icons/base/Formtrash';

import ResponsiveEmbed from 'react-responsive-embed';





import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';


import { pageLoaded } from './utils';

import PartyBoard from './PartyBoard';
import {DemIcon, RepIcon} from './PartyIcon';

import {
  loadTasks
} from '../actions/tasks';



class StateBoard extends Component {
  constructor() {
      super();
      
      this.state = {
        demActive: false,
        repActive: false,
        name: '',
        cands: "ah",
        show_report: false,
      };
      
      this._onClickDemButton = this._onClickDemButton.bind(this);
      this._onClickRepButton = this._onClickRepButton.bind(this);
  }

  _onClickDemButton() {
    this.setState({ demActive: true })
  }

  _onClickRepButton() {
    this.setState({ repActive: true })
  }

  gen_report_iframe() {
    return <ResponsiveEmbed frameborder="20" src='http://127.0.0.1:8080/api/show'/>
    // return {__html: '<iframe frameBorder="0" src="http://127.0.0.1:8080/api/show" style="width:100%; height:100%;"></iframe>'}
  }


  _onClickTrashButton() {
    fetch("http://127.0.0.1:8080/api/clear");
  }

  _onClickReportButton() {
    this.setState({
      show_report: true,
    })
  }

  componentDidMount() {
    const { match: { params }, dispatch } = this.props;


    this.setState({name: params.name.toUpperCase()})
    this.props.dispatch(loadTasks(params.name.toUpperCase()));

    pageLoaded(this.state.name+' Selection');

    fetch("http://127.0.0.1:5000/api/"+params.name.toUpperCase()+"/cands/")
    .then((response) => response.json())
    .then((result) => {
          this.setState({ cands: result.candidates});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount() {
  }

  _reset(event) {
    if(this.state.show_report) {
      this.setState({show_report: false});
    } else if(this.state.repActive || this.state.demActive) {
      this.setState({repActive: false,demActive: false});
    } else {
      window.location.replace("/");
    }
  }

  render() {
    const { task } = this.props;
    let taskNode;
    if (!task) {
      taskNode = (
        <Box pad={'medium'}
        >
        <Heading tag={'h3'}>
        <span id="campaign-prompt"><Spinning/> Candidate breakdown not yet supported</span>
        </Heading>
        </Box>
      );
    } else {
      taskNode = (
        <List selectable={true}>
        <ListItem justify='between'
          separator='horizontal'>
          <span>
            Beto O'Rourke
          </span>
          <span className='secondary'>
            US Senate
          </span>
        </ListItem>
        <ListItem justify='between'>
          <span>
            Ted Cruz
          </span>
          <span className='secondary'>
            US Senate
          </span>
        </ListItem>
        </List>
      );
    }

    var layer;

    if(this.state.show_report) {
      layer = this.gen_report_iframe();
    } else {
      layer = (this.state.demActive || this.state.repActive)
        ?        <Box><PartyBoard dem={this.state.demActive} rep={this.state.repActive} state={this.state.name}/></Box>
        : <div><Box pad="small" align="center">
                <Heading margin='none' strong={true}>
            Pick your party<br/><br/>
            <Anchor icon={<DemIcon />} onClick={this._onClickDemButton}  href='#' />
        <Anchor icon={<RepIcon />} onClick={this._onClickRepButton}  href='#' />
          </Heading>
          <Paragraph size='xlarge'>
            Or select an affiliated campaign!
            </Paragraph>
      </Box>{taskNode}</div>;
    }

    return (
      <Article primary={true} full={true}>
        <Header
          direction='row'
          size='medium'
          colorIndex='neutral-4-t'
          align='center'
          fixed={this.state.show_report}
          responsive={true}
          pad={{ horizontal: 'small' }}
        >
          <Anchor onClick={this._reset.bind(this)}>
            <LinkPrevious a11yTitle='Back to Splash' />
          </Anchor>
          <Heading margin='none' strong={true}>
            {this.state.name}
            {this.state.demActive ?  '→ Dem → Finance Dashboard' : ''}
            {this.state.repActive ?  '→ Rep → Finance Dashboard' : ''}
          </Heading>
          <Box flex={true}
    justify='end'
    direction='row'
    responsive={false}>
          <Button onClick={this._onClickTrashButton.bind(this)} icon={<Formtrash/>}/>
          <Button id="report-button" onClick={this._onClickReportButton.bind(this)} icon={<Scorecard/>} plain={true}/>
        </Box>
        </Header>
        <Animate enter={{"animation": "fade", "duration": 1000, "delay": 0}}>
        {layer}
      </Animate>
      </Article>
    );
  }
}

StateBoard.defaultProps = {
  error: undefined,
  task: undefined
};

StateBoard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  match: PropTypes.object.isRequired,
  task: PropTypes.object
};


StateBoard.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default connect()(StateBoard);
