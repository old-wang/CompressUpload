import React from 'react'
import ReactDOM from 'react-dom'
import Upload from './components/Upload'

class App extends React.Component {
  render() {
    return (
      <div>
        <Upload />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
