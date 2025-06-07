import { useEffect, useState } from "react";
import {
  Download,
  CheckCircle,
  X,
  Loader2,
  Check,
  ChevronDown,
  Clock,
  AlertTriangle,
  Gavel,
  Users,
  DollarSign,
  Calendar,
  Eye,
  ArrowRight,
  Timer,
  Trophy,
  Upload,
  FileText,
  Star,
  Award,
  Send,
  Paperclip
} from "lucide-react";
import { projectDetails } from "../../apis/projectApi";
import { useSelector } from "react-redux";
import { getBiddingData } from "../../apis/biddingApi";
import { useParams } from "react-router-dom";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";

const SelectedFreelancerProjectPage = () => {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState();
   const {id} = useParams()
  const [biddingDetails, setBiddingDetails] = useState();
  const {user} = useSelector((state)=>state.user);

  const fetchData = async()=>{
    try {
      const [projectResponse, biddingResponse] = await Promise.all([
      projectDetails(id),
      getBiddingData(user._id),
    ]);
        if (!projectResponse.status) {
        toast.error(
          response.data?.message || "Failed to fetch project",
          "error"
        );
        return;
      }
      if (!biddingResponse.status) {
      toast.error(
        biddingResponse.data?.message || "Failed to fetch bidding room"
      );
    }
    console.log(biddingResponse.data)
      setProject(projectResponse.data.projectData);
      setBiddingDetails(biddingResponse.data);
      console.log(project,biddingDetails )
    } catch (error) {
         toast.error(error.message || "An error occurred", "error");
      console.log(error);
    }
  }
  useEffect(()=>{
    fetchData();
  },[])

  const [submissionData, setSubmissionData] = useState({
    description: "",
    liveUrl: "",
    githubUrl: "",
    attachments: []
  });

  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const featuresList = project?.features
    ? project?.features.split("\n").filter(Boolean)
    : [];
  const preferencesList = project?.preferences
    ? project?.preferences.split("\n").filter(Boolean)
    : [];


  const handleSubmissionChange = (field, value) => {
    setSubmissionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSubmissionData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setSubmissionData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitProject = async () => {
    if (!submissionData.description.trim()) {
      alert("Please provide a project description");
      return;
    }

    setSubmissionLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Project submitted successfully!");
      setShowSubmissionForm(false);
      setSubmissionData({
        description: "",
        liveUrl: "",
        githubUrl: "",
        attachments: []
      });
    } catch (error) {
      alert("Failed to submit project. Please try again.");
    } finally {
      setSubmissionLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-white min-h-screen pt-6">
    <Navbar/>
      <div className="max-w-6xl mx-auto px-6 py-8">
         <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Workspace</h1>
              <p className="text-gray-600 mt-1">You've been selected for this project</p>
            </div>
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <Award className="h-5 w-5" />
              <span className="font-medium">Selected Freelancer</span>
            </div>
          </div>
        </div>
      </div>
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{project?.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created: {formatDate(project?.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <Timer className="h-4 w-4 mr-1" />
                    Timeline: {project?.timeline} days
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(biddingDetails?.winner?.amount)}
                </div>
                <p className="text-sm text-gray-600">Your Winning Bid</p>
              </div>
            </div>

            {/* Bidding Details */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Your Winning Bid Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Bid Amount</p>
                  <p className="font-semibold text-blue-900">{formatCurrency(biddingDetails?.winner?.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 mb-1">Proposed Timeline</p>
                  <p className="font-semibold text-blue-900">{biddingDetails?.duration} days</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 mb-1">Selected On</p>
                  <p className="font-semibold text-blue-900">{formatDate(biddingDetails?.winner?.time)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 mb-1">Your Rating</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-semibold text-blue-900">{biddingDetails?.freelancerRating}</span>
                    <span className="text-sm text-blue-700 ml-1">({biddingDetails?.completedProjects} projects)</span>
                  </div>
                </div>
              </div>
              {/* <div className="mt-4">
                <p className="text-sm text-blue-700 mb-1">Your Proposal</p>
                <p className="text-blue-900">{biddingDetails?.proposal}</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Description</h3>
              <div className="text-gray-700 space-y-2">
                {project?.description.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Required Features</h3>
              <div className="space-y-2">
                {featuresList?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Preferences */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tech Preferences</h3>
              <div className="space-y-2">
                {preferencesList?.map((preference, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{preference}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {project?.completionStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Budget:</span>
                  <span className="font-medium">{formatCurrency(project?.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Bid:</span>
                  <span className="font-medium text-green-600">{formatCurrency(biddingDetails?.winner.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline:</span>
                  <span className="font-medium">{biddingDetails?.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Client ID:</span>
                  <span className="font-medium">{project?.clientId}</span>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resources</h3>
              
              {/* Reference Links */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Reference Links</h4>
                {project?.referralLink ? (
                  <a
                    href={project?.referralLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Reference
                  </a>
                ) : (
                  <p className="text-gray-500">No reference links provided</p>
                )}
              </div>

              {/* Attachments */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                {project?.attachments && project.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {project.attachments.map((attachment, index) => {
                      const fileName = attachment.split("/").pop();
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                        >
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700 flex-1">{fileName}</span>
                          <a
                            href={attachment}
                            download
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No attachments</p>
                )}
              </div>
            </div>

            {/* Submit Project Button */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Submission</h3>
              <p className="text-gray-600 mb-4">
                Ready to submit your completed project? Upload your deliverables and provide project details.
              </p>
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Project
              </button>
            </div>
          </div>
        </div>

        {/* Submission Modal */}
        {showSubmissionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Submit Project</h3>
                  <button
                    onClick={() => setShowSubmissionForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Description *
                    </label>
                    <textarea
                      value={submissionData.description}
                      onChange={(e) => handleSubmissionChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe what you've delivered, key features implemented, and any important notes..."
                    />
                  </div>

                  {/* Live URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Live URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={submissionData.liveUrl}
                      onChange={(e) => handleSubmissionChange('liveUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://your-project-demo.com"
                    />
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub/Repository URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={submissionData.githubUrl}
                      onChange={(e) => handleSubmissionChange('githubUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Paperclip className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload files</span>
                        <span className="text-xs text-gray-500">Max 10MB per file</span>
                      </label>
                    </div>

                    {/* Uploaded Files */}
                    {submissionData.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {submissionData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                  <button
                    onClick={() => setShowSubmissionForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitProject}
                    disabled={submissionLoading || !submissionData.description.trim()}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {submissionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Project
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default SelectedFreelancerProjectPage;