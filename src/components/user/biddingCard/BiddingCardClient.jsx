import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Clock, 
  Users, 
  Trophy, 
  Calendar, 
  Plus, 
  X, 
  AlertCircle,
  DollarSign,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { getBiddings } from '../../../apis/biddingApi';
import { updateProjectDeadLine } from '../../../apis/projectApi';
import { toast } from 'sonner';

const BiddingRoomSection = ({ projectId, project }) => {
  const [biddingRooms, setBiddingRooms] = useState([]);
  const [showRecreateModal, setShowRecreateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [recreateLoading, setRecreateLoading] = useState(false);
  const [inputError, setInputError] = useState('');


  const [recreateData, setRecreateData] = useState({
    startTime: '',
  });

  const fetchBiddings=async()=>{
    try {
      const response = await getBiddings(projectId);
      setBiddingRooms(response.data?.data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchBiddings();
  }, [projectId, project]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      waiting: { color: 'bg-yellow-100 text-yellow-800', text: 'Waiting' },
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.waiting;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };


  const getMinDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; 
};

const handleRecreateRoom = async () => {
  if (!selectedRoom) return;

  const minDate = getMinDate();
  if (!recreateData.startTime || recreateData.startTime < minDate) {
    const msg = `Start time must be today or later (Min: ${minDate})`;
    setInputError(msg);
    toast.error(msg);
    return;
  }

  setInputError('');
  setRecreateLoading(true);
  try {
    const response = await updateProjectDeadLine(projectId, {
      biddingDeadline: recreateData.startTime,
    });

    console.log('Bidding room recreated:', response.data);
    setShowRecreateModal(false);
    setSelectedRoom(null);
    setRecreateData({ startTime: '' });
    fetchBiddings();
  } catch (error) {
    console.error('Error recreating bidding room:', error);
  } finally {
    setRecreateLoading(false);
  }
};


  const openRecreateModal = (room) => {
    setSelectedRoom(room);
    setShowRecreateModal(true);
  };

  const BiddingCard = ({ room }) => {
    const [showBids, setShowBids] = useState(false);
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Bidding Room #{room._id.slice(-6)}
            </h3>
            <p className="text-sm text-gray-500">
              Created: {formatDateTime(room.createdAt)}
            </p>
          </div>
          {getStatusBadge(room.status)}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-xs text-gray-500">Starting Price</p>
            <p className="font-semibold">{formatCurrency(room.startingPrice)}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-gray-500">Current/Final</p>
            <p className="font-semibold text-green-600">{formatCurrency(room.currentPrice)}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500">Participants</p>
            <p className="font-semibold">{room.participants.length}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-semibold">
              {room?.duration} days
            </p>
          </div>
        </div>

        {room.winner && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-900">Winner</p>
                <p className="text-sm text-green-700">
                  {room.winner.freelancerName} - {formatCurrency(room.winner.amount)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowBids(!showBids)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showBids ? 'Hide Bids' : `View Bids (${room.bids.length})`}
          </button>
          
          {room.status === 'cancelled' && (
            <button
              onClick={() => openRecreateModal(room)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Recreate
            </button>
          )}
        </div>

        {showBids && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Bidding History</h4>
            <div className="max-h-48 overflow-y-auto">
              {room.bids.length > 0 ? (
                <div className="space-y-2">
                  {room.bids.map((bid, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{bid.freelancerName}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(bid.time)}</p>
                      </div>
                      <p className="font-semibold text-green-600">{formatCurrency(bid.amount)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No bids yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };


  const RecreateRoomModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recreate Bidding Room</h3>
          <button
            onClick={() => {
              setShowRecreateModal(false);
              setSelectedRoom(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {selectedRoom && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Recreating Room #{selectedRoom._id.slice(-6)}
            </p>
            <p className="text-sm text-gray-500">
              Original Starting Price: {formatCurrency(selectedRoom.startingPrice)}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={recreateData.startTime}
              onChange={(e) => setRecreateData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowRecreateModal(false);
              setSelectedRoom(null);
              setRecreateData({ startTime: ''});
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleRecreateRoom}
            disabled={recreateLoading || !recreateData.startTime }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {recreateLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Recreating...
              </>
            ) : (
              'Recreate Room'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Bidding Rooms ({biddingRooms.length})
        </h2>

      </div>

      {biddingRooms.length > 0 ? (
        <div className="space-y-4">
          {biddingRooms.map((room) => (
            <BiddingCard key={room._id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Bidding Rooms</h3>
        </div>
      )}
      {showRecreateModal && <RecreateRoomModal />}
    </div>
  );
};

export default BiddingRoomSection;