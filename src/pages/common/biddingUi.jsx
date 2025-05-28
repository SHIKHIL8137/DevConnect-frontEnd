import React, { useState, useEffect } from 'react';
import { Clock, Users, DollarSign, Trophy, AlertCircle, Send, Zap, Star, Eye } from 'lucide-react';

const BiddingRoom = () => {
  const [timer, setTimer] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [currentBid, setCurrentBid] = useState(500);
  const [myBid, setMyBid] = useState('');
  const [biddingStarted, setBiddingStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [roomCanceled, setRoomCanceled] = useState(false);
  const [initialTimer, setInitialTimer] = useState(60);
  const [pulseEffect, setPulseEffect] = useState(false);

  const project = {
    title: "E-commerce Website Development",
    description: "Looking for an experienced developer to build a modern e-commerce platform with React and Node.js",
    startingPrice: 500,
    client: "TechCorp Solutions",
    budget: "2000-5000",
    duration: "3-4 weeks"
  };

  const participants = [
    { id: 1, name: "Alex Johnson", avatar: "AJ", rating: 4.9, lastBid: null, isMe: true, country: "🇺🇸", online: true },
    { id: 2, name: "Sarah Chen", avatar: "SC", rating: 4.8, lastBid: 480, country: "🇨🇦", online: true },
    { id: 3, name: "Mike Rodriguez", avatar: "MR", rating: 4.7, lastBid: null, country: "🇪🇸", online: true },
    { id: 4, name: "Emma Wilson", avatar: "EW", rating: 4.9, lastBid: null, country: "🇬🇧", online: false }
  ];

  const [bidHistory, setBidHistory] = useState([
    { freelancer: "Sarah Chen", amount: 480, time: "2 seconds ago", avatar: "SC" }
  ]);

  useEffect(() => {
    if (!biddingStarted && initialTimer > 0) {
      const interval = setInterval(() => {
        setInitialTimer(prev => {
          if (prev <= 1) {
            setBiddingStarted(true);
            setIsActive(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [initialTimer, biddingStarted]);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => {
          if (timer <= 5) setPulseEffect(true);
          if (timer <= 1) {
            setIsActive(false);
            setPulseEffect(false);
            const lastBid = bidHistory[bidHistory.length - 1];
            if (lastBid) {
              setWinner(lastBid.freelancer);
            } else if (bidHistory.length === 0) {
              setRoomCanceled(true);
            }
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    } else if (!isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer, bidHistory]);

  const handleBidSubmit = () => {
    if (myBid && parseInt(myBid) < currentBid && isActive) {
      const newBid = {
        freelancer: "Alex Johnson",
        amount: parseInt(myBid),
        time: "Just now",
        avatar: "AJ"
      };
      setBidHistory([...bidHistory, newBid]);
      setCurrentBid(parseInt(myBid));
      setMyBid('');
      setTimer(20);
      setPulseEffect(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-200/30 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Glassmorphism Header */}
        <div className="backdrop-blur-xl bg-white/80 border border-sky-200/50 rounded-2xl shadow-2xl mb-8 p-8">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 text-sm font-semibold">LIVE BIDDING</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
              <p className="text-sky-700 text-lg font-medium">Client: {project.client}</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                <span>💰 Budget: ${project.budget}</span>
                <span>⏱️ Duration: {project.duration}</span>
              </div>
            </div>
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  ${project.startingPrice}
                </div>
                <div className="text-gray-500 text-sm mt-1">Starting Price</div>
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
          {/* Main Bidding Panel */}
          <div className="xl:col-span-3 space-y-8">

            <div className={`backdrop-blur-xl bg-white/90 border border-sky-200/50 rounded-2xl shadow-2xl p-8 transition-all duration-500 ${pulseEffect ? 'ring-4 ring-red-400/50 animate-pulse' : ''}`}>
              {!biddingStarted ? (
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center animate-spin-slow shadow-xl">
                      <Clock className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Get Ready to Bid!</h2>
                  <div className={`text-6xl font-bold mb-6 transition-colors duration-300 ${initialTimer <= 10 ? 'text-red-500 animate-pulse' : 'text-sky-600'}`}>
                    {formatTime(initialTimer)}
                  </div>
                  <p className="text-gray-600 text-lg">Bidding starts automatically when timer reaches zero</p>
                  <div className="flex justify-center space-x-8 mt-8">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span>Fast-paced bidding</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Eye className="h-5 w-5 text-green-500" />
                      <span>Real-time updates</span>
                    </div>
                  </div>
                </div>
              ) : winner ? (
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center animate-bounce shadow-xl">
                      <Trophy className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-ping"></div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 We Have a Winner! 🎉</h2>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-6">
                    <p className="text-2xl font-bold text-yellow-600 mb-2">{winner}</p>
                    <p className="text-gray-800 text-xl">Winning Bid: <span className="text-green-600 font-bold">${currentBid}</span></p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
                      View Contract
                    </button>
                    <button className="bg-sky-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-sky-600 transition-all duration-200 shadow-lg">
                      Message Winner
                    </button>
                  </div>
                </div>
              ) : roomCanceled ? (
                <div className="text-center">
                  <AlertCircle className="mx-auto h-24 w-24 text-red-500 mb-6" />
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Bidding Session Ended</h2>
                  <p className="text-gray-600 text-lg mb-8">No bids were placed within the time limit</p>
                  <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Start New Bidding Session
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-12 mb-8">
                    <div className="text-center">
                      <div className={`text-6xl font-bold mb-2 transition-all duration-300 ${timer <= 5 ? 'text-red-500 animate-pulse scale-110' : 'text-sky-600'}`}>
                        {timer}s
                      </div>
                      <div className="text-gray-500">Time Remaining</div>
                      <div className="w-24 h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 rounded-full ${timer <= 5 ? 'bg-red-500' : 'bg-sky-500'}`}
                          style={{ width: `${(timer / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-px h-24 bg-gray-300"></div>
                    <div className="text-center">
                      <div className="text-6xl font-bold text-green-600 mb-2">${currentBid}</div>
                      <div className="text-gray-500">Current Lowest Bid</div>
                      <div className="text-green-600 text-sm mt-1 animate-pulse font-semibold">🔥 Leading</div>
                    </div>
                  </div>
                  
                  {/* Enhanced Bid Input */}
                  <div className="max-w-md mx-auto">
                    <div className="flex space-x-3">
                      <div className="flex-1 relative group">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                        <input
                          type="number"
                          value={myBid}
                          onChange={(e) => setMyBid(e.target.value)}
                          placeholder="Enter your bid"
                          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-lg font-semibold transition-all duration-200 shadow-lg"
                          max={currentBid - 1}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/0 to-blue-500/0 group-focus-within:from-sky-500/5 group-focus-within:to-blue-500/5 transition-all duration-200 pointer-events-none"></div>
                      </div>
                      <button
                        onClick={handleBidSubmit}
                        disabled={!myBid || parseInt(myBid) >= currentBid || !isActive}
                        className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-sky-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-semibold transform hover:scale-105 disabled:transform-none shadow-lg"
                      >
                        <Send className="h-5 w-5" />
                        <span>Place Bid</span>
                      </button>
                    </div>
                    
                    {myBid && parseInt(myBid) >= currentBid && (
                      <p className="text-red-500 text-sm mt-3 animate-pulse font-medium">⚠️ Your bid must be lower than ${currentBid}</p>
                    )}
                    
                    <div className="flex justify-center space-x-6 mt-6 text-sm text-gray-500">
                      <span>💡 Tip: Bid strategically</span>
                      <span>⚡ Timer resets with each bid</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Bid History */}
            <div className="backdrop-blur-xl bg-white/90 border border-sky-200/50 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Live Bid Feed</h3>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Live</span>
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {bidHistory.length > 0 ? (
                  bidHistory.slice().reverse().map((bid, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-sky-50 rounded-xl border border-sky-100 hover:border-sky-300 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                          {bid.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-lg">{bid.freelancer}</div>
                          <div className="text-gray-500 text-sm">{bid.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-sky-600">${bid.amount}</div>
                        {index === 0 && <div className="text-green-600 text-xs font-semibold">LEADING</div>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-100 flex items-center justify-center">
                      <DollarSign className="h-8 w-8 text-sky-500" />
                    </div>
                    <p className="text-gray-500 text-lg">No bids yet. Be the first to make a move! 🚀</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/90 border border-sky-200/50 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="h-6 w-6 text-sky-600" />
                <h3 className="text-xl font-bold text-gray-800">Active Bidders</h3>
              </div>
              
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div key={participant.id} className="group">
                    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${participant.online ? 'bg-white border-sky-100 hover:border-sky-300 hover:shadow-md' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${participant.online ? 'bg-gradient-to-r from-sky-500 to-blue-500' : 'bg-gray-400'}`}>
                            {participant.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${participant.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold ${participant.online ? 'text-gray-800' : 'text-gray-500'}`}>
                              {participant.name}
                            </span>
                            <span className="text-sm">{participant.country}</span>
                            {participant.isMe && (
                              <span className="text-xs bg-sky-500 text-white px-2 py-1 rounded-full font-semibold">YOU</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-500">{participant.rating}</span>
                            <span className={`text-xs ml-2 font-medium ${participant.online ? 'text-green-600' : 'text-gray-400'}`}>
                              {participant.online ? 'Online' : 'Away'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {participant.lastBid && (
                        <div className="text-right">
                          <div className="text-lg font-bold text-sky-600">${participant.lastBid}</div>
                          <div className="text-xs text-green-600 font-medium">Last bid</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="backdrop-blur-xl bg-white/90 border border-sky-200/50 rounded-2xl shadow-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Project Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-800 font-medium">Web Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Skills:</span>
                  <span className="text-gray-800 font-medium">React, Node.js</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Posted:</span>
                  <span className="text-gray-800 font-medium">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Proposals:</span>
                  <span className="text-sky-600 font-medium">12 received</span>
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
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BiddingRoom;