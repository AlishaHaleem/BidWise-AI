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
import axiosInstance from '../api/axiosConfig'; 
import { isAxiosError } from 'axios';

// Types
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

// --------------------------------------
// ProjectCard component
// Now includes a "Change Status" button
// that calls openStatusModal with the project
// --------------------------------------
const ProjectCard: React.FC<{
  project: Project;
  onOpenStatusModal: (project: Project) => void;
}> = ({ project, onOpenStatusModal }) => {
  // If you have custom variants for your Badge component,
  // adjust them here to match your desired color.
  // For example, "default" could be gray, "warning" = yellow, "success" = green, etc.
  let badgeVariant: 'default' | 'warning' | 'success' | 'danger' = 'default';

  if (project.status === 'Open for Bids') {
    badgeVariant = 'default';
  } else if (project.status === 'Under Review') {
    badgeVariant = 'warning';
  } else if (project.status === 'Completed') {
    badgeVariant = 'success';
  } else {
    badgeVariant = 'danger';
  }

  return (
    <Card className="mb-4 shadow transition-transform hover:shadow-xl hover:-translate-y-1 rounded-xl border border-gray-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          {/* Left Section: Project Name & Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {project.name}
            </h3>
            <div className="flex items-center mt-3 space-x-2 text-gray-600">
              <School className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-sm">{project.schools} schools</span>
            </div>
          </div>

          {/* Right Section: Status Badge + Button */}
          <div className="flex items-center space-x-3">
            <Badge
              // Make the badge pill-shaped with some horizontal padding
              variant={badgeVariant}
              className="rounded-full px-3 py-1 text-xs font-medium tracking-wide"
            >
              {project.status}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              className="
                border-indigo-500 text-indigo-600
                hover:bg-indigo-50 hover:text-indigo-700
                focus:ring-indigo-500 focus:border-indigo-500
              "
              onClick={() => onOpenStatusModal(project)}
            >
              Change Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// BidCard & MilestoneCard remain mostly unchanged, except for style tweaks
const BidCard: React.FC<{ bid: Bid }> = ({ bid }) => (
  <Card className="mb-4 shadow transition-transform hover:shadow-xl hover:-translate-y-1 rounded-xl border border-gray-100">
    <CardContent className="p-6">
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
          <Button className="mt-2" size="sm" variant="default">
            Select Bid
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const MilestoneCard: React.FC<{ milestone: Milestone }> = ({ milestone }) => {
  let badgeVariant = 'default';
  if (milestone.status === 'Completed') {
    badgeVariant = 'success';
  } else if (milestone.status === 'In Progress') {
    badgeVariant = 'warning';
  }

  return (
    <Card className="mb-4 shadow transition-transform hover:shadow-xl hover:-translate-y-1 rounded-xl border border-gray-100">
      <CardContent className="p-6">
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
          <Badge variant={badgeVariant as 'default' | 'warning' | 'success' | 'danger'} className="text-sm">
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
};

const BiddingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('projects');

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [trafficData, setTrafficData] = useState<{ time: string; bandwidth: number }[]>([]);
  const [projectProgress, setProjectProgress] = useState<ProjectProgress | null>(null);

  // Loading & error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Selected project name for fetching bids
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');

  // CREATE NEW PROJECT STATES
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectStatus, setNewProjectStatus] = useState<string>('Open for Bids');
  const [newProjectSchools, setNewProjectSchools] = useState<number>(0);

  // CHANGE STATUS STATES
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [statusProject, setStatusProject] = useState<Project | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState<string>('Open for Bids');

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Projects
        const projectsResponse = await axiosInstance.get<Project[]>('/projects');
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

        // Traffic
        const trafficResponse = await axiosInstance.get<{ time: string; bandwidth: number }[]>('/traffic-data');
        if (Array.isArray(trafficResponse.data)) {
          setTrafficData(trafficResponse.data);
        } else {
          throw new Error('Invalid traffic data format.');
        }

        // Project Progress (for the first project)
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
      } catch (err) {
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

  // Fetch Bids on project change
  useEffect(() => {
    const fetchBids = async () => {
      if (!selectedProjectName) return;
      setLoading(true);
      setError('');
      try {
        const bidsResponse = await axiosInstance.get<Bid[]>('/bids', {
          params: { project_id: selectedProjectName }
        });
        if (Array.isArray(bidsResponse.data)) {
          setBids(bidsResponse.data);
        } else {
          throw new Error('Invalid bids data format.');
        }
      } catch (err) {
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

  // CREATE NEW PROJECT
  const handleNewProject = () => {
    setShowNewProjectModal(true);
  };

  const closeNewProjectModal = () => {
    setShowNewProjectModal(false);
    setNewProjectName('');
    setNewProjectStatus('Open for Bids');
    setNewProjectSchools(0);
  };

  const handleNewProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newProjectData = {
        name: newProjectName,
        status: newProjectStatus,
        schools: newProjectSchools
      };
      await axiosInstance.post('/projects', newProjectData);
      closeNewProjectModal();

      // Refresh or update local
      const updatedProjectsResp = await axiosInstance.get<Project[]>('/projects');
      setProjects(updatedProjectsResp.data);

    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.error || 'Failed to create project.');
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

  // CHANGE STATUS
  const openStatusModal = (project: Project) => {
    setStatusProject(project);
    setUpdatedStatus(project.status); // default to current status
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setStatusProject(null);
    setUpdatedStatus('Open for Bids');
  };

  const handleChangeStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusProject) return;

    setLoading(true);
    setError('');

    try {
      // PUT /projects/status
      await axiosInstance.put('/projects/status', {
        name: statusProject.name,
        newStatus: updatedStatus
      });

      closeStatusModal();

      // Refresh projects
      const updatedProjectsResp = await axiosInstance.get<Project[]>('/projects');
      setProjects(updatedProjectsResp.data);
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.error || 'Failed to update project status.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            GIGA School Connectivity
          </h1>
          <p className="text-gray-500 text-sm">Bidding & Monitoring System</p>
        </div>

        {loading && (
          <p className="text-indigo-600 font-medium text-center mb-4 animate-pulse">
            Loading...
          </p>
        )}
        {error && (
          <p className="text-red-500 font-medium text-center mb-4">
            {error}
          </p>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex justify-center space-x-4 mb-6 border-b border-gray-200 overflow-x-auto mx-auto">
            <TabsTrigger
              value="projects"
              className="
                relative py-3 px-5 text-sm font-medium text-gray-600 
                hover:text-indigo-600 transition-colors focus:outline-none
                data-[state=active]:border-b-4 data-[state=active]:border-indigo-600
                data-[state=active]:text-indigo-600
              "
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="bids"
              className="
                relative py-3 px-5 text-sm font-medium text-gray-600 
                hover:text-indigo-600 transition-colors focus:outline-none
                data-[state=active]:border-b-4 data-[state=active]:border-indigo-600
                data-[state=active]:text-indigo-600
              "
            >
              Active Bids
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="
                relative py-3 px-5 text-sm font-medium text-gray-600 
                hover:text-indigo-600 transition-colors focus:outline-none
                data-[state=active]:border-b-4 data-[state=active]:border-indigo-600
                data-[state=active]:text-indigo-600
              "
            >
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="monitoring"
              className="
                relative py-3 px-5 text-sm font-medium text-gray-600 
                hover:text-indigo-600 transition-colors focus:outline-none
                data-[state=active]:border-b-4 data-[state=active]:border-indigo-600
                data-[state=active]:text-indigo-600
              "
            >
              Monitoring
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="mb-5 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                Current Projects
              </h2>
              <Button
                variant="default"
                size="md"
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white transition-colors rounded-lg"
                onClick={handleNewProject}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <ProjectCard
                    key={proj.name}
                    project={proj}
                    onOpenStatusModal={openStatusModal}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-700">No projects available.</p>
            )}
          </TabsContent>

          {/* Bids Tab */}
          <TabsContent value="bids">
            <div className="mb-5">
              <label
                htmlFor="projectSelect"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Select Project for Bids
              </label>
              <div className="relative w-full max-w-md mx-auto">
                <select
                  id="projectSelect"
                  value={selectedProjectName}
                  onChange={(e) => setSelectedProjectName(e.target.value)}
                  className="
                    block
                    w-full
                    border border-gray-300
                    rounded-lg
                    bg-white
                    py-2
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
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    right-0
                    flex
                    items-center
                    pr-3
                    text-gray-400
                  "
                >
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

            <Card className="shadow-sm rounded-xl border border-gray-100">
              <CardHeader className="p-5 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {selectedProjectName
                    ? `Bids for Project: ${selectedProjectName}`
                    : 'Select a Project to View Bids'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {bids.length > 0 ? (
                  bids.map((bid) => <BidCard key={bid.bid_id} bid={bid} />)
                ) : (
                  <p className="text-gray-700">
                    No bids available for this project.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress">
            <Card className="shadow-sm rounded-xl border border-gray-100">
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
                        />
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
                        projectProgress.milestones.map((milestone) => (
                          <MilestoneCard key={milestone.id} milestone={milestone} />
                        ))
                      ) : (
                        <p className="text-gray-700">No milestones available.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-700">
                    No project progress data available.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <Card className="shadow-sm rounded-xl border border-gray-100">
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
                      <Card className="p-4 shadow-sm rounded-lg border border-gray-100 text-gray-700 transition-transform hover:shadow-md hover:-translate-y-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Metric 1
                        </h3>
                        <p className="text-sm">Details about metric 1.</p>
                      </Card>
                      <Card className="p-4 shadow-sm rounded-lg border border-gray-100 text-gray-700 transition-transform hover:shadow-md hover:-translate-y-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Metric 2
                        </h3>
                        <p className="text-sm">Details about metric 2.</p>
                      </Card>
                      <Card className="p-4 shadow-sm rounded-lg border border-gray-100 text-gray-700 transition-transform hover:shadow-md hover:-translate-y-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Metric 3
                        </h3>
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

      {/* New Project Modal */}
{showNewProjectModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
  >
    <div
      className="
        relative bg-white w-full max-w-md p-6 rounded-xl shadow-xl
        transform transition-all scale-100 animate-slideInFromTop
      "
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-extrabold text-gray-800">
          Create New Project
        </h2>

        {/* Close Icon (optional) */}
        <button
          onClick={closeNewProjectModal}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Subtitle or Additional Info */}
      <p className="text-sm text-gray-500 mb-4">
        Fill in the details below to add a new project to the system.
      </p>

      {/* Form */}
      <form onSubmit={handleNewProjectSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            className="
              w-full border border-gray-300 rounded-md p-2
              focus:ring-indigo-500 focus:border-indigo-500
              text-sm
            "
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="projectStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="projectStatus"
            className="
              w-full border border-gray-300 rounded-md p-2
              focus:ring-indigo-500 focus:border-indigo-500
              text-sm
            "
            value={newProjectStatus}
            onChange={(e) => setNewProjectStatus(e.target.value)}
          >
            <option value="Open for Bids">Open for Bids</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="projectSchools"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Number of Schools
          </label>
          <input
            type="number"
            id="projectSchools"
            className="
              w-full border border-gray-300 rounded-md p-2
              focus:ring-indigo-500 focus:border-indigo-500
              text-sm
            "
            value={newProjectSchools}
            onChange={(e) => setNewProjectSchools(Number(e.target.value))}
            min={0}
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            onClick={closeNewProjectModal}
            type="button"
            className="
              border-gray-300 hover:border-gray-400
              text-sm
            "
          >
            Cancel
          </Button>
          <Button
            variant="default"
            type="submit"
            className="
              bg-indigo-600 text-white hover:bg-indigo-700
              text-sm
            "
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  </div>
)}

{/* Change Status Modal */}
{showStatusModal && statusProject && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
  >
    <div
      className="
        relative bg-white w-full max-w-md p-6 rounded-xl shadow-xl
        transform transition-all scale-100 animate-slideInFromTop
      "
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-extrabold text-gray-800">
          Change Status
        </h2>

        {/* Close Icon (optional) */}
        <button
          onClick={closeStatusModal}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Subtitle / Additional Info */}
      <p className="text-sm text-gray-500 mb-4">
        You are updating the status for{' '}
        <span className="font-semibold">{statusProject.name}</span>.
      </p>

      {/* Form */}
      <form onSubmit={handleChangeStatusSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="newStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Status
          </label>
          <select
            id="newStatus"
            className="
              w-full border border-gray-300 rounded-md p-2
              focus:ring-indigo-500 focus:border-indigo-500
              text-sm
            "
            value={updatedStatus}
            onChange={(e) => setUpdatedStatus(e.target.value)}
          >
            <option value="Open for Bids">Open for Bids</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            onClick={closeStatusModal}
            type="button"
            className="
              border-gray-300 hover:border-gray-400
              text-sm
            "
          >
            Cancel
          </Button>
          <Button
            variant="default"
            type="submit"
            className="
              bg-indigo-600 text-white hover:bg-indigo-700
              text-sm
            "
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default BiddingSystem;
