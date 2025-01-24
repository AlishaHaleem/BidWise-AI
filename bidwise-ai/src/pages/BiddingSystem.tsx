import React, { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../components/ui/card';
import {
  Badge
} from '../components/ui/badge';
import {
  Button
} from '../components/ui/button';
import {
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Plus,
  School,
  Signal,
  Activity,
  Clock,
  Users,
  FileCheck
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
  status: string;
  schools: number;
}

interface Bid {
  id: number;
  provider: string;
  cost: string;
  coverage: string;
  aiScore: number;
}

interface Milestone {
  id: number;
  title: string;
  status: string;
  verificationMethod: string;
  date: string;
  verifier: string;
}

interface ProjectProgress {
  project: string;
  startDate: string;
  expectedCompletion: string;
  progress: number;
  milestones: Milestone[];
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <div className="flex items-center mt-2 space-x-2">
            <School className="w-4 h-4" />
            <span className="text-sm">{project.schools} schools</span>
          </div>
        </div>
        <Badge variant={
          project.status === 'Open for Bids' ? 'default' :
          project.status === 'Under Review' ? 'warning' :
          'success'
        }>
          {project.status}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

const BidCard: React.FC<{ bid: Bid }> = ({ bid }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{bid.provider}</h3>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <Signal className="w-4 h-4 mr-1" />
              <span className="text-sm">Coverage: {bid.coverage}</span>
            </div>
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              <span className="text-sm">AI Score: {bid.aiScore}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">{bid.cost}</div>
          <Button className="mt-2" size="sm">Select Bid</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const MilestoneCard: React.FC<{ milestone: Milestone }> = ({ milestone }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">{milestone.title}</h3>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{milestone.date}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">{milestone.verifier}</span>
            </div>
          </div>
        </div>
        <Badge variant={
          milestone.status === 'Completed' ? 'success' :
          milestone.status === 'In Progress' ? 'warning' :
          'default'
        }>
          {milestone.status}
        </Badge>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center text-sm">
          <FileCheck className="w-4 h-4 mr-2" />
          <span>Verification: {milestone.verificationMethod}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const BiddingSystem = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const projects: Project[] = [
    { id: 1, name: 'Rural Schools Network - Region A', status: 'Open for Bids', schools: 15 },
    { id: 2, name: 'Urban Connectivity Project B', status: 'Under Review', schools: 8 },
    { id: 3, name: 'Remote Learning Initiative C', status: 'In Progress', schools: 12 }
  ];

  const bids: Bid[] = [
    { id: 1, provider: 'TechNet Solutions', cost: '$125,000', coverage: '98%', aiScore: 85 },
    { id: 2, provider: 'EduConnect', cost: '$145,000', coverage: '100%', aiScore: 92 },
    { id: 3, provider: 'GlobalNet', cost: '$115,000', coverage: '95%', aiScore: 78 }
  ];

  const trafficData = [
    { time: '00:00', bandwidth: 20 },
    { time: '04:00', bandwidth: 15 },
    { time: '08:00', bandwidth: 85 },
    { time: '12:00', bandwidth: 90 },
    { time: '16:00', bandwidth: 75 },
    { time: '20:00', bandwidth: 45 }
  ];

  const projectProgress: ProjectProgress = {
    project: 'Remote Learning Initiative C',
    startDate: '2025-01-01',
    expectedCompletion: '2025-06-30',
    progress: 65,
    milestones: [
      {
        id: 1,
        title: 'Initial Assessment',
        status: 'Completed',
        verificationMethod: 'Site Survey Documentation',
        date: '2025-01-15',
        verifier: 'GIGA Technical Team'
      },
      {
        id: 2,
        title: 'Equipment Procurement',
        status: 'Completed',
        verificationMethod: 'Invoice and Inventory Check',
        date: '2025-02-28',
        verifier: 'Procurement Committee'
      },
      {
        id: 3,
        title: 'Infrastructure Setup',
        status: 'In Progress',
        verificationMethod: 'On-site Inspection',
        date: '2025-03-15',
        verifier: 'Engineering Team'
      },
      {
        id: 4,
        title: 'Network Configuration',
        status: 'Pending',
        verificationMethod: 'Technical Compliance Check',
        date: '2025-04-30',
        verifier: 'Network Engineers'
      },
      {
        id: 5,
        title: 'Final Testing',
        status: 'Pending',
        verificationMethod: 'Performance Metrics Validation',
        date: '2025-05-30',
        verifier: 'Quality Assurance Team'
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">GIGA School Connectivity</h1>
        <p className="text-gray-600">Bidding and Monitoring System</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex justify-center space-x-4 mb-6 border-b border-gray-300">
          <TabsTrigger
            value="projects"
            className="py-3 px-5 text-sm font-semibold text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="bids"
            className="py-3 px-5 text-sm font-semibold text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t"
          >
            Active Bids
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="py-3 px-5 text-sm font-semibold text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t"
          >
            Progress Tracking
          </TabsTrigger>
          <TabsTrigger
            value="monitoring"
            className="py-3 px-5 text-sm font-semibold text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t"
          >
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Current Projects</h2>
            <Button variant="default" size="md" className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </TabsContent>

        <TabsContent value="bids">
          <Card>
            <CardHeader>
              <CardTitle>Bids for Rural Schools Network - Region A</CardTitle>
            </CardHeader>
            <CardContent>
              {bids.map(bid => (
                <BidCard key={bid.id} bid={bid} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div></div>
                  <div className="text-right"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${projectProgress.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Verification Milestones</h4>
                {projectProgress.milestones.map(milestone => (
                  <MilestoneCard key={milestone.id} milestone={milestone} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Network Traffic Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bandwidth"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <Card className="p-4"></Card>
                <Card className="p-4"></Card>
                <Card className="p-4"></Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BiddingSystem;