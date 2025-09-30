import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center">
            Terms and <span className="text-orange-600 dark:text-orange-400">Conditions</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-center">
            Last updated: August 1, 2024
          </p>

          <div className="mt-12 prose prose-slate dark:prose-invert max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-800 dark:prose-h2:text-slate-200 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:underline">
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to B.M Lib ("the Service"). By accessing or using our application, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use the Service.
            </p>
            
            <h2>2. Description of Service</h2>
            <p>
              B.M Lib provides an interface to explore, search, and view data from the Open Library API. The Service is provided for personal, non-commercial use only. We are an independent application and are not affiliated with, endorsed by, or sponsored by the Internet Archive or Open Library.
            </p>
            
            <h2>3. Third-Party Content</h2>
            <p>
              All book data, including titles, author names, cover images, and descriptions, is sourced directly from the Open Library API. We do not host, own, or control this content. We are not responsible for the accuracy, completeness, or legality of the data provided by Open Library. Any issues with the content should be directed to the Open Library community.
            </p>

            <h2>4. User Conduct</h2>
            <p>
              You agree to use the Service only for lawful purposes. You are prohibited from using the Service to:
            </p>
            <ul>
                <li>Perform any activity that is illegal or fraudulent.</li>
                <li>Engage in any automated data collection (scraping) without permission.</li>
                <li>Disrupt or interfere with the security or performance of the Service or the underlying Open Library API.</li>
            </ul>

            <h2>5. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available" without any warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or completely secure. Your use of the Service is at your own risk.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall B.M Lib, its developers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Service or the data provided therein.
            </p>

            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. We will notify users by updating the "Last updated" date at the top of this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>

            <h2>8. Contact Us</h2>
            <p>
                If you have any questions about these Terms, please contact us at support@bmlib-example.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;