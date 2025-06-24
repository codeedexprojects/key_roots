import React from "react";

const UserPrivacyPolicy = () => {
  return (
    <div className=" text-gray-800 p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Privacy Policy 
      </h1>

      <p className="text-sm text-center text-gray-500 mb-4">
        Effective Date: <strong>15/06/2025</strong>
      </p>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">1. Introduction</h2>
        <p>
          At KeyRoute, your privacy is important to us. This Privacy Policy describes how we collect,
          use, share, and protect your personal information when you use our User App to book group
          buses, one-day trips, student packages, or pilgrimage tours. By accessing or using our app,
          you agree to this policy and the terms described herein.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">2. Information We Collect</h2>
        <p>
          When you use KeyRoute, we collect various types of information to facilitate your booking
          and improve your experience. This includes:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Personal details: name, phone number, email, location, and identity proof (if needed)</li>
          <li>Booking data: destination, travel dates, number of passengers, and vehicle type</li>
          <li>Technical data: device ID, IP address, location (if permitted), OS, and app usage activity</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">3. How We Use Your Information</h2>
        <p>
          We use your information to operate and improve the KeyRoute platform, including:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Confirming bookings and managing travel arrangements</li>
          <li>Processing secure payments</li>
          <li>Providing updates and customer support</li>
          <li>Personalizing your experience and offering promotions</li>
          <li>Analyzing trends to improve service</li>
        </ul>
        <p className="mt-2">
          All usage is aligned with applicable laws and the purposes described above.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">4. Sharing of Information</h2>
        <p>
          We do not sell your personal data. However, we may share limited information with:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Bus operators for booking fulfillment</li>
          <li>Payment partners to process transactions</li>
          <li>App infrastructure providers for performance and communication support</li>
        </ul>
        <p className="mt-2">
          All partners are bound by confidentiality and legal obligations. We may also share your
          data with government authorities as required by law.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">5. Data Security</h2>
        <p>
          We protect your data using modern security practices such as:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>HTTPS encryption</li>
          <li>Secure cloud storage</li>
          <li>Access controls and monitoring</li>
        </ul>
        <p className="mt-2">
          While we implement strong protections, no electronic storage is fully secure. Please
          safeguard your credentials and report any suspicious activity.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">6. Your Choices</h2>
        <p>
          You have control over your data on KeyRoute. You may:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Update your profile information</li>
          <li>Disable location access via device settings</li>
          <li>Unsubscribe from promotional messages</li>
          <li>Request account or data deletion via email</li>
        </ul>
        <p className="mt-2">
          Contact us at <a href="mailto:keyroutebus@gmail.com" className="text-blue-600 underline">keyroutebus@gmail.com</a> for any such requests.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">7. Data Retention</h2>
        <p>
          We retain your information only as long as necessary to fulfill bookings, comply with laws,
          and resolve disputes. After that, data is securely deleted or anonymized unless longer
          retention is required by regulations.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">8. Third-Party Links</h2>
        <p>
          Our app may contain links to third-party websites or services. We are not responsible for
          their privacy practices and recommend reviewing their policies before sharing information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">9. Changes to This Policy</h2>
        <p>
          We may occasionally update this Privacy Policy. If significant changes occur, users will be
          notified via the app or email. Continued use of KeyRoute after updates indicates your
          agreement to the new terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">10. Contact Us</h2>
        <p className="mb-1">If you have questions or requests, reach out to us:</p>
        <ul className="list-none pl-0 space-y-1">
          <li><strong>KeyRoute</strong></li>
          <li>Email: <a href="mailto:keyroutebus@gmail.com" className="text-blue-600 underline">keyroutebus@gmail.com</a></li>
          <li>Phone: <a href="tel:9048679041" className="text-blue-600 underline">9048679041</a></li>
        </ul>
      </section>
    </div>
  );
};

export default UserPrivacyPolicy;
