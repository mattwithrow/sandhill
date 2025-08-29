import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Privacy Policy</h1>
          <p className="legal-date">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, update your profile, 
              or communicate with other users. This may include:
            </p>
            <ul>
              <li>Name, email address, and contact information</li>
              <li>Profile information including skills, interests, and mission values</li>
              <li>Project descriptions and collaboration preferences</li>
              <li>Messages and communications with other users</li>
              <li>Usage data and platform interactions</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Connect you with relevant collaborators and projects</li>
              <li>Send you important updates and notifications</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
              except in the following circumstances:
            </p>
            <ul>
              <li>With other users as part of the platform's core functionality</li>
              <li>With service providers who assist in platform operations</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, 
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our platform. These technologies 
              help us remember your preferences, analyze site traffic, and understand how you interact with our services.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of certain communications</li>
              <li>Request a copy of your data</li>
              <li>Object to certain processing activities</li>
            </ul>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes 
              outlined in this policy. When you delete your account, we will delete or anonymize your personal information 
              within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2>8. International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure that such 
              transfers comply with applicable data protection laws and implement appropriate safeguards.
            </p>
          </section>

          <section>
            <h2>9. Children's Privacy</h2>
            <p>
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you believe we have collected such information, please contact us.
            </p>
          </section>

          <section>
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
              the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@sandhill.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
