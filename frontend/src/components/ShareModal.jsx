import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoCheckmark, IoCopy } from 'react-icons/io5';
import { FaWhatsapp, FaFacebookMessenger, FaEnvelope, FaSms, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, restaurant, shareUrl }) => {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const upvoteCount = restaurant.upvoteCount || 0;
  const shareText = `Check out ${restaurant.name} 🍽️ - ${restaurant.cuisine || restaurant.tags?.[0] || 'Restaurant'} • 👍 ${upvoteCount} upvotes`;
  const emailSubject = `Check out ${restaurant.name} on Plateful`;
  const emailBody = `I found this amazing restaurant on Plateful!\n\n${restaurant.name}\n${restaurant.cuisine || restaurant.tags?.[0] || 'Restaurant'} • 👍 ${upvoteCount} upvotes\n\nCheck it out: ${shareUrl}`;

  const handleCopy = async () => {
    // Prevent multiple calls while copying is in progress
    if (isCopying || copied) {
      return;
    }

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!', {
        icon: '✓',
        duration: 2000,
      });
      setTimeout(() => {
        setCopied(false);
        setIsCopying(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy link');
      setIsCopying(false);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
      url: 'https://www.instagram.com/',
    },
    {
      name: 'Messenger',
      icon: FaFacebookMessenger,
      color: 'bg-blue-600',
      url: `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'X',
      icon: FaXTwitter,
      color: 'bg-black',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=Plateful,FoodReview`,
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-gray-600',
      url: `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
    },
    {
      name: 'SMS',
      icon: FaSms,
      color: 'bg-indigo-500',
      url: `sms:?&body=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    },
  ];

  const handleShare = async (option) => {
    window.open(option.url, '_blank');
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: isMobile
      ? { y: '100%', opacity: 0 }
      : { scale: 0.8, opacity: 0 },
    visible: isMobile
      ? { y: 0, opacity: 1 }
      : { scale: 1, opacity: 1 },
  };

  // Get restaurant image
  const restaurantImage = restaurant.images?.[0] || restaurant.image || 'https://via.placeholder.com/80';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1100] flex items-end md:items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Share Restaurant</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <IoClose className="text-2xl text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Restaurant Preview */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img
                  src={restaurantImage}
                  alt={restaurant.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.cuisine || restaurant.tags?.[0] || 'Restaurant'}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{restaurant.rating || 'N/A'}/5</span>
                  </div>
                </div>
              </div>

              {/* Social Share Options */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Share via</h3>
                <div className="grid grid-cols-3 gap-4">
                  {shareOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => handleShare(option)}
                      className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      <div className={`${option.color} w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg`}>
                        <option.icon className="text-2xl" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Copy Link */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Or copy link</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700"
                  />
                  <button
                    onClick={handleCopy}
                    disabled={isCopying || copied}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${copied
                      ? 'bg-green-500 text-white'
                      : isCopying
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                      }`}
                  >
                    {copied ? (
                      <>
                        <IoCheckmark className="text-xl" />
                        Copied
                      </>
                    ) : (
                      <>
                        <IoCopy className="text-xl" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Scan QR Code</h3>
                <div className="flex justify-center p-6 bg-white border-2 border-gray-200 rounded-xl">
                  <QRCode value={shareUrl} size={180} />
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Scan with your phone to share instantly
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
