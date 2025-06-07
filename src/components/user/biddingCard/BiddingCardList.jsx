import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  Timer, 
  Trophy,
  AlertTriangle,
  Gavel,
  Eye,
  CheckCircle
} from 'lucide-react';

const BiddingRoomsList = ({ biddingRooms, appliedUser, navigate }) => {
  const availableBiddingRooms = biddingRooms.filter(room => 
    room.selectedUsers && room.selectedUsers.some(user => 
      user.freelancerId === appliedUser?.freelancerId
    )
  );

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
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
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

  const handleJoinBidding = (roomId) => {
    navigate(`/freelancer/bidding-room/${roomId}`);
  };

  const getTimeStatus = (startTime, endTime, status) => {
    if (status === 'completed' || status === 'cancelled') {
      return { text: status.charAt(0).toUpperCase() + status.slice(1), color: 'text-gray-600' };
    }
    
    if (!startTime) {
      return { text: 'Waiting to start', color: 'text-yellow-600' };
    }

    const now = new Date();
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;

    if (now < start) {
      const timeDiff = start.getTime() - now.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return { text: `Starts in ${hours}h ${minutes}m`, color: 'text-blue-600' };
      } else {
        return { text: `Starts in ${minutes}m`, color: 'text-blue-600' };
      }
    } else if (end && now > end) {
      return { text: 'Ended', color: 'text-red-600' };
    } else {
      return { text: 'Live Now', color: 'text-green-600' };
    }
  };

  if (!appliedUser || appliedUser.status !== 'selected') {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Bidding Rooms Available
          </h3>
          <p className="text-gray-500">
            {appliedUser.status === 'applied' 
              ? 'You need to be selected by the client to participate in bidding rooms.' 
              : 'Your current application status does not allow access to bidding rooms.'}
          </p>
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-sm text-gray-600">
              Application Status: 
              <span className={`ml-2 font-semibold ${
                appliedUser.status === 'applied' ? 'text-blue-500' :
                appliedUser.status === 'rejected' ? 'text-red-500' :
                appliedUser.status === 'hired' ? 'text-green-600' :
                'text-gray-500'
              }`}>
                {appliedUser.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (availableBiddingRooms.length === 0) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <Gavel className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Active Bidding Rooms
          </h3>
          <p className="text-gray-500">
            There are currently no bidding rooms available for this project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">


      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Gavel className="h-6 w-6 mr-2" />
          Available Bidding Rooms
        </h2>
        
        <div className="space-y-6">
          {availableBiddingRooms.map((room) => {
            const timeStatus = getTimeStatus(room.startTime, room.endTime, room.status);
            
            return (
              <div key={room._id} className="bg-white  rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {room.projectTitle}
                      </h3>
                      {room.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {room.description}
                        </p>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(room.status)} flex items-center space-x-1`}>
                      {getStatusIcon(room.status)}
                      <span className="capitalize">{room.status}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Starting Price</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatCurrency(room.startingPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Current Price</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(room.currentPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Participants</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {room.participants?.length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className={`text-sm font-semibold ${timeStatus.color}`}>
                          {timeStatus.text}
                        </p>
                      </div>
                    </div>
                  </div>

                  {room.budgetRange && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Budget Range:</span> {room.budgetRange}
                      </p>
                    </div>
                  )}

                  {room.duration && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Duration:</span> {room.duration}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="space-y-1">
                      {room.startTime && (
                        <p className="text-sm text-gray-600">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Start: {formatDate(room.startTime)}
                        </p>
                      )}
                      {room.endTime && (
                        <p className="text-sm text-gray-600">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          End: {formatDate(room.endTime)}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleJoinBidding(room._id)}
                      disabled={room.status === 'completed' || room.status === 'cancelled'}
                      className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 ${
                        room.status === 'completed' || room.status === 'cancelled'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : room.status === 'active'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <span>
                        {room.status === 'active' ? 'Join Live Bidding' : 
                         room.status === 'waiting' ? 'Join Room' : 
                         room.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                      {(room.status === 'active' || room.status === 'waiting') && (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BiddingRoomsList;