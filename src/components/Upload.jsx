import React from 'react'
import styles from './Upload.css'

export default class Upload extends React.Component{
  render(){
    return (
      <div>
        <div className={styles.add_box}>
          <i className="iconfont iconicon_add" />
        </div>
        <div>
          <input type="file" accept="image/*" />
        </div>
      </div>
    )
  }
}