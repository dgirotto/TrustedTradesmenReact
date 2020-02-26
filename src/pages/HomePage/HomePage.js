import React, { Component } from "react";
import "./HomePage.css";
import Title from "../../components/UI/Title/Title";
class HomePage extends Component {
  render() {
    return (
      <div className="home-container">
        <Title size="Large" color="Black" align="Center">
          WELCOME TO TRUSTED TRADESMEN
        </Title>
        <div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Non
            tellus orci ac auctor augue mauris augue. Amet tellus cras
            adipiscing enim eu turpis egestas pretium aenean. Vitae auctor eu
            augue ut lectus arcu bibendum. Et netus et malesuada fames ac. At
            urna condimentum mattis pellentesque id nibh tortor id aliquet. Orci
            ac auctor augue mauris augue neque. Porta non pulvinar neque laoreet
            suspendisse interdum consectetur. Molestie ac feugiat sed lectus
            vestibulum mattis ullamcorper. Ut enim blandit volutpat maecenas
            volutpat blandit. Massa enim nec dui nunc mattis enim. Aenean et
            tortor at risus viverra adipiscing at in. Lacus luctus accumsan
            tortor posuere ac. Tincidunt lobortis feugiat vivamus at augue.
            Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque
            habitant. Nibh tellus molestie nunc non blandit massa enim nec dui.
            Pellentesque adipiscing commodo elit at.
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Non
            tellus orci ac auctor augue mauris augue. Amet tellus cras
            adipiscing enim eu turpis egestas pretium aenean. Vitae auctor eu
            augue ut lectus arcu bibendum. Et netus et malesuada fames ac. At
            urna condimentum mattis pellentesque id nibh tortor id aliquet. Orci
            ac auctor augue mauris augue neque. Porta non pulvinar neque laoreet
            suspendisse interdum consectetur. Molestie ac feugiat sed lectus
            vestibulum mattis ullamcorper. Ut enim blandit volutpat maecenas
            volutpat blandit. Massa enim nec dui nunc mattis enim. Aenean et
            tortor at risus viverra adipiscing at in. Lacus luctus accumsan
            tortor posuere ac. Tincidunt lobortis feugiat vivamus at augue.
            Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque
            habitant. Nibh tellus molestie nunc non blandit massa enim nec dui.
            Pellentesque adipiscing commodo elit at.
          </div>
          <div>
            <img className="main-img" src={"https://i.imgur.com/97BXG6z.png"} />
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
