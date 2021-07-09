import React, { Component } from "react";
import Title from "../../components/UI/Title/Title";

import "./DisclaimersPage.css";

class DisclaimersPage extends Component {
  render() {
    return (
      <div className="page-container">
        <Title>DISCLAIMERS</Title>
        <div className="disclaimer">
          <p>
            Though qualified and licensed inspectors have vetted all contractors for demonstrable
            integrity and quality workmanship, all site users acknowledge that Trusted Tradesmen
            only provides recommendations. We strongly urge all users to independently research
            each suggested contractor before making a selection.
          </p>
          <p>
            Provided the job and price meets our guidelines, Trusted Tradesmen will dispatch a
            professional inspector, at the contractor’s expense, within one month of each job’s
            completion to assess the completed work’s quality. If issues with a contractor’s work
            should arise, Trusted Tradesmen will give each contractor a reasonable chance to correct
            their work. Any contractor failing to do so will face removal from Trustedtradesmen.ca
            and will never be welcomed back. Trusted Tradesmen has exerted our most diligent effort
            to investigate each contractor and retain only those with like-minded business ethics,
            values and quality workmanship to protect the investments of our users.
          </p>
          <p>
            All Trusted Tradesmen-approved contractors will be subject to dual ratings from
            customers and a professional inspector, respectively. We employ this system to ensure
            users have as clear a picture as possible of each contractor’s performance based on
            both previous customers’ anecdotal experiences and perspectives rooted in professional
            construction knowledge. I want Trusted Tradesmen to be a site you, your parents or your
            grandparents can feel equally comfortable and confident using when looking for a great
            job done at a fair price and 100% above-board.
          </p>
        </div>
        {this.props.isAuth && this.props.userType === 1 && (
          <>
            <h3>CONTRACTORS</h3>
            <div className="disclaimer">
              <p>
                Trusted Tradesmen’s affiliated contractors will abide by our motto, “Quality work for a
                fair price.” To that end, we encourage all contractors to champion honesty, integrity and
                high-quality workmanship. A professional home inspector will validate every job priced
                over $7,000 to ensure completed work meets our quality standards. In the event a job
                does not meet those standards, Trusted Tradesmen will notify the assigned contractor
                and any issues will be remedied with a return visit. All inspectors called upon by Trusted
                Tradesmen are industry veterans who are aware of the reasonable limitations contractors
                may experience regarding such factors as materials and customer needs. That being
                said, our inspectors are here to not only validate each contractor’s workmanship relative
                to customer reputation but to add to each contractor’s positive reputation by setting any
                defects right.
              </p>
              <p>
                Trusted Tradesmen is no in the business of associating with Ontario’s “cheapest” or
                “highest-priced” contractors. We are strictly interested in honest estimates and work
                completed in a timely, quality-oriented fashion. We want every contractor to earn a good
                living and be paid deservedly according to the standards of their finished job. This
                website is designed to open up promising leads and bolster each contractor’s reputation
                alongside their bottom line.
              </p>
              <p>
                Each contractor will pay a consultation fee on jobs accepted and completed. Being
                featured on our site or possessing a contractor account incurs no additional fees.
              </p>
              <p>
                Trusted Tradesmen will email leads to each contractor with pertinent job details,
                including the customer’s budget. We will only mail out these details if they fall within the
                contractor’s agreed-upon coverage area. Contractors may then decide whether to
                contact the client for more information or decline the lead. Consultation fees will be paid
                directly to Trusted Tradesmen on lower-priced completed jobs according to our listed fee
                schedule. Every Trusted Tradesmen contractor will obtain necessary permits for each
                job, abide by Ontario building codes and show every client paramount respect.
              </p>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default DisclaimersPage;
