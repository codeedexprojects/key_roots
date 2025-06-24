import React from "react";

const VendorPrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="text-sm text-gray-600 text-center mb-8">Effective Date: 15/06/25</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          At KeyRoute, we respect the privacy of all our partners, including the bus operators and
          vendors using our Vendor App. This Privacy Policy explains how we collect, use, and safeguard
          the personal and business information you share with us through the Vendor App. By registering
          and using the KeyRoute Vendor App, you agree to the practices outlined in this policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
        <p>
          We collect both personal and business-related information to enable smooth onboarding and
          service delivery. This includes your name, mobile number, email ID, and address. For business
          purposes, we may collect vehicle details (number, type, seating capacity, permits, RC, license,
          insurance certificate, travel/bus images), insurance certificate for passengers (if any), driver
          details, bank account or payment-related information, location data, and transaction records. We
          also gather technical data such as your device type, IP address, and in-app activity.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
        <p>
          The data collected through the Vendor App is used to enable and manage your services on
          KeyRoute. This includes listing your buses for booking, showing availability to users, confirming
          trips, tracking performance, managing payments and commission settlements, and handling
          customer communications. We may also use this information to improve the app experience,
          send service updates, or offer relevant business tools and insights.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Sharing of Information</h2>
        <p>
          We do not sell your information to any third party. However, relevant data (such as bus type,
          availability, location, and operator name) will be shared with users on the KeyRoute User App to
          facilitate bookings. We may also share required information with payment partners to process
          settlements, or with legal/government authorities if demanded under applicable law. Third-party
          service providers supporting app hosting, analytics, or SMS/email delivery may also access limited
          data under strict confidentiality agreements.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
        <p>
          We take data protection seriously. Your information is secured through encrypted transmission
          (HTTPS), secure servers, password protection, and access control systems. While we implement
          robust security measures, we cannot guarantee complete protection due to the nature of digital
          systems.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Your Rights and Choices</h2>
        <p>
          You can update your personal or vehicle details through the app or by contacting our support
          team. If you wish to stop using the app or delete your account, you may contact us at
          keyroutebus@gmail.com and we will process your request as per legal requirements. Please note
          that certain transaction or compliance data may be retained for legal or taxation purposes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Business Integrity</h2>
        <p>
          We expect all vendors to provide accurate and updated information. Misuse of the platform,
          uploading false data, or engaging in unauthorized activities may result in suspension or removal
          from the KeyRoute platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Data Retention</h2>
        <p>
          We retain your information as long as you remain an active vendor on our platform. After you
          discontinue or request deletion, we may still retain certain data to comply with applicable laws,
          resolve disputes, or maintain financial records.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. In case of significant changes, we will
          notify you via the app or email. Continued use of the Vendor App after such updates will
          indicate your acceptance of the revised policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or how your data is handled,
          please contact:
        </p>
        <p className="mt-2">
          <strong>KeyRoute – Vendor Support</strong><br />
          Email: keyroutebus@gmail.com<br />
          Phone: 9048679041
        </p>
      </section>
    </div>
  );
};

export default VendorPrivacyPolicy;