import { useEffect } from "react";
import Header from "../components/header/v1/Header";
import Footer from "../sections/footer/Footer";
import GlobalStyles from "../assets/styles/GlobalStyles";
import "../assets/styles/LegalPages.css";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | BNBMAGA Token";
  }, []);

  return (
    <>
      <GlobalStyles />
      <Header />
      <div className="privacy-policy-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="privacy-policy-content">
                <h1 className="privacy-title">Privacy Policy</h1>
                <p className="last-updated">Last Updated: May 11, 2025</p>

                <div className="privacy-section">
                  <h2>1. Introduction</h2>
                  <p>
                    Welcome to BNBMAGA Token ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our platform, or interact with our services.
                  </p>
                  <p>
                    Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
                  </p>
                </div>

                <div className="privacy-section">
                  <h2>2. Information We Collect</h2>
                  <h3>2.1 Personal Information</h3>
                  <p>
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul>
                    <li>Register for an account</li>
                    <li>Participate in token sales or presales</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact our support team</li>
                    <li>Participate in surveys or promotions</li>
                  </ul>
                  <p>
                    This information may include your name, email address, wallet address, and other contact or identifying information.
                  </p>

                  <h3>2.2 Automatically Collected Information</h3>
                  <p>
                    When you visit our website or use our platform, we may automatically collect certain information about your device and usage patterns, including:
                  </p>
                  <ul>
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Device information</li>
                    <li>Usage data and browsing patterns</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div className="privacy-section">
                  <h2>3. How We Use Your Information</h2>
                  <p>
                    We may use the information we collect for various purposes, including:
                  </p>
                  <ul>
                    <li>Providing, maintaining, and improving our services</li>
                    <li>Processing transactions and managing your account</li>
                    <li>Sending administrative information, updates, and security alerts</li>
                    <li>Responding to your comments, questions, and requests</li>
                    <li>Sending marketing communications (with your consent)</li>
                    <li>Monitoring and analyzing trends, usage, and activities</li>
                    <li>Detecting, preventing, and addressing technical issues</li>
                    <li>Complying with legal obligations</li>
                  </ul>
                </div>

                <div className="privacy-section">
                  <h2>4. Sharing Your Information</h2>
                  <p>
                    We may share your information with:
                  </p>
                  <ul>
                    <li>Service providers who perform services on our behalf</li>
                    <li>Business partners with your consent</li>
                    <li>Legal authorities when required by law</li>
                    <li>In connection with a business transaction (e.g., merger or acquisition)</li>
                  </ul>
                  <p>
                    We do not sell your personal information to third parties.
                  </p>
                </div>

                <div className="privacy-section">
                  <h2>5. Security</h2>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </div>

                <div className="privacy-section">
                  <h2>6. Your Rights</h2>
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul>
                    <li>Access to your personal information</li>
                    <li>Correction of inaccurate or incomplete information</li>
                    <li>Deletion of your personal information</li>
                    <li>Restriction of processing</li>
                    <li>Data portability</li>
                    <li>Objection to processing</li>
                    <li>Withdrawal of consent</li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us using the information provided in the "Contact Us" section.
                  </p>
                </div>

                <div className="privacy-section">
                  <h2>7. Cookies and Tracking Technologies</h2>
                  <p>
                    We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                  </p>
                </div>

                <div className="privacy-section">
                  <h2>8. Children's Privacy</h2>
                  <p>
                    Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.
                  </p>
                </div>

                <div className="privacy-section">
                  <h2>9. Changes to This Privacy Policy</h2>
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </div>

                <div className="privacy-section">
                  <h2>10. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <p>
                    Email: privacy@bnbmaga.com<br />
                    Address: 123 Blockchain Street, Crypto City, CC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;