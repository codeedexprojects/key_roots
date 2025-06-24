import React from "react";

const RightToDelete = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Right to Delete</h1>

      <p className="mb-4">
        Vendors using the KeyRoute platform have the full right to request account deletion at any time. We respect your privacy and provide a transparent process to permanently remove your information from our system.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">How to Request Deletion</h2>
      <p className="mb-4">
        To initiate the deletion process, vendors must send an email to <a href="mailto:keyroutebus@gmail.com" className="text-blue-600 underline">keyroutebus@gmail.com</a>. The email should include your registered mobile number, business name, and optionally the reason for deletion. This helps us verify your identity and process the request securely.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Processing Timeline</h2>
      <p className="mb-4">
        Once your request is received and verified, your account will be deactivated immediately, and all related data will be permanently deleted within 7 working days. This ensures your business information is not accessible on the platform anymore.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Data Retention (If Required by Law)</h2>
      <p className="mb-4">
        In some cases, we may be required to retain certain data (such as transaction logs, payout records, and booking history) for up to 180 days to comply with legal, tax, or regulatory obligations. This data is stored securely and deleted automatically once the retention period ends.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Finality of Deletion</h2>
      <p className="mb-4">
        Please note that account deletion is permanent and irreversible. Once deleted, you will lose access to the KeyRoute Vendor App and all associated records, such as vehicle listings, past earnings, and business documents, which cannot be recovered.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Support & Contact</h2>
      <p>
        If you have questions or need help with the deletion process, our support team is here to assist you. You can contact us at <a href="mailto:keyroutebus@gmail.com" className="text-blue-600 underline">keyroutebus@gmail.com</a> or call us at <a href="tel:9048679041" className="text-blue-600 underline">9048679041</a>. We are committed to ensuring your data is handled safely and responsibly.
      </p>
    </div>
  );
};

export default RightToDelete;
