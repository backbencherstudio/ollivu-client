'use client';

import React from 'react';

export default function TermsAndConditions() {
  return (
    <main className="bg-white text-[#1D1F2C] py-16 px-4 md:px-8 max-w-[1320px] mx-auto">
      <div className="py-20 bg-[#F9F9F9]">
        <h1 className="text-center text-3xl font-semibold mb-2">Terms and Conditions</h1>
        <div className="text-center text-xs text-gray-500 mb-6">
          <span className="mr-4">Effective Date: Feb 4, 2024</span>
          <span>Last Date: Jan 12, 2025</span>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex justify-center space-x-4 text-sm">
          <span className="font-semibold border-b-2 border-black pb-2">Terms and Conditions</span>
          <span className="text-gray-400 pb-2">Privacy Policy</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-6">
        Welcome to Ollivu! These Terms and Conditions govern your use of our platform, which facilitates the exchange
        of services between users. By accessing or using our website, you agree to comply with and be bound by these
        terms. If you do not agree, please do not use the platform.
      </p>

      {terms.map((section, idx) => (
        <div key={idx} className=" border border-[#E8E8E9] rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2">{section.title}</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {section.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}

const terms = [
  {
    title: '1. Acceptance of Terms',
    points: [
      'By using Service Exchange website, you confirm that you are at least 18 years old or have the consent of a legal guardian. You agree to abide by these Terms and Conditions, our Privacy Policy, and any additional guidelines posted on the website.',
    ],
  },
  {
    title: '2. Description of Service',
    points: [
      'Offer services they can provide.',
      'Request services they need.',
      'Connect with other users to exchange services.',
    ],
  },
  {
    title: '3. User Responsibilities',
    points: [
      'Accurate Information: You agree to provide accurate and truthful information when creating an account, offering services, or making requests.',
      'Respectful Conduct: You will treat all users with respect and refrain from any abusive, discriminatory, or harmful behavior.',
      'Service Quality: If you are offering a service, you are responsible for delivering it as described and agreed upon with the recipient.',
      'No Illegal Activities: You may not use the platform for any illegal or unauthorized purposes.',
    ],
  },
  {
    title: '4. Service Exchanges',
    points: [
      'Agreements: All service exchanges are agreements between users. This is not a party to these agreements and is not responsible for disputes, damages, or issues arising from them.',
      'No Guarantees: The platform does not guarantee the availability, quality, or suitability of any services offered or requested.',
      'Feedback: Users are encouraged to leave honest feedback about their experiences to help maintain a trustworthy community.',
    ],
  },
  {
    title: '5. Prohibited Activities',
    points: [
      'Use the platform for commercial purposes without prior authorization.',
      'Post false, misleading, or harmful content.',
      'Harass, scam, or exploit other users.',
      'Violate any applicable laws or regulations.',
    ],
  },
  {
    title: '6. Intellectual Property',
    points: [
      'All content on the platform, including logos, text, and design, is the property of the website or its licensors. You may not use, copy, or distribute any content without prior written permission.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    points: [
      'Any damages or losses resulting from service exchanges.',
      'User conduct or interactions.',
      'Technical issues, interruptions, or errors on the platform.',
    ],
  },
  {
    title: '8. Termination',
    points: [
      'We reserve the right to suspend or terminate your account if you violate these Terms and Conditions or engage in harmful or inappropriate behavior.',
    ],
  },
  {
    title: '9. Changes to Terms',
    points: [
      'We may update these Terms and Conditions from time to time. Continued use of the platform after changes constitutes your acceptance of the revised terms.',
    ],
  },
  {
    title: '10. Contact Information',
    points: [
      'If you have any questions or concerns about these Terms and Conditions, please contact us at:',
      'Email: hello@serviceinfo.com',
      'Phone: 12456-999-4735',
    ],
  },
];