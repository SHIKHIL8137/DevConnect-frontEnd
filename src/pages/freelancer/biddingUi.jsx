import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clock,
  Users,
  DollarSign,
  Trophy,
  AlertCircle,
  Send,
  Zap,
  Star,
  Eye,
} from "lucide-react";
import { getBiddingRoomData, UpdateBiddingWinner } from "../../apis/biddingApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import socket from "../../config/soket";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
dayjs.extend(relativeTime);

const BiddingRoom = () => {
  const [timer, setTimer] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [currentBid, setCurrentBid] = useState(0);
  const [myBid, setMyBid] = useState("");
  const [status, setStatus] = useState("waiting");
  const [winner, setWinner] = useState(null);
  const [initialTimer, setInitialTimer] = useState(60);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [biddingData, setBiddingData] = useState({});
  const [participants, setParticipants] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
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
      role:'freelancer'
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
      setPulseEffect(false);
    };

    const handleNotAllowed = () => {
      toast.error("You are not allowed to join this room");
    };

    const handleBiddingData = (biddingData) => {
      setBiddingData(biddingData);
      setCurrentBid(biddingData.currentPrice);
      setParticipants(biddingData.participants);
      setBidHistory(biddingData.bids || []);
      setWinner(biddingData.winner);
      setStatus(biddingData.status);
    };

    socket.on("updateOnlineUsers", handleUpdateOnlineUsers);
    socket.on("newBid", handleNewBid);
    socket.on("not-allowed", handleNotAllowed);
    socket.on("biddingData", handleBiddingData);

    return () => {
      socket.emit("leaveRoom", { roomId: id, userId: user._id });
      socket.off("updateOnlineUsers", handleUpdateOnlineUsers);
      socket.off("newBid", handleNewBid);
      socket.off("not-allowed", handleNotAllowed);
      socket.off("biddingData", handleBiddingData);
    };
  }, [id, user]);

  const participantsWithFlags = participants.map((p) => ({
    ...p,
    isMe: p.freelancerId === user._id,
  }));

  useEffect(() => {
    socket.on("timer-update", ({ initialTimer, mainTimer }) => {
      if (initialTimer !== undefined) setInitialTimer(initialTimer);
      if (mainTimer !== undefined) setTimer(mainTimer);
    });

    socket.on("bidding-started", () => {
      setIsActive(true);
    });

    socket.on("pulse-effect", () => {
      setPulseEffect(true);
    });

    socket.on("bidding-ended", () => {
      setIsActive(false);
      setPulseEffect(false);
    });

    return () => {
      socket.off("timer-update");
      socket.off("bidding-started");
      socket.off("pulse-effect");
      socket.off("bidding-ended");
    };
  }, [bidHistory]);

  const handleBidSubmit = useCallback(() => {
    if (myBid && parseInt(myBid) < currentBid && isActive) {
      const newBid = {
        freelancerId: user?._id,
        freelancerName: user?.userName,
        amount: parseInt(myBid),
      };
      console.log("Submitting bid:", newBid);
      socket.emit("placeBid", { roomId: id, bid: newBid });
      setMyBid("");
    }
  }, [myBid, currentBid, isActive, user, id]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const memoizedBidHistory = useMemo(
    () => bidHistory.slice().reverse(),
    [bidHistory]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 pt-6">
      <Navbar />
      <div className="relative overflow-hidden z-0">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-200/30 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="backdrop-blur-xl bg-white/80 border border-sky-200/50 rounded-2xl shadow-2xl mb-8 p-8">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 text-sm font-semibold">
                    LIVE BIDDING
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {biddingData?.projectTitle || "Loading..."}
                </h1>
                <p className="text-sky-700 text-lg font-medium">
                  Client: {biddingData?.clientId || "N/A"}
                </p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                  <span>💰 Budget: ${biddingData?.budgetRange || 0}</span>
                  <span>⏱️ Duration: {biddingData?.duration || 0} days</span>
                </div>
              </div>
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    ${biddingData?.startingPrice || 0}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    Starting Price
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {participants.length}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">Bidders</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-8">
              <div
                className={`backdrop-blur-xl bg-white/90 border border-sky-200/50 rounded-2xl shadow-2xl p-8 transition-all duration-500 ${
                  pulseEffect
                    ? "ring-4 ring-red-400/50 animate-pulse scale-105"
                    : ""
                }
              }`}
              >
                {status === "waiting" ? (
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center animate-spin-slow shadow-xl">
                        <svg
                          className="h-16 w-16 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Get Ready to Bid!
                    </h2>
                    <div
                      className={`text-6xl font-bold mb-6 transition-colors duration-300 ${
                        initialTimer <= 10
                          ? "text-red-500 animate-pulse"
                          : "text-sky-600"
                      }`}
                    >
                      {formatTime(initialTimer)}
                    </div>
                    <p className="text-gray-600 text-lg">
                      Bidding starts automatically when timer reaches zero
                    </p>
                    <div className="flex justify-center space-x-8 mt-8">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg
                          className="h-5 w-5 text-yellow-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                        <span>Fast-paced bidding</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2 12s3-10 10-10 10 10 10 10-3 10-10 10S2 12 2 12z"
                          ></path>
                        </svg>
                        <span>Real-time updates</span>
                      </div>
                    </div>
                  </div>
                ) : status === "completed" ? (
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center animate-bounce shadow-xl">
                        <svg
                          className="h-16 w-16 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-ping"></div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      🎉 We Have a Winner! 🎉
                    </h2>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-6">
                      <p className="text-2xl font-bold text-yellow-600 mb-2">
                        {winner?.freelancerName}
                      </p>
                      <p className="text-gray-800 text-xl">
                        Winning Bid:{" "}
                        <span className="text-green-600 font-bold">
                          ${winner?.amount}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : status === "cancelled" ? (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-24 w-24 text-red-500 mb-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      ></path>
                    </svg>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Bidding Session Ended
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                      No bids were placed within the time limit
                    </p>
                  </div>
                ) : status === "active" ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-12 mb-8">
                      <div className="text-center">
                        <div
                          className={`text-6xl font-bold mb-2 transition-all duration-300 ${
                            timer <= 5
                              ? "text-red-500 animate-pulse scale-110"
                              : "text-sky-600"
                          }`}
                        >
                          {timer}s
                        </div>
                        <div className="text-gray-500">Time Remaining</div>
                        <div className="w-24 h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 rounded-full ${
                              timer <= 5 ? "bg-red-500" : "bg-sky-500"
                            }`}
                            style={{ width: `${(timer / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-px h-24 bg-gray-300"></div>
                      <div className="text-center">
                        <div className="text-6xl font-bold text-green-600 mb-2">
                          ${currentBid}
                        </div>
                        <div className="text-gray-500">Current Lowest Bid</div>
                        <div className="text-green-600 text-sm mt-1 animate-pulse font-semibold">
                          🔥 Leading
                        </div>
                      </div>
                    </div>
                    <div className="max-w-md mx-auto">
                      <div className="flex space-x-3">
                        <div className="flex-1 relative group">
                          <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-sky-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <input
                            type="number"
                            value={myBid}
                            onChange={(e) => setMyBid(e.target.value)}
                            placeholder="Enter your bid"
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-lg font-semibold transition-all duration-200 shadow-lg"
                            max={currentBid - 1}
                            min="1"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/0 to-blue-500/0 group-focus-within:from-sky-500/5 group-focus-within:to-blue-500/5 transition-all duration-200 pointer-events-none"></div>
                        </div>
                        <button
                          onClick={handleBidSubmit}
                          disabled={
                            !myBid || parseInt(myBid) >= currentBid || !isActive
                          }
                          className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-sky-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-semibold transform hover:scale-105 disabled:transform-none shadow-lg"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            ></path>
                          </svg>
                          <span>Place Bid</span>
                        </button>
                      </div>
                      {myBid && parseInt(myBid) >= currentBid && (
                        <p className="text-red-500 text-sm mt-3 animate-pulse font-medium">
                          ⚠️ Your bid must be lower than ${currentBid}
                        </p>
                      )}
                      <div className="flex justify-center space-x-6 mt-6 text-sm text-gray-500">
                        <span>💡 Tip: Bid strategically</span>
                        <span>⚡ Timer resets with each bid</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center animate-pulse shadow-xl">
                        <svg
                          className="h-16 w-16 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400/20 to-gray-600/20 animate-ping"></div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Oops! Something Went Wrong
                    </h2>
                    <p className="text-gray-600 text-lg mb-6">
                      The bidding session status is unclear. Please try again or
                      contact support.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
              <div className="backdrop-blur-xl bg-white/90 border border-sky-200/50 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Live Bid Feed
                  </h3>
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">Live</span>
                  </div>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {bidHistory.length > 0 ? (
                    memoizedBidHistory.map((bid, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-sky-50 rounded-xl border border-sky-100 hover:border-sky-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                            {bid.freelancerName?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-lg">
                              {bid.freelancerName}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {bid.time
                                ? dayjs(bid.time).fromNow()
                                : dayjs().fromNow()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-sky-600">
                            ${bid.amount}
                          </div>
                          {index === 0 && (
                            <div className="text-green-600 text-xs font-semibold">
                              LEADING
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-100 flex items-center justify-center">
                        <svg
                          className="h-8 w-8 text-sky-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">
                        No bids yet. Be the first to make a move! 🚀
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/90 border border-sky-200/50 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <svg
                    className="h-6 w-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  <h3 className="text-xl font-bold text-gray-800">
                    Active Bidders
                  </h3>
                </div>
                <div className="space-y-4">
                  {[...participantsWithFlags]
                    .sort((a, b) => (b.isMe ? 1 : 0) - (a.isMe ? 1 : 0))
                    .map((participant) => (
                      <div key={participant.freelancerId} className="group">
                        <div
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                            participant.isOnline
                              ? "bg-white border-sky-100 hover:border-sky-300 hover:shadow-md"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                                  participant.isOnline
                                    ? "bg-gradient-to-r from-sky-500 to-blue-500"
                                    : "bg-gray-400"
                                }`}
                              >
                                {participant.freelancerName
                                  ?.charAt(0)
                                  .toUpperCase() || "?"}
                              </div>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                  participant.isOnline
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              ></div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`font-semibold ${
                                    participant.isOnline
                                      ? "text-gray-800"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {participant.freelancerName}
                                </span>
                                {participant.isMe && (
                                  <span className="text-xs bg-sky-500 text-white px-2 py-1 rounded-full font-semibold">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1 mt-1">
                                <svg
                                  className="h-3 w-3 text-yellow-500 fill-current"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <span className="text-sm text-gray-500">
                                  {participant.rating}
                                </span>
                                <span
                                  className={`text-xs ml-2 font-medium ${
                                    participant.isOnline
                                      ? "text-green-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {participant.isOnline ? "Online" : "Away"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {participant.lastBid && (
                            <div className="text-right">
                              <div className="text-lg font-bold text-sky-600">
                                ${participant.lastBid}
                              </div>
                              <div className="text-xs text-green-600 font-medium">
                                Last bid
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="backdrop-blur-xl bg-white/90 border border-sky-200/50 rounded-2xl shadow-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Bidding Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Posted:</span>
                    <span className="text-gray-800 font-medium">
                      {biddingData?.createdAt
                        ? dayjs(biddingData.createdAt).fromNow()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Proposals:</span>
                    <span className="text-sky-600 font-medium">
                      {biddingData?.selectedUsers?.length || 0} received
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(14, 165, 233, 0.1);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(14, 165, 233, 0.4);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(14, 165, 233, 0.6);
          }
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
      </div>
      <Footer />
    </div>
  );
};

export default BiddingRoom;
