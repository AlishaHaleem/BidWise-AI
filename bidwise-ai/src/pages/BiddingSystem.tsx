// src/pages/BiddingSystem.tsx

import React, { useState, useEffect } from 'react'; 
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
import axiosInstance from '../api/axiosConfig'; // Your configured Axios instance
import { isAxiosError } from 'axios'; // Import isAxiosError separately

// Define the Project interface without 'id'
interface Project {
  name: string;
  status: string;
  schools: number;
}

interface Bid {
  bid_id: string;
  provider: string;
  cost: string;
  coverage: string;
  aiScore: number;
  project_id: string;
  bidder_id: string;
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

// Component for displaying a single project
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow rounded-lg">
    <CardContent className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <div className="flex items-center mt-3 space-x-2 text-gray-600">
            <School className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{project.schools} schools</span>
          </div>
        </div>
        <Badge
          variant={
            project.status === 'Open for Bids'
              ? 'default'
              : project.status === 'Under Review'
              ? 'warning'
              : 'success'
          }
          className="text-sm"
        >
          {project.status}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// Component for displaying a single bid
const BidCard: React.FC<{ bid: Bid }> = ({ bid }) => (
  <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow rounded-lg">
    <CardContent className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{bid.provider}</h3>
          <div className="flex items-center mt-3 space-x-6 text-gray-600">
            <div className="flex items-center">
              <Signal className="w-4 h-4 mr-1 text-gray-500" />
              <span className="text-sm">Coverage: {bid.coverage}</span>
            </div>
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-1 text-gray-500" />
              <span className="text-sm">AI Score: {bid.aiScore}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-800">{bid.cost}</div>
          <Button
            className="mt-2"
            size="sm"
          >
            Select Bid
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Component for displaying a single milestone
const MilestoneCard: React.FC<{ milestone: Milestone }> = ({ milestone }) => (
  <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow rounded-lg">
    <CardContent className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
          <div className="flex items-center mt-3 space-x-6 text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-gray-500" />
              <span className="text-sm">{milestone.date}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-gray-500" />
              <span className="text-sm">{milestone.verifier}</span>
            </div>
          </div>
        </div>
        <Badge
          variant={
            milestone.status === 'Completed'
              ? 'success'
              : milestone.status === 'In Progress'
              ? 'warning'
              : 'default'
          }
          className="text-sm"
        >
          {milestone.status}
        </Badge>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center text-sm text-gray-700">
          <FileCheck className="w-4 h-4 mr-2 text-gray-500" />
          <span>Verification: {milestone.verificationMethod}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const BiddingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('projects');

  // State variables for fetched data
  const [projects, setProjects] = useState<Project[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [trafficData, setTrafficData] = useState<{ time: string; bandwidth: number }[]>([]);
  const [projectProgress, setProjectProgress] = useState<ProjectProgress | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Selected project name for fetching bids
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch Projects
        const projectsResponse = await axiosInstance.get<Project[]>('/projects');
        console.log('Projects Response:', projectsResponse.data);
        if (projectsResponse.data.length > 0) {
          const firstProject = projectsResponse.data[0];
          if (firstProject.name) {
            setSelectedProjectName(firstProject.name);
          } else {
            setError('First project does not have a valid name.');
          }
          setProjects(projectsResponse.data);
        } else {
          throw new Error('No projects found.');
        }

        // Fetch Traffic Data
        const trafficResponse = await axiosInstance.get<{ time: string; bandwidth: number }[]>('/traffic-data');
        console.log('Traffic Response:', trafficResponse.data);
        if (Array.isArray(trafficResponse.data)) {
          setTrafficData(trafficResponse.data);
        } else {
          throw new Error('Invalid traffic data format.');
        }

        // Fetch Project Progress (assuming the first project)
        if (projectsResponse.data.length > 0) {
          const projectName = projectsResponse.data[0].name;
          const progressResponse = await axiosInstance.get<ProjectProgress>('/project-progress', {
            params: { project: projectName }
          });
          if (progressResponse.data) {
            setProjectProgress(progressResponse.data);
          } else {
            throw new Error('Invalid project progress data format.');
          }
        }
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          if (err.response) {
            setError(err.response.data?.message || 'Failed to fetch data from the server.');
          } else if (err.request) {
            setError('No response received from the server.');
          } else {
            setError(err.message);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBids = async () => {
      if (!selectedProjectName) return;

      setLoading(true);
      setError('');
      try {
        const bidsResponse = await axiosInstance.get<Bid[]>('/bids', {
          params: { project_id: selectedProjectName } // Updated parameter
        });
        console.log('Bids Response:', bidsResponse.data);
        if (Array.isArray(bidsResponse.data)) {
          setBids(bidsResponse.data);
        } else {
          throw new Error('Invalid bids data format.');
        }
      } catch (err: unknown) {
        console.error(err);
        if (isAxiosError(err)) {
          if (err.response) {
            setError(err.response.data?.message || 'Failed to fetch bids.');
          } else if (err.request) {
            setError('No response received from the server.');
          } else {
            setError(err.message);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [selectedProjectName]);

  const handleNewProject = () => {
    // Implement your logic for adding a new project
    // For example, open a modal or navigate to a new page
    alert('New Project functionality is not implemented yet.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GIGA School Connectivity</h1>
          <p className="text-gray-600">Bidding and Monitoring System</p>
        </div>

        {loading && <p className="text-blue-600 font-medium">Loading...</p>}
        {error && <p className="text-red-500 font-medium">{error}</p>}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
            className="
              flex
              justify-center   
              space-x-6
              mb-6
              border-b
              border-gray-200
              overflow-x-auto
              mx-auto          
              max-w-full
            "
          >
            <TabsTrigger
              value="projects"
              className="
                py-3
                px-5
                text-sm
                font-semibold
                text-gray-700
                hover:text-indigo-600
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                transition-colors
                rounded-t
                data-[state=active]:border-b-2 data-[state=active]:border-indigo-600
              "
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="bids"
              className="
                py-3
                px-5
                text-sm
                font-semibold
                text-gray-700
                hover:text-indigo-600
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                transition-colors
                rounded-t
                data-[state=active]:border-b-2 data-[state=active]:border-indigo-600
              "
            >
              Active Bids
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="
                py-3
                px-5
                text-sm
                font-semibold
                text-gray-700
                hover:text-indigo-600
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                transition-colors
                rounded-t
                data-[state=active]:border-b-2 data-[state=active]:border-indigo-600
              "
            >
              Progress Tracking
            </TabsTrigger>
            <TabsTrigger
              value="monitoring"
              className="
                py-3
                px-5
                text-sm
                font-semibold
                text-gray-700
                hover:text-indigo-600
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                transition-colors
                rounded-t
                data-[state=active]:border-b-2 data-[state=active]:border-indigo-600
              "
            >
              Monitoring
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Current Projects</h2>
              <Button
                variant="default"
                size="md"
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                onClick={handleNewProject}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            

            {/* Display Project Cards */}
            {projects.length > 0 ? (
              projects.map((project: Project) => (
                <ProjectCard key={project.name} project={project} />
              ))
            ) : (
              <p className="text-gray-700">No projects available.</p>
            )}
          </TabsContent>

          {/* Bids Tab */}
          
          <TabsContent value="bids">
            {/* Project Selection Dropdown */}
            <div className="flex justify-center mb-6">
              <div className="w-full max-w-md">
                <label
                  htmlFor="projectSelect"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Select Project for Bids
                </label>

                <div className="relative">
                  <select
                    id="projectSelect"
                    value={selectedProjectName}
                    onChange={(e) => setSelectedProjectName(e.target.value)}
                    className="
                      block
                      w-full
                      border border-gray-300
                      rounded-md
                      bg-white
                      py-3
                      px-4
                      pr-10
                      text-sm
                      text-gray-700
                      shadow-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                      focus:border-indigo-500
                      hover:cursor-pointer
                      transition-colors
                      appearance-none
                    "
                  >
                    <option value="">-- Select a Project --</option>
                    {projects.map((project) => (
                      <option key={project.name} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>

                  {/* Custom arrow icon in the top-right */}
                  <div className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    right-0
                    flex
                    items-center
                    pr-3
                    text-gray-400
                  ">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>


            <Card className="shadow-sm rounded-lg">
              <CardHeader className="p-5 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {selectedProjectName
                    ? `Bids for Project: ${selectedProjectName}`
                    : 'Select a Project to View Bids'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {bids.length > 0 ? (
                  bids.map((bid: Bid) => (
                    <BidCard key={bid.bid_id} bid={bid} />
                  ))
                ) : (
                  <p className="text-gray-700">No bids available for this project.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress">
            <Card className="shadow-sm rounded-lg">
              <CardHeader className="p-5 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Project Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {projectProgress ? (
                  <>
                    <div className="mb-6">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-indigo-600 h-3 rounded-full transition-all"
                          style={{ width: `${projectProgress.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {projectProgress.progress}% completed
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-base font-semibold text-gray-900">
                        Verification Milestones
                      </h4>
                      {projectProgress.milestones.length > 0 ? (
                        projectProgress.milestones.map((milestone: Milestone) => (
                          <MilestoneCard key={milestone.id} milestone={milestone} />
                        ))
                      ) : (
                        <p className="text-gray-700">No milestones available.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-700">No project progress data available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <Card className="shadow-sm rounded-lg">
              <CardHeader className="p-5 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Network Traffic Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {trafficData.length > 0 ? (
                  <>
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
                            stroke="#4F46E5"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="p-4 shadow-sm rounded-lg text-gray-700">
                        <h3 className="font-semibold text-gray-900 mb-1">Metric 1</h3>
                        <p className="text-sm">Details about metric 1.</p>
                      </Card>
                      <Card className="p-4 shadow-sm rounded-lg text-gray-700">
                        <h3 className="font-semibold text-gray-900 mb-1">Metric 2</h3>
                        <p className="text-sm">Details about metric 2.</p>
                      </Card>
                      <Card className="p-4 shadow-sm rounded-lg text-gray-700">
                        <h3 className="font-semibold text-gray-900 mb-1">Metric 3</h3>
                        <p className="text-sm">Details about metric 3.</p>
                      </Card>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-700">No traffic data available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BiddingSystem;
