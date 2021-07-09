import React, { Component } from "react";
import "./AboutPage.css";
import Title from "../../components/UI/Title/Title";

class AboutPage extends Component {
  render() {
    return (
      <div className="page-container">
        <Title>About Us</Title>
        <p>
          I believe in doing your job right or don’t do it. Find another profession.
        </p>
        <p>
          I’ve been a home inspector for more than 20 years. In that time, a thorough nature has
          been my signature. I don’t believe I’m alone, either. Most people want to put their best
          foot forward and earn trust by treating others with respect. Sadly, the actions of a select
          few can make that otherwise-simple goal more complicated than it ever has to be.
        </p>
        <p>
          Over the course of more than 5,000 inspections spanning from modest 300 square-foot
          homes to mansions in excess of 60 times that size, my work ethic has allowed me the
          privilege of collaborating with some of Canada’s most sought-after contractors, including
          HGTV mainstay Mike Holmes (“Holmes Makes It Right” and “Holmes on Homes”).
          Wherever my career has taken me, nothing has broken my heart quite like seeing honest
          people taken for a ride because someone else wanted to rip someone off for an easy
          buck or just decided “good enough” was good enough.
        </p>
        <p>
          My hard-working upbringing instilled something different, though. Every job is a
          relationship between the customer and the project. Each project is a customer’s vision,
          an evolution of a home where memories grow and lives evolve. That’s why I wanted to
          build a website that was simple and straightforward for homeowners from every walk of
          life. I pride myself on never turning away a customer with a question. If I somehow don’t
          have the answer, I will get it from the people I trust who do.
          The better homes and better contractors every Canadian deserves. That’s my dream.
        </p>
      </div>
    );
  }
}

export default AboutPage;
