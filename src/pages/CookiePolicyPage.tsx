import React from 'react';

const CookiePolicyPage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Cookie Policy</h1>
          <p className="legal-date">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit our website. They help us provide 
              you with a better experience by remembering your preferences, analyzing site usage, and personalizing content.
            </p>
          </section>

          <section>
            <h2>2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic site functionality and security</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our site</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Provide insights into site usage and performance</li>
            </ul>
          </section>

          <section>
            <h2>3. Types of Cookies We Use</h2>
            
            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation, 
              access to secure areas, and user authentication. The website cannot function properly without these cookies.
            </p>

            <h3>Performance Cookies</h3>
            <p>
              These cookies collect information about how visitors use our website, such as which pages are visited most often 
              and if users get error messages. This information is used to improve website performance.
            </p>

            <h3>Functional Cookies</h3>
            <p>
              These cookies allow the website to remember choices you make and provide enhanced, more personal features. 
              They may be set by us or by third-party providers whose services we have added to our pages.
            </p>

            <h3>Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting and reporting information 
              anonymously. This helps us improve our services and user experience.
            </p>
          </section>

          <section>
            <h2>4. Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third-party services that appear on our pages. These third parties may use cookies 
              to collect information about your online activities across different websites. We do not control these cookies 
              and they are subject to the privacy policies of the third parties.
            </p>
          </section>

          <section>
            <h2>5. Managing Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            <ul>
              <li><strong>Browser Settings:</strong> Most browsers allow you to refuse cookies or delete them</li>
              <li><strong>Cookie Consent:</strong> Use our cookie consent tool to manage preferences</li>
              <li><strong>Third-Party Opt-Out:</strong> Use opt-out tools provided by third-party services</li>
            </ul>
            <p>
              Please note that disabling certain cookies may affect the functionality of our website and your user experience.
            </p>
          </section>

          <section>
            <h2>6. Cookie Duration</h2>
            <p>Cookies on our website may be:</p>
            <ul>
              <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
            </ul>
          </section>

          <section>
            <h2>7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, 
              legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
            </p>
          </section>

          <section>
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at privacy@sandhill.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
