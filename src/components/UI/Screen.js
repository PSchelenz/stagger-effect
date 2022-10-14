import React, { useEffect, useState } from 'react'

import classes from './Screen.module.css';

const Screen = props => {
  const [opacity, setOpacity] = useState(true);

  useEffect(() => {
    if(props.timeout) {
      setTimeout(() => {
        setOpacity(prevState => !prevState)
      }, props.timeout)
    }
  }, [props.timeout, props.isGlobalVisible])

  return <div className={`${classes.screen} ${opacity ? classes.show : classes.hide}`} onClick={props.onClick}>
    <div>
      {props.timeout}
    </div>
  </div>
}

export default Screen;