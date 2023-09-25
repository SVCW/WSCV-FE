import React from 'react'

export default function SuggestedGroup() {
  return (
    <div className="widget">
    <h4 className="widget-title">Suggested Group</h4>
    <div className="sug-caro">
        <div className="friend-box">
            <figure>
                <img alt src="images/resources/sidebar-info.jpg" />
                <span>Members: 505K</span>
            </figure>
            <div className="frnd-meta">
                <img alt src="images/resources/frnd-figure2.jpg" />
                <div className="frnd-name">
                    <a title href="#">Social Research</a>
                    <span>@biolabest</span>
                </div>
                <a className="main-btn2" href="#" title>Join Community</a>
            </div>
        </div>
        <div className="friend-box">
            <figure>
                <img alt src="images/resources/sidebar-info2.jpg" />
                <span>Members: 505K</span>
            </figure>
            <div className="frnd-meta">
                <img alt src="images/resources/frnd-figure3.jpg" />
                <div className="frnd-name">
                    <a title href="#">Bio Labest Group</a>
                    <span>@biolabest</span>
                </div>
                <a className="main-btn2" href="#" title>Join Community</a>
            </div>
        </div>
    </div>
</div>
  )
}
