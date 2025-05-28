import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, MessageSquare, Paperclip, ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/navbar';
import Footer from '../../components/user/footer/Footer';
import { getComplaintsByClient } from '../../apis/complaintApi';
import { useSelector } from 'react-redux';

const ComplaintsList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await getComplaintsByClient();
      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };
console.log(complaints)
  const handleComplaintClick = (complaintId) => {
    if(user.role === 'client'){
      navigate(`/client/complaint-details/${complaintId}`);
    }else if(user.role === 'freelancer'){
      navigate(`/freelancer/complaint-details/${complaintId}`);
    }
  };

  const handleCreateComplaint = () => {
    if(user.role === 'client'){
      navigate('/client/complaint');
    }else if(user.role === 'freelancer'){
      navigate('/freelancer/complaint');
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

  const getTypeColor = (type) => {
    return type === 'client' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <Navbar/>
      <div className="max-w-7xl mx-auto my-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Complaints</h1>
            <p className="text-gray-600">Manage and track user complaints and disputes</p>
          </div>
          
          {/* Create Complaint Button */}
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleCreateComplaint}
              className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Complaint
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {complaints.length} of {complaints.length} complaints
          </p>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div 
              key={complaint._id} 
              className="bg-white rounded-xl shadow-sm border border-sky-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-sky-200"
              onClick={() => handleComplaintClick(complaint._id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(complaint.complainantType)}`}>
                      {complaint.complainantType.charAt(0).toUpperCase() + complaint.complainantType.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(complaint.createdAt)}
                  </div>
                </div>

                {/* Subject */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-sky-700 transition-colors">
                  {complaint.subject}
                </h3>

                {/* Description */}
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {complaint.description}
                </p>

                {/* Complaint Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Complainant ID:</span>
                    <span className="ml-2 font-medium text-sky-700">{complaint.complainantId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Against ID:</span>
                    <span className="ml-2 font-medium text-sky-700">{complaint.againstId}</span>
                  </div>
                </div>

                {/* Admin Message */}
                {complaint.adminMessage && (
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-sky-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-sky-800 mb-1">Admin Response:</p>
                        <p className="text-sm text-sky-700">{complaint.adminMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {complaint.attachments && complaint.attachments.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Paperclip className="w-4 h-4" />
                    <span>{complaint.attachments.length} attachment{complaint.attachments.length > 1 ? 's' : ''}</span>
                    <div className="flex gap-2 ml-2">
                      {complaint.attachments.map((attachment, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {attachment}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                {complaint.updatedAt !== complaint.createdAt && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Last updated: {formatDate(complaint.updatedAt)}
                    </p>
                  </div>
                )}

                {/* Click indicator */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 flex items-center">
                    Click to view details
                    <ChevronDown className="w-3 h-3 ml-1 transform rotate-[-90deg]" />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {complaints.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600 mb-6">
              No complaints have been submitted yet.
            </p>
            <button
              onClick={handleCreateComplaint}
              className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Complaint
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default ComplaintsList;