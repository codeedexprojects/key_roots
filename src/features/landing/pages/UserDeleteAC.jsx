import React from "react";

const UserDeletePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Your Right to Delete</h1>

      <p className="mb-4">
        Users can delete their KeyRoute account at any time. We respect your
        privacy and provide an easy deletion process.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">How to Delete</h2>
      <p className="mb-4">
        You can request deletion via the app (if available) or by emailing{' '}
        <a href="mailto:keyroutebus@gmail.com" className="text-blue-600 underline">
          keyroutebus@gmail.com
        </a>{' '}
        with your registered mobile number and name.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">What Happens After</h2>
      <p className="mb-4">
        Once verified, your account will be deactivated and your data deleted
        within 7 working days, unless legally required to retain it.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Temporary Data Retention</h2>
      <p className="mb-4">
        Some data like payment or booking records may be kept for up to 180
        days for legal or audit purposes, then securely erased.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Permanent Deletion</h2>
      <p className="mb-4">
        Once deleted, your account and data can’t be recovered. All bookings,
        preferences, and history will be permanently removed.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Need Help?</h2>
      <p className="mb-4">
        For assistance, contact us at{' '}
        <a href="mailto:keyroutebus@gmail.com" className="text-blue-600 underline">
          keyroutebus@gmail.com
        </a>{' '}
        or call us at{' '}
        <a href="tel:9048679041" className="text-blue-600 underline">
          9048679041
        </a>
        .
      </p>
    </div>
  );
};

export default UserDeletePolicy;
