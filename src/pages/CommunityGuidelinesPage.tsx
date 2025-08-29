import React from 'react';

const CommunityGuidelinesPage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Community Guidelines</h1>
          <p className="legal-date">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2>Our Mission</h2>
            <p>
              Sandhill is built on the belief that meaningful collaboration happens when people with shared values and 
              complementary skills come together. Our community guidelines are designed to foster an environment where 
              everyone can connect, collaborate, and build what matters.
            </p>
          </section>

          <section>
            <h2>Core Values</h2>
            <ul>
              <li><strong>Respect:</strong> Treat all members with dignity and respect</li>
              <li><strong>Authenticity:</strong> Be genuine in your interactions and representations</li>
              <li><strong>Collaboration:</strong> Work together to achieve shared goals</li>
              <li><strong>Integrity:</strong> Act honestly and ethically in all interactions</li>
              <li><strong>Purpose:</strong> Focus on meaningful, mission-driven work</li>
            </ul>
          </section>

          <section>
            <h2>What We Encourage</h2>
            <ul>
              <li>Sharing genuine ideas and projects that align with your values</li>
              <li>Offering your skills and expertise to help others succeed</li>
              <li>Building authentic connections based on shared interests and goals</li>
              <li>Providing constructive feedback and support</li>
              <li>Celebrating the successes and contributions of others</li>
              <li>Maintaining open and honest communication</li>
            </ul>
          </section>

          <section>
            <h2>What We Don't Allow</h2>
            
            <h3>Harassment and Discrimination</h3>
            <p>
              We have zero tolerance for harassment, discrimination, or hate speech based on race, ethnicity, 
              national origin, religion, gender, sexual orientation, age, disability, or any other protected characteristic.
            </p>

            <h3>Misrepresentation</h3>
            <p>
              Be honest about your skills, experience, and intentions. Don't misrepresent yourself, your qualifications, 
              or your projects. Authenticity is key to building trust in our community.
            </p>

            <h3>Spam and Commercial Solicitation</h3>
            <p>
              Don't use the platform for unsolicited commercial purposes, spam, or mass messaging. Focus on genuine 
              collaboration rather than sales pitches.
            </p>

            <h3>Inappropriate Content</h3>
            <p>
              Don't share content that is offensive, explicit, violent, or otherwise inappropriate. This includes 
              but is not limited to pornography, graphic violence, and illegal activities.
            </p>

            <h3>Privacy Violations</h3>
            <p>
              Respect the privacy of other members. Don't share personal information without consent or use the 
              platform to stalk or harass others.
            </p>
          </section>

          <section>
            <h2>Communication Guidelines</h2>
            <ul>
              <li>Be clear and specific about your goals and expectations</li>
              <li>Respond to messages in a timely manner</li>
              <li>Use respectful and professional language</li>
              <li>Ask questions to clarify understanding</li>
              <li>Provide constructive feedback when appropriate</li>
              <li>Respect boundaries and personal preferences</li>
            </ul>
          </section>

          <section>
            <h2>Project and Collaboration Standards</h2>
            <ul>
              <li>Clearly define project goals, timelines, and expectations</li>
              <li>Be transparent about roles, responsibilities, and compensation</li>
              <li>Communicate regularly about progress and challenges</li>
              <li>Respect intellectual property and give proper credit</li>
              <li>Follow through on commitments or communicate changes promptly</li>
              <li>Resolve conflicts respectfully and constructively</li>
            </ul>
          </section>

          <section>
            <h2>Reporting Violations</h2>
            <p>
              If you encounter behavior that violates these guidelines, please report it to us immediately. 
              You can report violations through our platform or by contacting us at community@sandhill.com.
            </p>
            <p>
              When reporting, please provide:
            </p>
            <ul>
              <li>Specific details about the incident</li>
              <li>Screenshots or other evidence when possible</li>
              <li>Your contact information for follow-up</li>
            </ul>
          </section>

          <section>
            <h2>Consequences of Violations</h2>
            <p>
              Violations of these guidelines may result in:
            </p>
            <ul>
              <li>Warning messages and requests to modify behavior</li>
              <li>Temporary suspension of account access</li>
              <li>Permanent removal from the platform</li>
              <li>Reporting to law enforcement when appropriate</li>
            </ul>
            <p>
              We reserve the right to take action based on the severity and nature of the violation.
            </p>
          </section>

          <section>
            <h2>Appeals Process</h2>
            <p>
              If you believe an action taken against your account was made in error, you may appeal the decision 
              by contacting us at appeals@sandhill.com. Please include relevant details and evidence to support your appeal.
            </p>
          </section>

          <section>
            <h2>Updates to Guidelines</h2>
            <p>
              These guidelines may be updated periodically to reflect the evolving needs of our community. 
              We will notify members of significant changes and provide opportunities for feedback.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have questions about these guidelines or need clarification on any point, 
              please contact us at community@sandhill.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelinesPage;
