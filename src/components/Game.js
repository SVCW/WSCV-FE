import React from 'react'
import {NavLink} from 'react-router-dom'
export default function Game() {
  return (
    <div>
      <div className="widget">
          <h4 className="widget-title">Giải trí</h4>
          <div className="ask-question">
            <div className="rec-events bg-purple">
              <i className="icofont-gift" />
              <h6>
                <a title href>
                  Game xúc xắc
                </a>
              </h6>
              <img alt src="images/clock.png" />
            </div>
            <NavLink to="/game">Chơi game</NavLink>
          </div>
        </div>

    </div>
  )
}
