import { useEffect } from "react";
import Header from "../components/header/v1/Header";
import Footer from "../sections/footer/Footer";
import GlobalStyles from "../assets/styles/GlobalStyles";
import "../assets/styles/LegalPages.css";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Service | BNBMAGA Token";
  }, []);

  return (
    <>
      <GlobalStyles />
      <Header />
      <div className="terms-service-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="terms-service-content">
                <h1 className="terms-title">Terms of Service</h1>
                <p className="last-updated">Last Updated: May 11, 2025</p>

                <div className="terms-section">
                  <h2>1. Acceptance of Terms</h2>
                  <p>
                    Welcome to BNBMAGA Token. These Terms of Service ("Terms") govern your access to and use of our website, platform, and services. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our services.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>2. Eligibility</h2>
                  <p>
                    You must be at least 18 years old to access or use our services. By accessing or using our services, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.
                  </p>
                  <p>
                    Our services are not available to residents of jurisdictions where cryptocurrency activities are prohibited or restricted. It is your responsibility to ensure that your use of our services complies with the laws and regulations of your jurisdiction.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>3. Account Registration</h2>
                  <p>
                    To access certain features of our services, you may need to create an account. When you create an account, you agree to:
                  </p>
                  <ul>
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Keep your account credentials secure</li>
                    <li>Not share your account with anyone else</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                  <p>
                    You are solely responsible for all activities that occur under your account.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>4. Token Sale and Purchases</h2>
                  <p>
                    By participating in our token sale or purchasing BNBMAGA tokens, you acknowledge and agree that:
                  </p>
                  <ul>
                    <li>You are purchasing tokens for their utility within our ecosystem, not as an investment</li>
                    <li>The value of tokens may fluctuate, and there is no guarantee of future value</li>
                    <li>Token purchases are final and non-refundable</li>
                    <li>You are responsible for any taxes associated with your token purchases</li>
                    <li>You will comply with all applicable laws and regulations</li>
                  </ul>
                </div>

                <div className="terms-section">
                  <h2>5. Prohibited Activities</h2>
                  <p>
                    When using our services, you agree not to:
                  </p>
                  <ul>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on the rights of others</li>
                    <li>Use our services for illegal or unauthorized purposes</li>
                    <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                    <li>Interfere with or disrupt our services</li>
                    <li>Engage in fraudulent or deceptive activities</li>
                    <li>Distribute malware or other harmful code</li>
                    <li>Collect or harvest user information without consent</li>
                    <li>Use our services in a manner that could damage, disable, or impair our platform</li>
                  </ul>
                </div>

                <div className="terms-section">
                  <h2>6. Intellectual Property</h2>
                  <p>
                    All content, features, and functionality of our services, including but not limited to text, graphics, logos, icons, images, audio clips, and software, are owned by BNBMAGA Token or its licensors and are protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website without our prior written consent.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>7. Disclaimer of Warranties</h2>
                  <p>
                    OUR SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                  <p>
                    WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT ANY DEFECTS WILL BE CORRECTED.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>8. Limitation of Liability</h2>
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL BNBMAGA TOKEN, ITS AFFILIATES, OR THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR YOUR USE OF OUR SERVICES.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>9. Indemnification</h2>
                  <p>
                    You agree to indemnify, defend, and hold harmless BNBMAGA Token, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses, including reasonable attorneys' fees, arising out of or in connection with your violation of these Terms or your use of our services.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>10. Modifications to Terms</h2>
                  <p>
                    We may modify these Terms at any time by posting the revised Terms on our website. Your continued use of our services after the effective date of the revised Terms constitutes your acceptance of the changes.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>11. Termination</h2>
                  <p>
                    We may terminate or suspend your access to our services at any time, without prior notice or liability, for any reason, including but not limited to your breach of these Terms.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>12. Governing Law</h2>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>13. Dispute Resolution</h2>
                  <p>
                    Any dispute arising out of or relating to these Terms or our services shall be resolved through binding arbitration in accordance with the rules of [Arbitration Association]. The arbitration shall be conducted in [City, Country].
                  </p>
                </div>

                <div className="terms-section">
                  <h2>14. Severability</h2>
                  <p>
                    If any provision of these Terms is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>15. Entire Agreement</h2>
                  <p>
                    These Terms, together with our Privacy Policy, constitute the entire agreement between you and BNBMAGA Token regarding your use of our services.
                  </p>
                </div>

                <div className="terms-section">
                  <h2>16. Contact Us</h2>
                  <p>
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <p>
                    Email: legal@bnbmaga.com<br />
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

export default TermsOfService;