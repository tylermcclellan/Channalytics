import React from 'react'
import { 
  ListGroupItem, 
  Image, 
  Row, 
  Col, 
  Popover,
  OverlayTrigger
} from 'react-bootstrap'
import ReactWordCloud from 'react-wordcloud'

class UserItem extends React.Component {
  getWordCloud = () => {
    const wordList = Object.keys(this.props.words)
    const words = wordList.map(word => {
      return { word: word, value: this.props.words[word] }
    })
    const WORD_COUNT_KEY = 'value'
    const WORD_KEY = 'word'

    return (
      <div style={{width: 600, height: 400}}>
        <ReactWordCloud
	        words={words}
	        wordCountKey={WORD_COUNT_KEY}
	        wordKey={WORD_KEY}
        />
      </div>
    )
  }
  
  render() {
    const wordCloud = this.getWordCloud()
    const popover = (
      <Popover id={`popover-${this.props.name}`} style={{width: 600, height: 400}} title='Word Cloud'>
        {wordCloud}
      </Popover>
    )
    
    return (
      <ListGroupItem>
          <Row>
            <Col md={1} lg={1}>
              <span>
                <OverlayTrigger
                  trigger='click'
                  rootClose
                  placement='top'
                  overlay={popover}>
                  <Image src={this.props.img} style={{cursor: 'pointer'}} alt="img not found" rounded/>
                </OverlayTrigger>
              </span> 
            </Col>
            <Col md={2} lg={2}>
              <span>{this.props.name}</span> 
            </Col>
            <Col md={2} lg={2}>
              <span>{this.props.percent}%</span>
            </Col>
            <Col md={1} lg={1}>
              <span>{this.props.messages}</span>
            </Col>
            <Col md={1} lg={1}>
              <span>{this.props.numWords}</span>
            </Col>
            <Col md={1} lg={1}>
              <span>{this.props.sentiment}</span>
            </Col>
            <Col md={1} lg={1}>
            </Col>
            <Col md={3} lg={3}>
              <span>{this.props.unique}</span>
            </Col>
          </Row>
      </ListGroupItem>
    )
  }
}

export default UserItem
