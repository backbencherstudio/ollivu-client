import { CheckCircle } from "lucide-react";

export default function SuccessMessage() {
  return (
    <div className="text-center py-10">
      <CheckCircle className="w-12 h-12 mx-auto text-[#20B894] mb-4" />
      <h2 className="text-xl font-semibold text-[#070707] mb-2">
        Exchange request is sent!
      </h2>
      <p className="text-gray-500 max-w-md mx-auto">
        Wait for the user to review your exchange request. After they
        have reviewed your request they will get connected to you
        through chat. All the best!
      </p>
    </div>
  );
}