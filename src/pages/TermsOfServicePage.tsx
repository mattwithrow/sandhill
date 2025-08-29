import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Terms of Service</h1>
          <p className="legal-date">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Sandhill ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Sandhill is a platform that connects individuals with ideas, missions, or projects with skilled professionals and collaborators 
              who can help bring those ideas to life. The Platform facilitates connections between idea owners and experts across various fields.
            </p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the Platform, you must create an account. You are responsible for maintaining the confidentiality 
              of your account information and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2>4. User Conduct</h2>
            <p>
              You agree to use the Platform only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul>
              <li>Use the Platform to transmit any material that is defamatory, offensive, or otherwise objectionable</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
              <li>Interfere with or disrupt the Platform or servers connected to the Platform</li>
              <li>Attempt to gain unauthorized access to any portion of the Platform</li>
            </ul>
          </section>

          <section>
            <h2>5. Intellectual Property</h2>
            <p>
              The Platform and its original content, features, and functionality are owned by Sandhill and are protected by international 
              copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2>6. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Platform, 
              to understand our practices.
            </p>
          </section>

          <section>
            <h2>7. Disclaimers</h2>
            <p>
              The Platform is provided on an "AS IS" and "AS AVAILABLE" basis. Sandhill makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of 
              merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall Sandhill, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any 
              indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, 
              use, goodwill, or other intangible losses, resulting from your use of the Platform.
            </p>
          </section>

          <section>
            <h2>9. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, 
              under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>

          <section>
            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
              we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at legal@sandhill.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
