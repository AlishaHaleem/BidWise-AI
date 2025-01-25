import React from 'react';
import { 
  Shield, 
  DollarSign, 
  Server, 
  CheckCircle 
} from 'lucide-react';

interface Bid {
  companyName: string;
  country: string;
  registrationYear: number;
  totalValue: number;
  schoolsCovered: number;
  primaryTechnology: string;
  status: string;
  aiScore: number;
}

const BidCompactCard: React.FC<{ bid: Bid }> = ({ bid }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
        AI Score: {bid.aiScore}/10
      </div>
      
      <div className="flex items-center mb-4">
        <img 
          src="/api/placeholder/80/80" 
          alt="Company Logo" 
          className="w-16 h-16 rounded-lg mr-4 object-cover"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {bid.companyName}
          </h2>
          <p className="text-sm text-gray-500">
            {bid.country} | Registered: {bid.registrationYear}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center">
          <DollarSign className="w-5 h-5 text-green-600 mr-2" />
          <div>
            <div className="text-sm text-gray-600">Total Value</div>
            <div className="font-bold">${bid.totalValue.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Server className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <div className="text-sm text-gray-600">Schools Covered</div>
            <div className="font-bold">{bid.schoolsCovered}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t pt-3">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-yellow-600 mr-2" />
          <span className="text-sm text-gray-600">
            {bid.primaryTechnology}
          </span>
        </div>
        <div className="flex items-center text-green-600">
          <CheckCircle className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">
            {bid.status}
          </span>
        </div>
      </div>
    </div>
  );
};

const BidList: React.FC = () => {
  const sampleBids: Bid[] = [
    {
      companyName: "Global Network Solutions",
      country: "Switzerland",
      registrationYear: 2024,
      totalValue: 255000,
      schoolsCovered: 250,
      primaryTechnology: "Fiber Optic",
      status: "Compliant",
      aiScore: 8.7
    },
    {
      companyName: "Regional Tech Innovations",
      country: "Kenya",
      registrationYear: 2023,
      totalValue: 235000,
      schoolsCovered: 200,
      primaryTechnology: "Satellite + LTE",
      status: "Under Review",
      aiScore: 7.5
    }
  ];

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {sampleBids.map((bid, index) => (
        <BidCompactCard key={index} bid={bid} />
      ))}
    </div>
  );
};

export default BidList;