import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clock,
  Users,
  DollarSign,
  Trophy,
  AlertCircle,
  Eye,
  Settings,
  Award,
  TrendingDown,
  Activity,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  RefreshCw,
} from "lucide-react";
import { getBiddingRoomData, UpdateBiddingWinner, cancelBidding } from "../../apis/biddingApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import socket from "../../config/soket";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
dayjs.extend(relativeTime);

const ClientBiddingRoom = () => {
  const [timer, setTimer] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [currentBid, setCurrentBid] = useState(0);
  const [status, setStatus] = useState("waiting");
  const [winner, setWinner] = useState(null);
  const [initialTimer, setInitialTimer] = useState(60);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [biddingData, setBiddingData] = useState({});
  const [participants, setParticipants] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState(null); 
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);

  const fetchData = async (id) => {
    try {
      const response = await getBiddingRoomData(id);
      if (!response.data.status) {
        toast.error(response?.data?.message);
        return;
      }
      setBiddingData(response?.data?.biddingData);
      setCurrentBid(response?.data?.biddingData?.startingPrice || 0);
      setParticipants(response?.data?.biddingData?.participants || []);
      setBidHistory(response?.data?.biddingData.bids || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch bidding data"
      );
    }
  };

  useEffect(() => {
    fetchData(id);

    if (!user || !id) return;

    socket.emit("joinRoom", {
      roomId: id,
      userId: user._id,
      userName: user?.userName,
      role: "client"
    });
   
    const handleUpdateOnlineUsers = (onlineUserIds) => {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          online: onlineUserIds.includes(p.freelancerId),
        }))
      );
    };

    const handleNewBid = (bid) => {
      setBidHistory((prev) => [...prev, bid]);
      setCurrentBid(bid.amount);
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 1000);
    };

    const handleBiddingData = async(biddingData) => {
      setBiddingData(biddingData);
      setCurrentBid(biddingData.currentPrice);
      setParticipants(biddingData.participants);
      setBidHistory(biddingData.bids || []);
      setWinner(biddingData.winner);
      setStatus(biddingData.status);
    };

    socket.on("updateOnlineUsers", handleUpdateOnlineUsers);
    socket.on("newBid", handleNewBid);
    socket.on("biddingData", handleBiddingData);

    return () => {
      socket.emit("leaveRoom", { roomId: id, userId: user._id });
      socket.off("updateOnlineUsers", handleUpdateOnlineUsers);
      socket.off("newBid", handleNewBid);
      socket.off("biddingData", handleBiddingData);
    };
  }, [id, user]);

  useEffect(() => {
    socket.on("timer-update", ({ initialTimer, mainTimer }) => {
      if (initialTimer !== undefined) setInitialTimer(initialTimer);
      if (mainTimer !== undefined) setTimer(mainTimer);
    });

    socket.on("bidding-started", () => {
      setIsActive(true);
    });

    socket.on("bidding-ended", () => {
      setIsActive(false);
      setPulseEffect(false);
    });

    return () => {
      socket.off("timer-update");
      socket.off("bidding-started");
      socket.off("bidding-ended");
    };
  }, []);

  const handleCancelBidding = async () => {
    try {
      const response = await cancelBidding(id);
      if (response.data.status) {
        toast.success("Bidding session cancelled successfully");
        setStatus("cancelled");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to cancel bidding session");
    }
    setShowConfirmDialog(false);
  };

  const handleSelectWinner = async (freelancerId) => {
    try {
      const response = await UpdateBiddingWinner(id, freelancerId);
      if (response.data.status) {
        toast.success("Winner selected successfully");
        setStatus("completed");
        const winnerData = bidHistory.find(bid => bid.freelancerId === freelancerId);
        setWinner(winnerData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to select winner");
    }
    setShowConfirmDialog(false);
  };


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const memoizedBidHistory = useMemo(
    () => bidHistory.slice().reverse(),
    [bidHistory]
  );

  const getLowestBid = () => {
    return bidHistory.length > 0 ? Math.min(...bidHistory.map(bid => bid.amount)) : currentBid;
  };

  const getBiddingStats = () => {
    const totalBids = bidHistory.length;
    const uniqueBidders = new Set(bidHistory.map(bid => bid.freelancerId)).size;
    const avgBid = totalBids > 0 ? Math.round(bidHistory.reduce((sum, bid) => sum + bid.amount, 0) / totalBids) : 0;
    const savings = biddingData.startingPrice - getLowestBid();
    
    return { totalBids, uniqueBidders, avgBid, savings };
  };

  const stats = getBiddingStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white pt-6">
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-200/30 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="backdrop-blur-xl bg-white/80 border border-purple-200/50 rounded-2xl shadow-2xl mb-8 p-8">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-600 text-sm font-semibold">
                    CLIENT MONITORING
                  </span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {biddingData?.projectTitle || "Loading..."}
                </h1>
                <p className="text-purple-700 text-lg font-medium mb-3">
                  Project Owner Dashboard
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>💰 Budget: ${biddingData?.budgetRange || 0}</span>
                  <span>⏱️ Duration: {biddingData?.duration || 0} days</span>
                  <span>📊 Status: {status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
              </div>
              
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ${biddingData?.startingPrice || 0}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">Starting Price</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    ${getLowestBid()}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">Lowest Bid</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {participants.length}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">Bidders</div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            {(status === "active" || status === "waiting") && (
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setActionType('cancel');
                    setShowConfirmDialog(true);
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2 font-semibold shadow-lg"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Cancel Bidding</span>
                </button>
                
                {bidHistory.length > 0 && (
                  <button
                    onClick={() => {
                      setActionType('select');
                      setSelectedFreelancer(memoizedBidHistory[0]);
                      setShowConfirmDialog(true);
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 font-semibold shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Select Current Leader</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-8">
              {/* Main Status Display */}
              <div
                className={`backdrop-blur-xl bg-white/90 border border-purple-200/50 rounded-2xl shadow-2xl p-8 transition-all duration-500 ${
                  pulseEffect ? "ring-4 ring-green-400/50 animate-pulse scale-105" : ""
                }`}
              >
                {status === "waiting" ? (
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center animate-spin-slow shadow-xl">
                        <Clock className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Preparing Bidding Session
                    </h2>
                    <div
                      className={`text-6xl font-bold mb-6 transition-colors duration-300 ${
                        initialTimer <= 10 ? "text-red-500 animate-pulse" : "text-purple-600"
                      }`}
                    >
                      {formatTime(initialTimer)}
                    </div>
                    <p className="text-gray-600 text-lg">
                      Bidding will start automatically when timer reaches zero
                    </p>
                  </div>
                ) : status === "completed" ? (
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center animate-bounce shadow-xl">
                        <Trophy className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      🎉 Winner Selected! 🎉
                    </h2>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-6">
                      <p className="text-2xl font-bold text-yellow-600 mb-2">
                        {winner?.freelancerName}
                      </p>
                      <p className="text-gray-800 text-xl">
                        Winning Bid: <span className="text-green-600 font-bold">${winner?.amount}</span>
                      </p>
                      <p className="text-gray-600 mt-2">
                        You saved: <span className="text-green-600 font-bold">${biddingData.startingPrice - winner?.amount}</span>
                      </p>
                    </div>
                  </div>
                ) : status === "cancelled" ? (
                  <div className="text-center">
                    <AlertCircle className="mx-auto h-24 w-24 text-red-500 mb-6" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Bidding Session Cancelled
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                      The bidding session was cancelled by the client
                    </p>
                  </div>
                ) : status === "active" ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-12 mb-8">
                      <div className="text-center">
                        <div
                          className={`text-6xl font-bold mb-2 transition-all duration-300 ${
                            timer <= 5 ? "text-red-500 animate-pulse scale-110" : "text-purple-600"
                          }`}
                        >
                          {timer}s
                        </div>
                        <div className="text-gray-500">Time Remaining</div>
                        <div className="w-24 h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 rounded-full ${
                              timer <= 5 ? "bg-red-500" : "bg-purple-500"
                            }`}
                            style={{ width: `${(timer / 30) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-px h-24 bg-gray-300"></div>
                      <div className="text-center">
                        <div className="text-6xl font-bold text-green-600 mb-2">
                          ${getLowestBid()}
                        </div>
                        <div className="text-gray-500">Current Lowest Bid</div>
                        <div className="text-green-600 text-sm mt-1 animate-pulse font-semibold">
                          🔥 Best Offer
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Bidding in Progress</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{stats.totalBids}</div>
                          <div className="text-gray-600">Total Bids</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{stats.uniqueBidders}</div>
                          <div className="text-gray-600">Active Bidders</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">${stats.avgBid}</div>
                          <div className="text-gray-600">Average Bid</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">${stats.savings}</div>
                          <div className="text-gray-600">Potential Savings</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Bid History */}
              <div className="backdrop-blur-xl bg-white/90 border border-purple-200/50 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Bid History</h3>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm font-semibold">Live Updates</span>
                  </div>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {bidHistory.length > 0 ? (
                    memoizedBidHistory.map((bid, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                          index === 0 
                            ? "bg-green-50 border-green-200 ring-2 ring-green-200" 
                            : "bg-purple-50 border-purple-100 hover:border-purple-300"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${
                            index === 0 
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
                              : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          }`}>
                            {bid.freelancerName?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-lg flex items-center space-x-2">
                              <span>{bid.freelancerName}</span>
                              {index === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {bid.time ? dayjs(bid.time).fromNow() : dayjs().fromNow()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            index === 0 ? "text-green-600" : "text-purple-600"
                          }`}>
                            ${bid.amount}
                          </div>
                          {index === 0 && (
                            <div className="text-green-600 text-xs font-semibold flex items-center justify-end space-x-1">
                              <TrendingDown className="w-3 h-3" />
                              <span>LOWEST</span>
                            </div>
                          )}
                          {index < 3 && index !== 0 && (
                            <div className="text-purple-600 text-xs font-medium">
                              TOP {index + 1}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                        <DollarSign className="h-8 w-8 text-purple-500" />
                      </div>
                      <p className="text-gray-500 text-lg">
                        No bids placed yet. Waiting for freelancers to bid... ⏳
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Active Participants */}
              <div className="backdrop-blur-xl bg-white/90 border border-purple-200/50 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800">Participants</h3>
                </div>
                <div className="space-y-4">
                  {participants.map((participant) => {
                    const lastBid = bidHistory.find(bid => bid.freelancerId === participant.freelancerId);
                    return (
                      <div key={participant.freelancerId} className="group">
                        <div className="flex items-center justify-between p-4 rounded-xl border bg-white border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg bg-gradient-to-r from-purple-500 to-blue-500">
                                {participant.freelancerName?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                participant.online ? "bg-green-500" : "bg-gray-400"
                              }`}></div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {participant.freelancerName}
                              </div>
                              <div className="flex items-center space-x-1 mt-1">
                                <span className="text-sm text-gray-500">⭐ {participant.rating}</span>
                                <span className={`text-xs font-medium ${
                                  participant.online ? "text-green-600" : "text-gray-400"
                                }`}>
                                  {participant.online ? "Online" : "Away"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {lastBid && (
                            <div className="text-right">
                              <div className="text-lg font-bold text-purple-600">
                                ${lastBid.amount}
                              </div>
                              <div className="text-xs text-gray-500">
                                Last bid
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Project Stats */}
              <div className="backdrop-blur-xl bg-white/90 border border-purple-200/50 rounded-2xl shadow-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Project Overview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Posted:</span>
                    <span className="text-gray-800 font-medium">
                      {biddingData?.createdAt ? dayjs(biddingData.createdAt).fromNow() : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Invited:</span>
                    <span className="text-purple-600 font-medium">
                      {biddingData?.selectedUsers?.length || 0} freelancers
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Savings:</span>
                    <span className="text-green-600 font-medium">
                      ${stats.savings}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center">
                {actionType === 'cancel' ? (
                  <>
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Cancel Bidding?</h3>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to cancel this bidding session? This action cannot be undone.
                    </p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Select Winner?</h3>
                    <p className="text-gray-600 mb-6">
                      Select <strong>{selectedFreelancer?.freelancerName}</strong> as the winner with a bid of <strong>${selectedFreelancer?.amount}</strong>?
                    </p>
                  </>
                )}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={actionType === 'cancel' ? handleCancelBidding : () => handleSelectWinner(selectedFreelancer.freelancerId)}
                    className={`flex-1 py-3 px-6 text-white rounded-xl transition-colors ${
                      actionType === 'cancel' 
                        ? "bg-red-500 hover:bg-red-600" 
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {actionType === 'cancel' ? 'Yes, Cancel' : 'Yes, Select'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(147, 51, 234, 0.1);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(147, 51, 234, 0.4);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(147, 51, 234, 0.6);
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}</style>
          </div>
      <Footer />
    </div>
  );
};

export default ClientBiddingRoom