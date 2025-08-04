import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  QrCodeScanner as ScannerIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

// Add global styles for html5-qrcode
const qrStyles = `
  #qr-reader video {
    width: 100% !important;
    height: auto !important;
    border-radius: 8px;
  }
  
  #qr-reader canvas {
    display: none !important;
  }
  
  #qr-reader__header_message {
    display: none !important;
  }
  
  #qr-reader__scan_region {
    border: 2px solid #3b82f6 !important;
    border-radius: 8px !important;
  }
  
  #qr-reader__dashboard {
    margin-top: 10px !important;
  }
  
  #qr-reader__dashboard_section {
    background: #f8fafc !important;
    border-radius: 6px !important;
    padding: 8px !important;
  }
`;

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');
  const [attendeeInfo, setAttendeeInfo] = useState(null);
  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [cameraStatus, setCameraStatus] = useState(''); // loading, ready, error
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const html5QrcodeRef = useRef(null);

  useEffect(() => {
    // Inject styles for html5-qrcode
    const styleElement = document.createElement('style');
    styleElement.textContent = qrStyles;
    document.head.appendChild(styleElement);
    
    // Get available cameras on mount
    getCameras();
    
    return () => {
      // Cleanup scanner on unmount
      if (html5QrcodeRef.current) {
        html5QrcodeRef.current.stop().catch(console.error);
      }
      
      // Remove injected styles
      document.head.removeChild(styleElement);
    };
  }, []);

  const getCameras = async () => {
    try {
      console.log('Getting available cameras...');
      const devices = await Html5Qrcode.getCameras();
      console.log('Available cameras:', devices);
      setCameras(devices);
      
      // Select environment camera (back camera) if available
      const environmentCamera = devices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('environment')
      );
      
      const selectedCameraId = environmentCamera ? environmentCamera.id : devices[0]?.id || '';
      console.log('Selected camera:', selectedCameraId);
      setSelectedCamera(selectedCameraId);
    } catch (error) {
      console.error('Error getting cameras:', error);
      setScanError('Failed to detect cameras. Please check camera permissions.');
    }
  };

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setCameraStatus('loading');
      setScanResult(null);
      setScanError('');
      setAttendeeInfo(null);

      if (!selectedCamera) {
        throw new Error('No camera selected');
      }

      // Wait for DOM element to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if element exists
      const element = document.getElementById("qr-reader");
      if (!element) {
        throw new Error('Scanner element not found in DOM');
      }

      // Initialize Html5Qrcode
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrcodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      console.log('Starting camera with ID:', selectedCamera);
      
      // Start scanning
      await html5QrCode.start(
        selectedCamera,
        config,
        onScanSuccess,
        onScanFailure
      );
      
      setCameraStatus('ready');
      console.log('QR Scanner started successfully');
      
      // Debug: Check what elements were created
      setTimeout(() => {
        const qrReaderElement = document.getElementById('qr-reader');
        console.log('QR Reader element:', qrReaderElement);
        console.log('QR Reader children:', qrReaderElement?.children);
        const video = qrReaderElement?.querySelector('video');
        console.log('Video element:', video);
        if (video) {
          console.log('Video dimensions:', {
            width: video.videoWidth,
            height: video.videoHeight,
            clientWidth: video.clientWidth,
            clientHeight: video.clientHeight
          });
        }
      }, 1000);

    } catch (error) {
      console.error('Camera start error:', error);
      setCameraStatus('error');
      
      let errorMessage = 'Failed to start camera';
      
      if (error.message && error.message.includes('not found')) {
        errorMessage = 'Scanner element not ready. Please try again.';
      } else if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Camera not found. Please check if your device has a camera.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported by this browser. Please use a modern browser.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setScanError(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (html5QrcodeRef.current) {
      try {
        await html5QrcodeRef.current.stop();
        html5QrcodeRef.current = null;
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
    setIsScanning(false);
    setCameraStatus('');
    setScanError('');
  };

  const onScanSuccess = async (decodedText, decodedResult) => {
    console.log(`QR Code scanned: ${decodedText}`);
    
    try {
      // Stop scanning immediately after successful scan
      stopScanning();
      
      // Verify QR code with backend
      const response = await axios.post('http://localhost:4000/api/bookings/qr/verify', {
        qrData: decodedText
      });

      setScanResult('success');
      setAttendeeInfo(response.data.attendee);
      setShowAttendeeModal(true);
      
      // Show success message
      setTimeout(() => {
        setScanResult(null);
      }, 3000);

    } catch (error) {
      console.error('QR verification error:', error);
      setScanResult('error');
      
      if (error.response?.data?.alreadyCheckedIn) {
        setScanError('Attendee already checked in');
        setAttendeeInfo(error.response.data.booking);
        setShowAttendeeModal(true);
      } else {
        setScanError(error.response?.data?.message || 'Invalid QR code');
      }
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setScanError('');
        setScanResult(null);
      }, 5000);
    }
  };

  const onScanFailure = (error) => {
    // Silent fail - don't log every scan attempt
  };

  const AttendeeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {scanError ? 'Already Checked In' : 'Check-in Successful!'}
          </h3>
          
          {attendeeInfo && (
            <div className="space-y-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {attendeeInfo.name?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <PersonIcon className="h-4 w-4 mr-3 text-gray-500" />
                    <span className="font-semibold">{attendeeInfo.name}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <EmailIcon className="h-4 w-4 mr-3 text-gray-500" />
                    <span className="text-sm text-gray-600">{attendeeInfo.email}</span>
                  </div>
                  
                  {attendeeInfo.phone && (
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-3 text-gray-500" />
                      <span className="text-sm text-gray-600">{attendeeInfo.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <EventIcon className="h-4 w-4 mr-3 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {attendeeInfo.ticketCount} ticket{attendeeInfo.ticketCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-lg mr-3 text-gray-500">₹</span>
                    <span className="text-sm text-gray-600">₹{attendeeInfo.totalAmount}</span>
                  </div>
                  
                  {attendeeInfo.specialRequests && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Special Requests:</p>
                      <p className="text-sm text-gray-700">{attendeeInfo.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => {
                setShowAttendeeModal(false);
                setAttendeeInfo(null);
                setScanError('');
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Continue Scanning
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
        <p className="text-gray-600">Scan attendee QR codes to check them in</p>
      </div>

      {/* Scanner Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          {!isScanning ? (
            <div className="space-y-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <ScannerIcon className="h-12 w-12 text-blue-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Scan</h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to start scanning QR codes from attendee tickets
                </p>
                
                {cameras.length > 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Camera:
                    </label>
                    <select
                      value={selectedCamera}
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {cameras.map((camera) => (
                        <option key={camera.id} value={camera.id}>
                          {camera.label || `Camera ${camera.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button
                    onClick={startScanning}
                    disabled={!selectedCamera}
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Start Scanning
                  </button>
                  
                  {cameras.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No cameras detected. Please ensure your device has a camera and refresh the page.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {cameraStatus === 'loading' ? 'Initializing Camera...' : 'Scanning for QR Codes...'}
                  </h3>
                  {cameraStatus === 'loading' && (
                    <p className="text-sm text-blue-600 mt-1">Please allow camera access when prompted</p>
                  )}
                </div>
                <button
                  onClick={stopScanning}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Position the QR code within the scanning area. The camera will automatically detect and process the code.
              </p>
            </div>
          )}
          
          {/* QR Scanner Container - Always present but hidden */}
          <div className={`mt-6 ${isScanning ? 'block' : 'hidden'}`}>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {cameraStatus === 'loading' ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Initializing camera...</p>
                  </div>
                </div>
              ) : null}
              {/* QR Reader element - always present */}
              <div 
                id="qr-reader" 
                className={`w-full mx-auto ${cameraStatus === 'loading' ? 'hidden' : 'block'}`}
                style={{
                  width: '100%',
                  minHeight: '400px',
                  maxWidth: '600px'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Results */}
      {(scanResult || scanError) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-xl shadow-sm border-2 p-6 text-center ${
            scanResult === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-center justify-center mb-3">
            {scanResult === 'success' ? (
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            ) : (
              <ErrorIcon className="h-8 w-8 text-red-600" />
            )}
          </div>
          
          <h3 className={`text-lg font-semibold mb-2 ${
            scanResult === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {scanResult === 'success' ? 'Check-in Successful!' : 'Scan Error'}
          </h3>
          
          {scanError && (
            <div>
              <p className="text-red-700 mb-3">{scanError}</p>
              <button
                onClick={startScanning}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
        <div className="space-y-2 text-blue-800">
          <div className="flex items-start">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</span>
            <p>Click "Start Scanning" to activate the camera</p>
          </div>
          <div className="flex items-start">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</span>
            <p>Ask attendees to show their QR code from their ticket</p>
          </div>
          <div className="flex items-start">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</span>
            <p>Position the QR code within the scanning frame</p>
          </div>
          <div className="flex items-start">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">4</span>
            <p>The system will automatically check them in and show attendee details</p>
          </div>
        </div>
      </div>

      {/* Attendee Info Modal */}
      {showAttendeeModal && <AttendeeModal />}
    </div>
  );
};

export default QRScanner;