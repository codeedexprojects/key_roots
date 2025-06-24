import React from "react";

const UserTerms = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-justify text-sm leading-relaxed text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-center">Terms And Conditions</h1>
      <p>
        KEYROUTE is a technology platform that connects travellers with bus operators, facilitating the booking process.
        However, it does not operate buses, provide transportation services, or act as an agent for any bus operator.
        All information regarding bus services, including available amenities, fares, schedules, packages, bus types,
        and seat availability, is provided directly by the respective bus operators. KEYROUTE has no control over these
        details and is not responsible for any discrepancies between the information displayed and the actual services provided.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">LIMITATION OF LIABILITY</h2>
      <ul className="list-decimal list-inside space-y-2">
        <li>Bus Schedule & Timings: KEYROUTE does not guarantee timely departures or arrivals as it depends entirely on bus operators.</li>
        <li>Bus Staff & Conduct: The behavior of the bus operator’s employees, co-passengers etc are beyond KEYROUTE’s control.</li>
        <li>Bus Condition & Amenities: The condition of the bus, seating, cleanliness, or the presence of promised amenities is the operator’s responsibility. Any issues or discrepancies must be resolved with the operator directly.</li>
        <li>Lost or Damaged Baggage: KEYROUTE is not liable for the loss, theft, or damage of baggage. Users should confirm baggage policies with the operator before traveling.</li>
        <li>Additional Transport Arrangements: If a bus operator uses a separate pick-up vehicle to transport users from the designated boarding point to the departure location, KEYROUTE is not accountable for any inconvenience or delays.</li>
        <li>Service Disruptions: If a bus operator changes the bus type, KEYROUTE holds no liability for disruptions.</li>
        <li>Fare Changes: Bus fares are determined by the operator, and KEYROUTE does not regulate or control pricing. Any changes in fares are solely at the operator’s discretion.</li>
        <li>Legal & Permit Compliance: The operator is responsible for ensuring they have all required licenses and permits for travel. If a trip is canceled due to the operator’s failure to meet legal requirements, KEYROUTE will not be liable for any losses incurred.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">USER RESPONSIBILITIES</h2>
      <ul className="list-decimal list-inside space-y-2">
        <li>Confirm Boarding Details: It is advised to contact the bus operator before departure to confirm the boarding location and other relevant details.</li>
        <li>Plan the Itinerary in Advance: Users must ensure that all planned destinations are included in their booking. Adding extra locations during the trip is subject to operator availability and additional charges.</li>
        <li>Adhere to the KM Limit: Each trip has a predefined kilometer limit. If the user exceeds this limit, they will be charged extra for additional distance travelled.</li>
        <li>Pay Additional Fees: Charges such as airport entry fees, tolls, and parking costs are not included in the booking fare and must be paid separately to the operator as per actuals.</li>
        <li>Night Travel Charges: For travel between 9:45 PM and 6:00 AM, an additional driver allowance is applicable, which is included in the total fare.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">PAYMENT & BOOKING</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Full Payment: The total booking amount, including the base fare, applicable taxes (including GST as per local laws), and KEYROUTE’s service fee, is paid upfront at the time of booking.</li>
        <li>Advance Payment: Users must pay a minimum, non-refundable advance amount while booking. The balance can be paid through the application before the trip starts or directly to the driver during the journey.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">CANCELLATION & REFUND POLICY</h2>
      <ul className="list-decimal list-inside space-y-2">
        <li>Cancellation Process: Users can cancel their booking via the KEYROUTE website, mobile app, or customer support.</li>
        <li>Cancellation Charges: Fees will be deducted based on the policy mentioned in the trip details at the time of booking.</li>
        <li>
          Refund Process:
          <ul className="list-disc list-inside ml-6">
            <li>Refunds for cancelled tickets are automatically processed to the original payment method (bank account, credit/debit card, or wallet).</li>
            <li>The refund amount should reflect in the user’s account within 1-7 working days.</li>
            <li>If a refund is not received within 7 days, users must contact KEYROUTE support with their booking details and a statement of transactions for resolution.</li>
          </ul>
        </li>
        <li>No Refund on Advance Payment: The advance amount paid at the time of booking is non-refundable.</li>
        <li>Operator-Cancelled Trips: If a trip is cancelled by the bus operator, KEYROUTE will provide alternative service. If an alternative is unavailable, KEYROUTE’s liability is limited to refunding the price.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">RESCHEDULING POLICY</h2>
      <ul className="list-decimal list-inside space-y-2">
        <li>Users can reschedule their trip (i.e., change the date of travel) through the website, app, or customer support.</li>
        <li>Rescheduling is available only with select operators. Users should check trip details to confirm availability.</li>
        <li>Each booking can only be rescheduled once.</li>
        <li>Once rescheduled, the booking becomes final and cannot be canceled.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">MISCELLANEOUS</h2>
      <ul className="list-decimal list-inside space-y-2">
        <li>Fare Variations: Prices may fluctuate during peak seasons, holidays, and weekends.</li>
        <li>User Agreement & Privacy Policy: All bookings are subject to KEYROUTE’s terms and conditions, available on its website.</li>
        <li>Abuse of Offers: KEYROUTE reserves the right to deny claims or cancel offers if misuse or abuse is detected.</li>
        <li>Liability Limitation: The maximum liability of KEYROUTE for any claim will not exceed the transaction amount paid by the user.</li>
        <li>Policy Changes: KEYROUTE may modify, amend, or withdraw terms and conditions at any time without prior notice.</li>
      </ul>
    </div>
  );
};

export default UserTerms;
