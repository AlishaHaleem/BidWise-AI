import React, { useState, useMemo } from 'react';
import { 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Globe, 
  CheckCircle 
} from 'lucide-react';

const UNICEFProposalDashboard = () => {
  const [selectedView, setSelectedView] = useState('summary');

  const aiScoreCalculation = useMemo(() => {
    const technicalScore = [
      { name: 'Connectivity', score: 8.5 },
      { name: 'Security', score: 9.0 },
      { name: 'Scalability', score: 7.5 },
      { name: 'Cost-Effectiveness', score: 8.0 },
      { name: 'Implementation', score: 8.2 }
    ];

    const overallScore = technicalScore.reduce((acc, curr) => acc + curr.score, 0) / technicalScore.length;

    return {
      technicalScore,
      overallScore: overallScore.toFixed(1)
    };
  }, []);

  const aiInsightsSummary = useMemo(() => ({
    strengths: [
      "Robust fiber optic primary infrastructure",
      "Comprehensive backup connectivity options",
      "Advanced security protocols",
      "Flexible scaling model"
    ],
    improvements: [
      "Negotiate implementation cost reduction",
      "Explore local infrastructure partnerships",
      "Consider phased deployment strategy",
      "Review contention ratio optimization"
    ],
    risks: [
      "Potential over-engineering of network infrastructure",
      "High upfront implementation costs",
      "Complex multi-technology deployment"
    ]
  }), []);

  const renderAIScoreRadarChart = () => (
    <RadarChart 
      width={400} 
      height={300} 
      data={aiScoreCalculation.technicalScore}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="name" />
      <PolarRadiusAxis angle={30} domain={[0, 10]} />
      <Radar 
        dataKey="score" 
        stroke="#8884d8" 
        fill="#8884d8" 
        fillOpacity={0.6} 
      />
      <Tooltip />
    </RadarChart>
  );

  return (
    <div className="p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">UNICEF Giga Project Proposal Analysis</h1>
        <Badge variant="default" className="text-lg">
          AI Score: {aiScoreCalculation.overallScore}/10
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2" /> Project Scope
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Schools: 250</p>
            <p>Coverage Area: 5,000 km²</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2" /> Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Contract Value: $255,000</p>
            <p>Cost per School: $1,020</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2" /> Technical Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Primary Technology: Fiber Optic</p>
            <p>Backup: Satellite, LTE</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex space-x-4 mb-4">
          {['summary', 'ai-score', 'insights'].map(view => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`px-4 py-2 rounded ${
                selectedView === view 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {view.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {selectedView === 'summary' && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 text-green-500" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4">
                  {aiInsightsSummary.strengths.map(strength => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 text-yellow-500" /> Improvement Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4">
                  {aiInsightsSummary.improvements.map(improvement => (
                    <li key={improvement}>{improvement}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedView === 'ai-score' && (
          <div className="flex justify-center">
            {renderAIScoreRadarChart()}
          </div>
        )}

        {selectedView === 'insights' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2" /> Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Conduct comprehensive cost-benefit analysis for infrastructure scaling</li>
                <li>Develop detailed risk mitigation strategy for multi-technology deployment</li>
                <li>Establish clear performance monitoring and reporting mechanisms</li>
                <li>Explore collaborative funding or technology sharing opportunities</li>
                <li>Implement phased rollout to manage complexity and costs</li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UNICEFProposalDashboard;