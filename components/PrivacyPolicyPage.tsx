import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center">
            Privacy and <span className="text-orange-600 dark:text-orange-400">Policy</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-center">
            Last updated: August 1, 2024
          </p>

          <div className="mt-12 prose prose-slate dark:prose-invert max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-800 dark:prose-h2:text-slate-200 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:underline">
            <h2>1. Introduction</h2>
            <p>
              Your privacy is important to us. This Privacy Policy explains how B.M Lib handles information in connection with your use of the application ("the Service"). We are committed to transparency and protecting your privacy.
            </p>
            
            <h2>2. Information We Do Not Collect</h2>
            <p>
              B.M Lib is a client-side application that functions as a browser for the Open Library API. We do not have user accounts, databases, or servers to store user information. We do not collect, store, track, or share any personally identifiable information (PII), such as:
            </p>
            <ul>
                <li>Your name or email address.</li>
                <li>Your IP address or location data.</li>
                <li>Your browsing history within the app.</li>
                <li>Any other personal data.</li>
            </ul>

            <h2>3. How We Use Information</h2>
            <p>
              Since we do not collect any personal information, we do not use it for any purpose. Your activity within the app, such as searches performed, is processed on your device and sent directly to the Open Library API to fetch results. This information is not seen or stored by us.
            </p>
            
            <h2>4. Third-Party Services</h2>
            <p>
              Our Service relies on the Open Library API to provide book and author data. When you perform a search, your browser makes a direct request to Open Library's servers. We encourage you to review the <a href="https://archive.org/about/terms.php" target="_blank" rel="noopener noreferrer">Internet Archive's Terms of Use</a> and <a href="https://archive.org/about/privacy-policy.php" target="_blank" rel="noopener noreferrer">Privacy Policy</a> (which governs Open Library) to understand how they handle data.
            </p>

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>
              B.M Lib does not use cookies or any other tracking technologies to monitor your activity. The application is designed to be a simple, privacy-respecting tool.
            </p>

            <h2>6. Children's Privacy</h2>
            <p>
              Our Service does not collect personal information from anyone, including children under the age of 13. The application is safe for all ages as it is purely informational.
            </p>

            <h2>7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>8. Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@bmlib-example.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;