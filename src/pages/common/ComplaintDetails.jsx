import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MessageSquare, 
  Paperclip, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Shield
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/navbar';
import Footer from '../../components/user/footer/Footer';
import { getComplaintById } from '../../apis/complaintApi'; 

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getComplaintById(id);
      console.log(response)
      setComplaint(response.data.complaint);
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      setError('Failed to load complaint details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    return type === 'client' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadAttachment = (attachment) => {
    console.log('Downloading:', attachment);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto my-10 p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto my-10 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Complaint</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={goBack}
              className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto my-10 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Complaint Not Found</h3>
            <p className="text-gray-600 mb-4">The complaint you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={goBack}
              className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <Navbar />
      <div className="max-w-4xl mx-auto my-10">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={goBack}
            className="inline-flex items-center px-4 py-2 text-sky-700 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Complaints
          </button>
        </div>

        {/* Main Complaint Card */}
        <div className="bg-white rounded-xl shadow-sm border border-sky-100">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                {getStatusIcon(complaint.status)}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {complaint.subject}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(complaint.complainantType)}`}>
                      {complaint.complainantType.charAt(0).toUpperCase() + complaint.complainantType.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center justify-end mb-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created: {formatDate(complaint.createdAt)}
                </div>
                {complaint.updatedAt !== complaint.createdAt && (
                  <div className="flex items-center justify-end">
                    <Clock className="w-4 h-4 mr-1" />
                    Updated: {formatDate(complaint.updatedAt)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Complaint Details */}
          <div className="p-6">
            {/* Parties Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <User className="w-5 h-5 text-sky-600 mr-2" />
                  <h3 className="font-semibold text-sky-800">Complainant</h3>
                </div>
                <p className="text-sky-700 font-medium">{complaint.complainantId}</p>
                <p className="text-sky-600 text-sm capitalize">({complaint.complainantType})</p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Complaint Against</h3>
                </div>
                <p className="text-gray-700 font-medium">{complaint.againstId}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-sky-600" />
                Description
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>
            </div>

            {/* Admin Response */}
            {complaint.adminMessage && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-sky-600" />
                  Admin Response
                </h3>
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                  <p className="text-sky-800 leading-relaxed">
                    {complaint.adminMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Attachments */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Paperclip className="w-5 h-5 mr-2 text-sky-600" />
                  Attachments ({complaint.attachments.length})
                </h3>
                <div className="space-y-2">
                  {complaint.attachments.map((attachment, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <Paperclip className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-700 font-medium">{attachment}</span>
                      </div>
                      <button
                        onClick={() => handleDownloadAttachment(attachment)}
                        className="inline-flex items-center px-3 py-1 text-sky-700 hover:text-sky-800 hover:bg-sky-50 rounded transition-colors text-sm"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complaint ID */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Complaint ID: <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">{complaint._id}</code></span>
                <span>Status last updated: {formatDate(complaint.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (if needed) */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={goBack}
            className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Back to Complaints List
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComplaintDetails;