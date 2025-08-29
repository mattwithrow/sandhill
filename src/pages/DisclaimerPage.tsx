import React from 'react';

const DisclaimerPage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Disclaimer</h1>
          <p className="legal-date">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2>General Disclaimer</h2>
            <p>
              The information provided on Sandhill ("the Platform") is for general informational purposes only. 
              While we strive to keep the information up to date and correct, we make no representations or warranties 
              of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability 
              of the information, products, services, or related graphics contained on the Platform for any purpose.
            </p>
          </section>

          <section>
            <h2>No Professional Advice</h2>
            <p>
              The content on this Platform is not intended to constitute professional advice, including but not limited to 
              legal, financial, business, or technical advice. You should consult with qualified professionals before making 
              any decisions based on information found on this Platform.
            </p>
          </section>

          <section>
            <h2>User-Generated Content</h2>
            <p>
              The Platform allows users to post content, including project descriptions, profiles, and communications. 
              We do not endorse, verify, or guarantee the accuracy, completeness, or usefulness of any user-generated content. 
              Users are responsible for their own content and interactions.
            </p>
          </section>

          <section>
            <h2>Third-Party Content and Links</h2>
            <p>
              The Platform may contain links to third-party websites or content. We have no control over the nature, 
              content, and availability of those sites. The inclusion of any links does not necessarily imply a 
              recommendation or endorse the views expressed within them.
            </p>
          </section>

          <section>
            <h2>No Guarantee of Results</h2>
            <p>
              We do not guarantee that using the Platform will result in successful collaborations, project completion, 
              or any specific outcomes. The success of collaborations depends on many factors beyond our control, 
              including the efforts and cooperation of users.
            </p>
          </section>

          <section>
            <h2>Platform Availability</h2>
            <p>
              We strive to maintain the Platform's availability but do not guarantee uninterrupted access. The Platform 
              may be temporarily unavailable due to maintenance, technical issues, or other factors beyond our control.
            </p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>
              In no event shall Sandhill, its directors, employees, partners, agents, suppliers, or affiliates be liable 
              for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use 
              of the Platform or any information contained therein.
            </p>
          </section>

          <section>
            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Sandhill and its affiliates from any claims, damages, losses, 
              or expenses arising from your use of the Platform or violation of these terms.
            </p>
          </section>

          <section>
            <h2>Governing Law</h2>
            <p>
              This disclaimer shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which Sandhill operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>Changes to Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time. Changes will be effective immediately 
              upon posting on the Platform. Your continued use of the Platform constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2>Contact Information</h2>
            <p>
              If you have any questions about this disclaimer, please contact us at legal@sandhill.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
