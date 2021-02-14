import React, { Component } from "react";
import Title from "../../components/UI/Title/Title";

import "./DisclaimersPage.css";

class DisclaimersPage extends Component {
  render() {
    return (
      <div className="page-container">
        <Title>DISCLAIMERS</Title>
        <div className="disclaimer">
          All persons using our site acknowledges that our contractors are only recommendations.
          All contractors have been vetted by a qualified and licensed inspector and have demonstrated both quality workmanship and integrity.
          We recommend all persons research their suggested contractors prior to making a selection.
          We require all persons choosing a Trusted Tradesmen contractor, prior to the contractor Starting to deposit 15% + HST (see exclusions) of the total job cost into a holding account with Trusted Tradesmen. This will come of the final there final bill and will only be released to the contractor when inspector had checked and no problems were found. If problems are discovered Trusted Tradesmen gives contractor a chance to return to correct or if contractor fails to do so, money in trust is not released to contractor but instead is used to correct problems found. Contractor will now be removed from site NEVER to be allowed back on. Trusted Tradesmen has done our best to investigate all our contractors and only obtain ones with good morals, values and quality of work, no one will get ripped off. Depending on type of job and price, Trusted Tradesmen will send a professional inspector out within 2 weeks of job completion to inspect quality of work at contractors expense.
          All contractors on Trusted Tradesmen will have duel ratings, one from customer and one from professional (inspector). Most sites only have one rating from customers who mostly no nothing about construction methods , Trusted Tradesmen will give customers a clearer picture of contractor performance. This is the site I want you, your parents or grand parents to use knowing they will get a great job done for a fair price and will never get ripped off.
        </div>
        {this.props.isAuth && this.props.userType === 1 && (
          <>
            <h3>CONTRACTORS</h3>
            <div className="disclaimer">
              Contractors affiliated with Trusted Tradesmen will abide by our motto; "Quality Work for a Fair Price".
              Our contractors are encouraged to maintain honesty, integrity, and quality of work.
              Jobs over $5,000 will be validated by a professional home inspector to ensure they meet our quality standards.
              In the event that a home inspector finds a job which doesn't meet our standards, the contractor will be notified and the issue will be remedied through a return visit.
              Our inspectors are veterans; they understand the industry very well, and are aware of the limitations contractors experience with aspects such as materials and customers.
              Our inspectors are here to validate your workmanship and add to your reputation.
              Trusted Tradesmen is not looking for the cheapest contractors, and we're not looking for the most expensive; we want you to be honest with your estimates as to ensure the job is completed in a quality fashion.
              Trusted Tradesmen wants all of our contractors to earn a good living and be paid what they deserve based on quality and workmanship.
              The ultimate goal of this site is to help contractors to obtain relevant job leads and bolster their reputation, adding nicely to their bottom line.
              The contractor will only have to pay a consultation fee on jobs obtained and completed.
              There is no fee to be featured on our site or to possess a contractor account.
              The jobs leads will be emailed to contractors with pertinent info of the job including client budget and will only be mailed out if it is within the agreed upon contractor coverage area.
              Contractors may decide to contact client and obtain more info or just decline job lead.
              Trusted Tradesmen will require the contractor to pay the consultation fee directly to Trusted Tradesmen on the lower priced jobs completed (see fee schedule below):
              Selected jobs over $5,000 will be subjected to a 15% hold back and a check by a professional inspector within two weeks of job completion.
              Upon favourable check by inspector, remaining funds will be released to contractor minus Trusted Tradesmens fee.This fee is to be deposited into a Trusted Tradesmen holding account by the client prior to contractor starting job.
              This may also protect the contractor in the case where the client doesn’t fully pay the contractor what is owed, Trusted Tradesmen will forgo there fee and release the entire amount to the contractor and client will never be able to use Trusted Tradesmen site again.
              All Trusted Tradesmen contractors will obtain proper permits for jobs, abide by Ontario building codes and be respectable to all clients.
              Trusted Tradesmen wants their site to be recognized by the elderly community as one that can be trusted to obtain reliable and quality contractors at any time; a site you would trust your parents to pick a contractor from.
        </div>
          </>
        )}
      </div>
    );
  }
}

export default DisclaimersPage;
