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
} from "lucide-react";
import { projectDetails } from "../../apis/projectApi";
import { toast } from "sonner";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import { applyProject } from "../../apis/userApi";
import { getBiddings } from "../../apis/biddingApi";
import { useNavigate } from "react-router-dom";
import BiddingRoomsList from "../../components/user/biddingCard/BiddingCardList";

const ProjectDetails = () => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [appliedUser, setAppliedUser] = useState({});
  const [timeRemaining, setTimeRemaining] = useState("");
  const [biddingExpired, setBiddingExpired] = useState(false);
  const [biddingRooms, setBiddingRooms] = useState([]);
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const getProjectDetails = async () => {
    try {
      setLoading(true);

      const response = await projectDetails(id);
      const responseBidding = await getBiddings(id)
      if (!response.status) {
        toast.error(
          response.data?.message || "Failed to fetch project",
          "error"
        );
        return;
      }
      if (!responseBidding.status) {
        toast.error(
          response.data?.message || "Failed to fetch biddings",
          "error"
        );
        return;
      }
      setBiddingRooms(responseBidding.data.data)
      setProject(response.data.projectData);
      setHasApplied(response.data.hasApplied);
      setAppliedUser(response.data.appliedUser);
    } catch (error) {
      toast.error(error.message || "An error occurred", "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };



  const calculateTimeRemaining = () => {
    if (!project?.biddingDeadline) return;

    const deadline = new Date(project.biddingDeadline);
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();

    if (timeDiff <= 0) {
      setBiddingExpired(true);
      setTimeRemaining("Bidding period has ended");
      return;
    }

    setBiddingExpired(false);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      setTimeRemaining(
        `${days} day${days > 1 ? "s" : ""}, ${hours} hour${
          hours > 1 ? "s" : ""
        } remaining`
      );
    } else if (hours > 0) {
      setTimeRemaining(
        `${hours} hour${hours > 1 ? "s" : ""}, ${minutes} minute${
          minutes > 1 ? "s" : ""
        } remaining`
      );
    } else {
      setTimeRemaining(`${minutes} minute${minutes > 1 ? "s" : ""} remaining`);
    }
  };

  useEffect(() => {
    if (id) {
      getProjectDetails();
    }
  }, []);

  useEffect(() => {
    if (project?.biddingDeadline) {
      calculateTimeRemaining();
      const interval = setInterval(calculateTimeRemaining, 60000);
      return () => clearInterval(interval);
    }
  }, [project?.biddingDeadline]);

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



  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "waiting":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Gavel className="h-4 w-4" />;
      case "waiting":
        return <Timer className="h-4 w-4" />;
      case "completed":
        return <Trophy className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

    const getBiddingDeadlineStatus = () => {
    if (!project?.biddingDeadline) return null;

    const deadline = new Date(project.biddingDeadline);
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();
    const hoursRemaining = timeDiff / (1000 * 60 * 60);

    if (timeDiff <= 0) {
      return {
        status: "expired",
        color: "text-red-600 bg-red-50",
        icon: AlertTriangle,
      };
    } else if (hoursRemaining <= 24) {
      return {
        status: "urgent",
        color: "text-orange-600 bg-orange-50",
        icon: Clock,
      };
    } else {
      return {
        status: "active",
        color: "text-blue-600 bg-blue-50",
        icon: Clock,
      };
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Project not found
          </h2>
          <p className="text-gray-600 mt-2">
            The project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const featuresList = project.features
    ? project.features.split("\n").filter(Boolean)
    : [];
  const preferencesList = project.preferences
    ? project.preferences.split("\n").filter(Boolean)
    : [];

  const formattedBudget = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(project.budget);

  const biddingStatus = getBiddingDeadlineStatus();
  return (
    <div className="bg-gradient-to-br from-sky-50 to-white min-h-screen p-6">
      <Navbar />
      <div className="max-w-6xl mt-5 mb-5 mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {project.title}
          </h1>
          
          {project.biddingDeadline && biddingStatus && (
            <div
              className={`mb-8 p-4 rounded-lg border ${biddingStatus.color}`}
            >
              <div className="flex items-center space-x-2">
                <biddingStatus.icon className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">
                    {biddingExpired
                      ? "Bidding Period Ended"
                      : "Bidding Deadline"}
                  </h3>
                  <p className="text-sm">
                    {biddingExpired
                      ? `Bidding ended on ${formatDate(
                          project.biddingDeadline
                        )}`
                      : `Deadline: ${formatDate(project.biddingDeadline)}`}
                  </p>
                  <p className="text-sm font-medium mt-1">{timeRemaining}</p>
                </div>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Description
              </h2>
              <div className="space-y-2 text-gray-600">
                {project.description.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Required Features / Pages
              </h2>
              <div className="space-y-1 text-gray-600">
                {featuresList.length > 0 ? (
                  featuresList.map((feature, index) => (
                    <p key={index}>{feature}</p>
                  ))
                ) : (
                  <p>No features specified</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Tech Preferences
              </h2>
              <div className="space-y-2 text-gray-600">
                {preferencesList.length > 0 ? (
                  preferencesList.map((preference, index) => (
                    <p key={index}>{preference}</p>
                  ))
                ) : (
                  <p>No preferences specified</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Additional Information
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  Status:{" "}
                  <span className="font-medium capitalize">
                    {project.completionStatus}
                  </span>
                </p>
                <p>
                  Client ID:{" "}
                  <span className="font-medium">{project.clientId}</span>
                </p>
                {project.freelancerId && (
                  <p>
                    Freelancer ID:{" "}
                    <span className="font-medium">{project.freelancerId}</span>
                  </p>
                )}
                <p>
                  Created:{" "}
                  <span className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </p>
                {project.biddingDeadline && (
                  <p>
                    Bidding Deadline:{" "}
                    <span
                      className={`font-medium ${
                        biddingExpired ? "text-red-600" : "text-blue-600"
                      }`}
                    >
                      {formatDate(project.biddingDeadline)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Timeline</h2>
              <p className="text-gray-600">
                {project.timeline
                  ? `${project.timeline} days`
                  : "No timeline specified"}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Budget</h2>
              <p className="text-gray-600">Fixed: {formattedBudget}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Reference Links
              </h2>
              {project.referralLink ? (
                <a
                  href={project.referralLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {project.referralLink}
                </a>
              ) : (
                <p className="text-gray-600">No reference links provided</p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Attachments
              </h2>
              {project.attachments && project.attachments.length > 0 ? (
                <div className="space-y-2">
                  {project.attachments.map((attachment, index) => {
                    const fileName = attachment.split("/").pop();
                    const downloadUrl = attachment.replace(
                      "/upload/",
                      "/upload/fl_attachment/"
                    );

                    return (
                      <div
                        key={index}
                        className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2 w-fit"
                      >
                        <a
                          href={downloadUrl}
                          download={fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={18} className="text-gray-600" />
                        </a>
                        <span className="text-gray-700">
                          {`Attachment ${index + 1}`} - {fileName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600">No attachments</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mb-10">
          {hasApplied ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-yellow-500">
                You have already applied.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Application Status:{" "}
                <strong
                  className={
                    appliedUser.status === "applied"
                      ? "text-blue-500"
                      : appliedUser.status === "rejected"
                      ? "text-red-500"
                      : appliedUser.status === "hired"
                      ? "text-green-600"
                      : appliedUser.status === "selected"
                      ? "text-violet-600"
                      : ""
                  }
                >
                  {appliedUser.status}
                </strong>
              </p>
            </div>
          ) : (
            <button
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition duration-300 transform hover:scale-105"
              onClick={apply}
            >
              Apply Now
            </button>
          )}         
        </div>
               {hasApplied && (
  <BiddingRoomsList 
    biddingRooms={biddingRooms} 
    appliedUser={appliedUser}
    navigate={navigate}
  />
)}
 
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetails;