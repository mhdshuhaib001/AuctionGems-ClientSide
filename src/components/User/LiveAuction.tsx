// import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';
// import { Image } from '@nextui-org/react';
// import { useSelector } from 'react-redux';
// import { io } from 'socket.io-client';
// import toast from 'react-hot-toast';

// import { useGetProductByIdQuery } from '../../services/apis/productApi';
// import { useGetAuctionByIdQuery, usePlaceBidMutation, useCheckAuctionWinnerMutation } from '../../services/apis/auctionApi';
// import { RootState } from '../../store/Store';
// import SellerProfileCard from '../Seller/SellerProfileCard';
// import AuctionSkelton from '../commen/Skelton/AuctionSkelton';
// import { useAuctionTimer } from '../../utils/hooks/useAuctionTimer';

// type Bid = {
//   id?: string;
//   bidder: string;
//   amount: number;
//   time: Date | string;
//   avatar: string | undefined;
// };

// export default function RealTimeBidding() {
//   const userData = useSelector((state: RootState) => state.User);
//   const userId = userData._id;
//   const { id } = useParams<{ id: string }>();

//   // Queries and Mutations
//   const { data, error, isLoading } = useGetProductByIdQuery(id);
//   const { data: auctionData } = useGetAuctionByIdQuery(id);
//   const [placeBid] = usePlaceBidMutation();
//   const [getWinner] = useCheckAuctionWinnerMutation();

//   // State Management
//   const [customBid, setCustomBid] = useState('');
//   const [currentBid, setCurrentBid] = useState(0);
//   const [bids, setBids] = useState<Bid[]>([]);
//   const [quickBids, setQuickBids] = useState<number[]>([]);
//   const [isPlacingBid, setIsPlacingBid] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');

//   // Refs and Socket
//   const socketRef = useRef<any>(null);

//   // Destructure data
//   const { productData, sellerData: sellerProfile } = data || {};

//   const handleCheckWinner = useCallback(async () => {
//     try {
//       const response = await getWinner(id).unwrap();

//       // Notify all users about auction end
//       if (socketRef.current) {
//         socketRef.current.emit('auction_ended', {
//           auctionId: id,
//           winner: response.winnerId,
//           amount: response.winningBid
//         });
//       }

//       // Show different messages for winner and other participants
//       if (response.winnerId === userId) {
//         toast.success(`Congratulations! You've won the auction with a bid of $${response.winningBid}!`);
//         setModalMessage(`Congratulations! You've won the auction with a bid of $${response.winningBid}!`);
//       } else {
//         toast.success(`The auction has ended. The winning bid was $${response.winningBid}.`);
//         setModalMessage(`The auction has ended. The winning bid was $${response.winningBid}.`);
//       }
//       setIsModalOpen(true);

//     } catch (error) {
//       console.error('Error determining auction winner:', error);
//       toast.error('An error occurred while determining the auction winner.');
//       setModalMessage('An error occurred while determining the auction winner.');
//       setIsModalOpen(true);
//     }
//   }, [id, userId, getWinner]);

//   const { timeLeft, isEnded } = useAuctionTimer({
//     endDateTime: productData?.auctionEndDateTime || new Date(),
//     onTimeEnd: handleCheckWinner
//   });

//   useEffect(() => {
//     if (isEnded && productData) {
//       // Disable bidding UI
//       setIsPlacingBid(true);

//       // Show auction ended message
//       toast.error('This auction has ended');

//       // Automatically check winner if not already checked
//       handleCheckWinner();
//     }
//   }, [isEnded, productData, handleCheckWinner]);

//   // Generate Quick Bids
//   const generateQuickBids = useCallback((currentBidValue: number) => {
//     const increment = 10;
//     return [
//       currentBidValue + increment * 1,
//       currentBidValue + increment * 2,
//       currentBidValue + increment * 3,
//       currentBidValue + increment * 4,
//     ];
//   }, []);

//   // Socket Connection Effect
//   useEffect(() => {
//     const socket = io('http://localhost:8001');
//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log('Connected to socket');
//       socket.emit('join_auction', id, userId);
//     });

//     socket.on('new_bid', (newBid: any) => {
//       try {
//         const updatedBid: Bid = {
//           ...newBid,
//           time: new Date(),
//           avatar: newBid.avatar,
//         };
//         const updatedBids = [updatedBid, ...bids]
//           .sort((a, b) => b.amount - a.amount)
//           .slice(0, 5);

//         setBids(updatedBids);
//         setCurrentBid(updatedBids[0].amount);
//       } catch (error) {
//         console.log('socket error:', error);
//       }
//     });

//     socket.on('auctionEnded', (data) => {
//       if (data.winner === userId) {
//         setModalMessage(`Congratulations! You have won the auction for $${data.amount}!`);
//         setIsModalOpen(true);
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [id, userId, bids]);

//   // Initialize Current Bid and Quick Bids
//   useEffect(() => {
//     if (productData) {
//       const initialBid = productData.reservePrice;
//       setCurrentBid(initialBid);
//       setQuickBids(generateQuickBids(initialBid));
//     }
//   }, [productData, generateQuickBids]);

//   // Initialize Bids from Auction Data
//   useEffect(() => {
//     if (Array.isArray(auctionData)) {
//       const fetchedBids = auctionData.map((bid: any) => ({
//         id: bid.id,
//         bidder: bid.bidder,
//         amount: bid.amount,
//         time: new Date(bid.time),
//         avatar: bid.avatar || 'default_avatar_url',
//       }));

//       const sortedBids = fetchedBids.sort((a, b) => b.amount - a.amount).slice(0, 5);

//       setBids(sortedBids);
//       if (sortedBids.length > 0) {
//         setCurrentBid(sortedBids[0].amount);
//       }
//     }
//   }, [auctionData]);

//   // Bid Handlers
//   const handleBid = async (amount: number) => {
//     if (!socketRef.current) {
//       console.error('Socket is not initialized.');
//       return;
//     }

//     if (amount <= currentBid) {
//       toast.error('Your bid must be greater than the current bid.');
//       setModalMessage('Your bid must be greater than the current bid.');
//       setIsModalOpen(true);
//       return;
//     }

//     setIsPlacingBid(true);

//     try {
//       socketRef.current.emit('place_bid', {
//         auctionId: id,
//         bidder: userData.name,
//         amount: amount,
//         time: new Date(),
//         avatar: userData.profileImage,
//       });

//       await placeBid({
//         auctionId: id,
//         bidderId: userId,
//         currentBid: currentBid,
//         bidAmount: amount,
//         time: new Date(),
//         sellerId: sellerProfile?.sellerId,
//       }).unwrap();

//       const updatedBid: Bid = {
//         bidder: userData.name,
//         amount,
//         time: new Date(),
//         avatar: userData.profileImage || 'default_avatar',
//       };

//       const updatedBids = [updatedBid, ...bids].sort((a, b) => b.amount - a.amount);
//       setBids(updatedBids);
//       setCurrentBid(updatedBids[0].amount);
//     } catch (error) {
//       console.error('Failed to place bid:', error);
//       setModalMessage('An error occurred while placing your bid. Please try again.');
//       setIsModalOpen(true);
//     } finally {
//       setIsPlacingBid(false);
//     }
//   };

//   const handleCustomBid = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const bid = parseFloat(customBid);
//     setCustomBid('');

//     if (isNaN(bid) || bid <= currentBid) {
//       toast.error('Your bid must be a valid number greater than the current bid.');
//       setModalMessage('Your bid must be a valid number greater than the current bid.');
//       setIsModalOpen(true);
//       return;
//     }

//     await handleBid(bid);
//   };

//   // Render Loading or Error States
//   if (isLoading) return <AuctionSkelton />;
//   if (error) return <div>Error loading product data.</div>;
//   if (!productData) return <div>No product data found.</div>;

//   return (
//     <div className="container mx-auto px-4 py-8 font-serif">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="space-y-4">
//           <div className="aspect-w-1 aspect-h-1">
//             <Image
//               isBlurred
//               width={240}
//               height={240}
//               src={productData.images[0]}
//               alt="Product Image"
//               className="m-5"
//             />
//           </div>
//           <h1 className="text-2xl font-bold">{productData.itemTitle}</h1>
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-gray-600">Start Price:</p>
//               <p className="text-xl font-semibold">$ {productData.reservePrice}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Current Price:</p>
//               <p className="text-2xl font-bold text-green-600">$ {currentBid.toFixed(2)}</p>
//             </div>
//           </div>
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <div className="grid grid-cols-4 gap-4 text-center">
//               <div>
//                 <div className="text-3xl font-bold">{timeLeft.days}</div>
//                 <div className="text-sm text-gray-600">Days</div>
//               </div>
//               <div>
//                 <div className="text-3xl font-bold">{timeLeft.hours}</div>
//                 <div className="text-sm text-gray-600">Hours</div>
//               </div>
//               <div>
//                 <div className="text-3xl font-bold">{timeLeft.minutes}</div>
//                 <div className="text-sm text-gray-600">Minutes</div>
//               </div>
//               <div>
//                 <div className="text-3xl font-bold">{timeLeft.seconds}</div>
//                 <div className="text-sm text-gray-600">Seconds</div>
//               </div>
//             </div>
//             <p className="text-center mt-2 text-sm text-gray-600">
//               Ending On:{' '}
//               {new Date(productData.auctionEndDateTime).toLocaleDateString(undefined, {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//               })}{' '}
//               ,{' '}
//               {new Date(productData.auctionEndDateTime).toLocaleTimeString(undefined, {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true,
//               })}
//             </p>
//           </div>
//         </div>
//         <div className="space-y-4">
//           <SellerProfileCard
//             sellerName={sellerProfile?.companyName}
//             profileImage={sellerProfile?.profile}
//             id={sellerProfile?.sellerId}
//           />

//           <div className="bg-orange-100  rounded-lg p-4">
//             <h3 className="text-lg font-semibold mb-4">Bidding Leader</h3>

//             {bids.length > 0 ? (
//               <div className="space-y-4">
//                 {bids.map((bid) => (
//                   <div key={bid.id} className="flex items-center space-x-3">
//                     <Image
//                       src={bid.avatar}
//                       alt={bid.bidder}
//                       width={40}
//                       height={40}
//                       className="rounded-full"
//                     />
//                     <div className="flex-grow">
//                       <p className="font-semibold">{bid.bidder}</p>
//                       <p className="text-sm text-gray-600">
//                         {new Date(bid.time).toLocaleTimeString()} for{' '}
//                         {bid.amount ? bid.amount.toFixed(2) : '0.00'}$
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex justify-center items-center">
//                 <p className="text-gray-600 text-center">Be the first to start the bidding!</p>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-4 gap-2">
//             {quickBids.map((bid) => (
//               <button
//                 key={bid}
//                 onClick={() => handleBid(bid)}
//                 className="bg-amber-100 text-amber-950 py-2 rounded-lg hover:bg-amber-200 transition duration-300"
//               >
//                 $ {bid}
//               </button>
//             ))}
//           </div>
//           <form onSubmit={handleCustomBid} className="flex space-x-2">
//             <input
//               type="number"
//               value={customBid}
//               onChange={(e) => setCustomBid(e.target.value)}
//               placeholder="Enter your bid"
//               className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//             />
//             <button
//               type="submit"
//               className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-500 border-amber-200 transition duration-300"
//             >
//               <ChevronRight className="w-6 h-6" />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Image } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

import { useGetProductByIdQuery } from '../../services/apis/productApi';
import {
  useGetAuctionByIdQuery,
  usePlaceBidMutation,
  useCheckAuctionWinnerMutation,
} from '../../services/apis/auctionApi';
import { RootState } from '../../store/Store';
import SellerProfileCard from '../Seller/SellerProfileCard';
import AuctionSkelton from '../commen/Skelton/AuctionSkelton';
import { useAuctionTimer } from '../../utils/hooks/useAuctionTimer';
import AuctionResultModal from '../commen/AuctionResultModal';

type Bid = {
  id?: string;
  bidder: string;
  amount: number;
  time: Date | string;
  avatar: string | undefined;
};

export default function RealTimeBidding() {
  const userData = useSelector((state: RootState) => state.User);
  const userId = userData._id;
  const { id } = useParams<{ id: string }>();

  // Queries and Mutations
  const { data, error, isLoading } = useGetProductByIdQuery(id);
  const { data: auctionData } = useGetAuctionByIdQuery(id);
  const [placeBid] = usePlaceBidMutation();
  console.log(auctionData, 'bid dataaaaaaaaaaaaaaa');

  const [customBid, setCustomBid] = useState('');
  const [currentBid, setCurrentBid] = useState(0);
  const [bids, setBids] = useState<Bid[]>([]);
  const [quickBids, setQuickBids] = useState<number[]>([]);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [winnerDetails, setWinnerDetails] = useState<{
    winnerId: string;
    winningBid: number;
    productTitle: string;
    checkoutLink: string;
  } | null>(null);
  const isBiddingDisabled = () => {
    return isAuctionEnded || isPlacingBid || isEnded;
  };
  // Refs and Socket
  const socketRef = useRef<any>(null);

  const { productData, sellerData: sellerProfile } = data || {};
  useEffect(() => {
    if (productData?.auctionEndDateTime) {
      const endTime = new Date(productData.auctionEndDateTime).getTime();
      const now = new Date().getTime();
      if (now >= endTime) {
        setIsAuctionEnded(true);
      }
    }
  }, [productData]);

  const { timeLeft, isEnded } = useAuctionTimer({
    endDateTime: productData?.auctionEndDateTime || new Date(),
  });

  // Generate Quick Bids
  const generateQuickBids = useCallback((currentBidValue: number) => {
    const increment = 10;
    return [
      currentBidValue + increment * 1,
      currentBidValue + increment * 2,
      currentBidValue + increment * 3,
      currentBidValue + increment * 4,
    ];
  }, []);

  // Socket Connection Effect
  useEffect(() => {
    const socket = io('http://localhost:8001');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('join_auction', id, userId);
    });

    socket.on('new_bid', (newBid: any) => {
      try {
        const updatedBid: Bid = {
          ...newBid,
          time: new Date(),
          avatar: newBid.avatar,
        };
        const updatedBids = [updatedBid, ...bids].sort((a, b) => b.amount - a.amount).slice(0, 5);

        setBids(updatedBids);
        setCurrentBid(updatedBids[0].amount);
      } catch (error) {
        console.log('socket error:', error);
      }
    });

    socket.on('auction_winner', (data) => {
      console.log('Received winner notification:', data);
      if (data.winnerId === userId) {
        toast.success('Congratulations! You won the auction!', {
          duration: 5000,
          position: 'top-center',
        });
      } else {
        toast.success(`The auction has ended. Winning bid: $${data.winningBid}`, {
          duration: 5000,
          position: 'top-center',
        });
      }

      setIsAuctionEnded(true);
      setWinnerDetails(data);
      setIsModalOpen(true);
    });

    return () => {
      socket.emit('leave_auction', id, userId);
      socket.disconnect();
    };
  }, [id, userId, bids]);

  useEffect(() => {
    if (productData) {
      const initialBid =
        productData.currentBid !== null ? productData.currentBid : productData.reservePrice;
      setCurrentBid(initialBid);
      setQuickBids(generateQuickBids(initialBid));
    }
  }, [productData, generateQuickBids]);

  // Initialize Bids from Auction Data
  useEffect(() => {
    if (Array.isArray(auctionData)) {
      const fetchedBids = auctionData.map((bid: any) => ({
        id: bid.id,
        bidder: bid.bidder,
        amount: bid.amount,
        time: new Date(bid.time),
        avatar: bid.avatar || 'default_avatar_url',
      }));

      const sortedBids = fetchedBids.sort((a, b) => b.amount - a.amount).slice(0, 5);

      setBids(sortedBids);
      if (sortedBids.length > 0) {
        setCurrentBid(sortedBids[0].amount);
      }
    }
  }, [auctionData]);

  // Bid Handlers
  const handleBid = async (amount: number) => {
    if (!socketRef.current) {
      console.error('Socket is not initialized.');
      return;
    }

    if (amount <= currentBid) {
      toast.error('Your bid must be greater than the current bid.');
      setModalMessage('Your bid must be greater than the current bid.');
      setIsModalOpen(true);
      return;
    }

    setIsPlacingBid(true);

    try {
      socketRef.current.emit('place_bid', {
        auctionId: id,
        bidder: userData.name,
        amount: amount,
        time: new Date(),
        avatar: userData.profileImage,
      });

      await placeBid({
        auctionId: id,
        bidderId: userId,
        currentBid: currentBid,
        bidAmount: amount,
        time: new Date(),
        sellerId: sellerProfile?.sellerId,
      }).unwrap();

      const updatedBid: Bid = {
        bidder: userData.name,
        amount,
        time: new Date(),
        avatar: userData.profileImage || 'default_avatar',
      };

      const updatedBids = [updatedBid, ...bids].sort((a, b) => b.amount - a.amount);
      setBids(updatedBids);
      setCurrentBid(updatedBids[0].amount);
    } catch (error) {
      console.error('Failed to place bid:', error);
      setModalMessage('An error occurred while placing your bid. Please try again.');
      setIsModalOpen(true);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleCustomBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const bid = parseFloat(customBid);
    setCustomBid('');

    if (isNaN(bid) || bid <= currentBid) {
      toast.error('Your bid must be a valid number greater than the current bid.');
      setModalMessage('Your bid must be a valid number greater than the current bid.');
      setIsModalOpen(true);
      return;
    }

    await handleBid(bid);
  };

  // Render Loading or Error States
  if (isLoading) return <AuctionSkelton />;
  if (error) return <div>Error loading product data.</div>;
  if (!productData) return <div>No product data found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 font-serif">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1">
            <Image
              isBlurred
              width={240}
              height={240}
              src={productData.images[0]}
              alt="Product Image"
              className="m-5"
            />
          </div>
          <h1 className="text-2xl font-bold">{productData.itemTitle}</h1>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Start Price:</p>
              <p className="text-xl font-semibold">$ {productData.reservePrice}</p>
            </div>
            <div>
              <p className="text-gray-600">Current Price:</p>
              <p className="text-2xl font-bold text-green-600">
                $ {currentBid || productData.reservePrice}
              </p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">{timeLeft.days}</div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{timeLeft.hours}</div>
                <div className="text-sm text-gray-600">Hours</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                <div className="text-sm text-gray-600">Seconds</div>
              </div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">
              Ending On:{' '}
              {new Date(productData.auctionEndDateTime).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              ,{' '}
              {new Date(productData.auctionEndDateTime).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <SellerProfileCard
            sellerName={sellerProfile?.companyName}
            profileImage={sellerProfile?.profile}
            id={sellerProfile?.sellerId}
          />

          <div className="bg-orange-100  rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Bidding Leader</h3>

            {bids.length > 0 ? (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid.id} className="flex items-center space-x-3">
                    <Image
                      src={bid.avatar}
                      alt={bid.bidder}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{bid.bidder}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(bid.time).toLocaleTimeString()} for{' '}
                        {bid.amount ? bid.amount.toFixed(2) : '0.00'}$
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <p className="text-gray-600 text-center">Be the first to start the bidding!</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {quickBids.map((bid) => (
              <button
                key={bid}
                onClick={() => handleBid(bid)}
                className="bg-amber-100 text-amber-950 py-2 rounded-lg hover:bg-amber-200 transition duration-300"
              >
                $ {bid}
              </button>
            ))}
          </div>
          <form onSubmit={handleCustomBid} className="flex space-x-2">
            <input
              type="number"
              value={customBid}
              disabled={isBiddingDisabled()}
              onChange={(e) => setCustomBid(e.target.value)}
              placeholder="Enter your bid"
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              type="submit"
              className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-500 border-amber-200 transition duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
      <AuctionResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isWinner={winnerDetails?.winnerId === userId}
        productTitle={productData?.itemTitle}
        winningBid={winnerDetails?.winningBid || 0}
        checkoutLink={winnerDetails?.checkoutLink || ''}
      />
    </div>
  );
}