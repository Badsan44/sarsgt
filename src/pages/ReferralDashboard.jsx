// src/pages/ReferralDashboard.jsx
import React from 'react';
import Layout from '../Layout';
import Header from '../components/header/v1/Header';
import Footer from '../sections/footer/Footer';
import ReferralDashboardSection from '../sections/referralDashboard/ReferralDashboard';

const ReferralDashboard = () => {
  return (
    <Layout pageTitle="Referral Dashboard - Make America Great Again">
      <Header variant="v5" />
      <ReferralDashboardSection />
      <Footer variant="v1" />
    </Layout>
  );
};

export default ReferralDashboard;