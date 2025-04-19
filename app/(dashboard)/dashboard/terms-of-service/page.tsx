'use client';

import React, { useState } from 'react';

export default function AdminTermsPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="bg-white text-[#1D1F2C] min-h-screen px-4 md:px-12 py-10">
      {/* Tabs Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b pb-4 mb-6">
        <div className="flex items-center space-x-4">
          <button
            className={`font-semibold border-b-2 ${
              activeTab === 'terms'
                ? 'text-black border-black'
                : 'text-gray-400 hover:text-black border-transparent'
            }`}
            onClick={() => setActiveTab('terms')}
          >
            Terms and Conditions
          </button>
          <button
            className={`font-semibold border-b-2 ${
              activeTab === 'privacy'
                ? 'text-black border-black'
                : 'text-gray-400 hover:text-black border-transparent'
            }`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {activeTab === 'terms' ? <TermsContent /> : <PrivacyPolicyContent />}
    </div>
  );
}

function TermsContent() {
  return (
    <>
      <div className="bg-[#F9FAFB] p-6 rounded-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-semibold text-lg">Terms and Conditions</h1>
          <p className="text-sm text-[#4A4C56] mt-2 max-w-2xl py-5">
            Welcome to Ollivu! These Terms and Conditions govern your use of our platform, which facilitates the exchange of services between users. By accessing or using our website, you agree to comply with and be bound by these terms. If you do not agree, please do not use the platform.
          </p>
          <button className="bg-[#20B894] text-white text-sm px-4 py-2 rounded-full">Edit ↗</button>
        </div>
        <div className="text-xs text-right text-[#4A4C56]">
          <p>Effective Date: Feb 6, 2024</p>
          <p>Last Date: Jan 12, 2025</p>
        </div>

      </div>

      <div className="space-y-6">
        <Section title="1. Acceptance of Terms">
          <p className="text-sm text-[#4A4C56]">
            By accessing and using the Admin Dashboard (hereinafter referred to as the “Platform”), you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, you must not use the Platform.
          </p>
        </Section>

        <Section title="2. Admin Responsibilities">
          <ul className="text-sm text-[#4A4C56] space-y-2 list-disc pl-5">
            <li><b>Authorized Access:</b> Only authorized personnel are permitted to access the Admin Dashboard.</li>
            <li><b>Proper Use:</b>
              <ul className="list-decimal pl-5">
                <li>Any misuse, unauthorized access, or malicious activity is strictly prohibited.</li>
                <li>The Platform must be used solely for managing and monitoring the services, users, and activities related to the platform.</li>
              </ul>
            </li>
            <li><b>Data Privacy:</b>
              <ul className="list-decimal pl-5">
                <li>Only authorized personnel are permitted to access the Admin Dashboard.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
              </ul>
            </li>
            <li><b>Reporting Issues:</b>
              <ul className="list-decimal pl-5">
                <li>You must comply with all applicable data protection laws and regulations.</li>
                <li>Do not share, distribute, or misuse any user data or confidential information obtained through the Platform.</li>
              </ul>
            </li>
          </ul>
        </Section>

        <Section title="3. Prohibited Activities">
          <ul className="text-sm text-[#4A4C56] list-disc pl-5 space-y-1">
            <li><b>Unauthorized Actions:</b> Do not attempt to modify, reverse engineer, or tamper with the Platform’s code or functionality.</li>
            <li><b>Data Manipulation:</b> Do not alter, delete, or manipulate any data without proper authorization.</li>
            <li><b>Spam or Abuse:</b> Do not use the Platform to send spam, phishing emails, or engage in any form of abuse.</li>
          </ul>
        </Section>

        <Section title="4. Intellectual Property">
          <ul className="text-sm text-[#4A4C56] list-disc pl-5 space-y-1">
            <li><b>Ownership:</b>
              <ul className="list-decimal pl-5">
                <li>The Platform, including its design, code, and content, is the intellectual property of Ollivu!</li>
                <li>You are granted a limited, non-exclusive, and non-transferable license to use the Platform for its intended purpose.</li>
              </ul>
            </li>
            <li><b>Restrictions:</b> You may not copy, reproduce, distribute, or create derivative works based on the Platform without prior written consent.</li>
          </ul>
        </Section>

        <Section title="5. Limitation of Liability">
          <ul className="text-sm text-[#4A4C56] list-disc pl-5 space-y-1">
            <li><b>No Warranty:</b>
              <ul className="list-decimal pl-5">
                <li>The Platform is provided “as is” without any warranties, express or implied.</li>
                <li>Ollivu does not guarantee that the Platform will be error-free, secure, or uninterrupted.</li>
              </ul>
            </li>
            <li><b>Indemnification:</b> You agree to indemnify and hold harmless Ollivu from any claims, damages, or losses arising from your misuse of the Platform.</li>
          </ul>
        </Section>

        <Section title="6. Termination">
          <p className="text-sm text-[#4A4C56]">
            <b>Suspension or Termination:</b> Ollivu reserves the right to suspend or terminate your access to the Platform at any time, with or without notice, for violation of these Terms and Conditions.
          </p>
        </Section>

        <Section title="7. Amendments">
          <p className="text-sm text-[#4A4C56]">
            <b>Changes to Terms:</b> You will be notified of any changes, and continued use of the Platform constitutes acceptance of the updated terms.
          </p>
        </Section>

        <Section title="8. Governing Law">
          <ul className="text-sm text-[#4A4C56] list-decimal pl-5 space-y-1">
            <li>These Terms and Conditions are governed by the laws of [Your Country/State].</li>
            <li>Any disputes arising from the use of the Platform shall be resolved in the courts of [Your Country/State].</li>
          </ul>
        </Section>

        <Section title="9. Contact Information">
          <p className="text-sm text-[#4A4C56]">
            Email: hello@serviceinfo.com<br />
            Phone: 12456-999-4735
          </p>
        </Section>
      </div>
    </>
  );
}

function PrivacyPolicyContent() {
  return (
    <>
      <div className="bg-[#F9FAFB] p-6 rounded-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-semibold text-lg">Privacy Policy</h1>
          <p className="text-sm text-[#4A4C56] mt-2 max-w-2xl py-5">
            Welcome to Ollivu, a platform where users exchange services without monetary transactions. This Privacy Policy explains how we collect, use, and protect your personal data. By using Ollivu, you agree to these terms.
          </p>
          <button className="bg-[#20B894] text-white text-sm px-4 py-2 rounded-full">Edit ↗</button>
        </div>

        <div className="text-xs text-right text-[#4A4C56]">
          <p>Effective Date: Feb 6, 2024</p>
          <p>Last Date: Jan 12, 2025</p>
        </div>
 
      </div>

      <div className="space-y-6">
        <Section title="1. Data We Collect">
          <ul className="text-sm text-[#4A4C56] list-disc pl-5 space-y-1">
            <li><b>Account Information:</b> Name, email, username, and profile details.</li>
            <li><b>Service Listings:</b> Descriptions of services offered/requested.</li>
            <li><b>Communication Data:</b> Messages exchanged between users.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Data">
          <ul className="text-sm text-[#4A4C56] list-disc pl-5 space-y-1">
            <li>Enable service exchanges between users.</li>
            <li>Improve platform functionality and user experience.</li>
            <li>Prevent fraud or misuse of the platform.</li>
            <li>Send service-related notifications (no marketing emails).</li>
          </ul>
        </Section>

        <Section title="3. Prohibited Activities">
          <ul className="text-sm text-[#4A4C56] list-disc pl-5 space-y-1">
            <li><b>Unauthorized Actions:</b> Do not attempt to modify, reverse engineer, or tamper with the Platform’s code or functionality.</li>
            <li><b>Data Manipulation:</b> Do not alter, delete, or manipulate any data without proper authorization.</li>
            <li><b>Spam or Abuse:</b> Do not use the Platform to send spam, phishing emails, or engage in any form of abuse.</li>
          </ul>
        </Section>

        <Section title="4. Intellectual Property">
          <ul className="text-sm text-[#4A4C56] list-disc pl-5 space-y-1">
            <li><b>Ownership:</b> The Platform, including its design, code, and content, is the intellectual property of Ollivu.</li>
            <li><b>Restrictions:</b> You may not copy, reproduce, distribute, or create derivative works without prior consent.</li>
          </ul>
        </Section>

        <Section title="5. Limitation of Liability">
          <ul className="text-sm text-[#4A4C56] list-disc pl-5 space-y-1">
            <li><b>No Warranty:</b> The Platform is provided “as is” without warranties, express or implied.</li>
            <li><b>Indemnification:</b> You agree to indemnify and hold Ollivu harmless for misuse of the platform.</li>
          </ul>
        </Section>

        <Section title="6. Termination">
          <p className="text-sm text-[#4A4C56]">
            Ollivu reserves the right to suspend or terminate your access for violation of these terms.
          </p>
        </Section>

        <Section title="7. Amendments">
          <p className="text-sm text-[#4A4C56]">
            You will be notified of any changes, and continued use of the Platform constitutes acceptance.
          </p>
        </Section>

        <Section title="8. Governing Law">
          <ul className="text-sm text-[#4A4C56] list-decimal pl-5 space-y-1">
            <li>These Terms are governed by the laws of [Your Country/State].</li>
            <li>Disputes shall be resolved in the courts of [Your Country/State].</li>
          </ul>
        </Section>

        <Section title="9. Contact Information">
          <p className="text-sm text-[#4A4C56]">
            Email: hello@serviceinfo.com<br />
            Phone: 12456-999-4735
          </p>
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-xl p-4">
      <h2 className="font-medium text-[18px] mb-2">{title}</h2>
      {children}
    </div> 
)}
