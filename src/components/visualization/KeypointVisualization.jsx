import { useState } from 'react';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, Pause, Play, Eye, Hand } from 'lucide-react';

export default function KeypointVisualization() {
    const [currentFrameIndex, setCurrentFrameIndex] = useState(15);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showKeypoints, setShowKeypoints] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(true);
    
    // Batch navigation state - aligned with results interface
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [totalVideos] = useState(8); // Updated to match results interface
    
    // Mock video files - aligned with results interface
    const videoFiles = [
        { name: "hello_sign.mp4", duration: "3.2s" },
        { name: "goodbye_sign.mp4", duration: "2.8s" },
        { name: "welcome_sign.mp4", duration: "4.0s" },
        { name: "thank_you_sign.mp4", duration: "3.5s" },
        { name: "please_sign.mp4", duration: "2.9s" },
        { name: "yes_sign.mp4", duration: "3.1s" },
        { name: "no_sign.mp4", duration: "2.7s" },
        { name: "sorry_sign.mp4", duration: "3.8s" }
    ];
    
    // Mock frames data
    const totalFrames = 120; // 4 seconds at 30 FPS
    
    // Body keypoints data
    const bodyKeypoints = [
        { x: 320, y: 120, confidence: 0.96 }, // Nose
        { x: 305, y: 110, confidence: 0.94 }, // Left Eye
        { x: 335, y: 110, confidence: 0.94 }, // Right Eye
        { x: 270, y: 170, confidence: 0.95 }, // Left Shoulder
        { x: 370, y: 170, confidence: 0.95 }, // Right Shoulder
        { x: 230, y: 220, confidence: 0.90 }, // Left Elbow
        { x: 410, y: 220, confidence: 0.90 }, // Right Elbow
        { x: 190, y: 270, confidence: 0.88 }, // Left Wrist
        { x: 450, y: 270, confidence: 0.94 }, // Right Wrist
        { x: 320, y: 220, confidence: 0.94 }, // Chest Center
    ];
    
    // Hand keypoints data (positioned near the wrists)
    const rightHandKeypoints = [
        // Wrist (matches right wrist position)
        { x: 450, y: 270, confidence: 0.96 },
        // Thumb
        { x: 465, y: 265, confidence: 0.92 },
        { x: 475, y: 255, confidence: 0.89 },
        { x: 480, y: 245, confidence: 0.87 },
        { x: 485, y: 240, confidence: 0.85 },
        // Index finger
        { x: 460, y: 250, confidence: 0.95 },
        { x: 465, y: 235, confidence: 0.93 },
        { x: 468, y: 225, confidence: 0.90 },
        { x: 470, y: 215, confidence: 0.88 },
        // Middle finger
        { x: 450, y: 245, confidence: 0.94 },
        { x: 452, y: 225, confidence: 0.92 },
        { x: 454, y: 210, confidence: 0.90 },
        { x: 456, y: 200, confidence: 0.88 },
        // Ring finger
        { x: 440, y: 250, confidence: 0.88 },
        { x: 438, y: 235, confidence: 0.86 },
        { x: 436, y: 225, confidence: 0.84 },
        { x: 434, y: 215, confidence: 0.82 },
        // Pinky finger
        { x: 430, y: 255, confidence: 0.82 },
        { x: 425, y: 245, confidence: 0.80 },
        { x: 422, y: 235, confidence: 0.78 },
        { x: 420, y: 225, confidence: 0.76 },
    ];
    
    const leftHandKeypoints = [
        // Wrist (matches left wrist position)
        { x: 190, y: 270, confidence: 0.96 },
        // Thumb
        { x: 175, y: 265, confidence: 0.92 },
        { x: 165, y: 255, confidence: 0.89 },
        { x: 160, y: 245, confidence: 0.87 },
        { x: 155, y: 240, confidence: 0.85 },
        // Index finger
        { x: 180, y: 250, confidence: 0.95 },
        { x: 175, y: 235, confidence: 0.93 },
        { x: 172, y: 225, confidence: 0.90 },
        { x: 170, y: 215, confidence: 0.88 },
        // Middle finger
        { x: 190, y: 245, confidence: 0.94 },
        { x: 188, y: 225, confidence: 0.92 },
        { x: 186, y: 210, confidence: 0.90 },
        { x: 184, y: 200, confidence: 0.88 },
        // Ring finger
        { x: 200, y: 250, confidence: 0.88 },
        { x: 202, y: 235, confidence: 0.86 },
        { x: 204, y: 225, confidence: 0.84 },
        { x: 206, y: 215, confidence: 0.82 },
        // Pinky finger
        { x: 210, y: 255, confidence: 0.82 },
        { x: 215, y: 245, confidence: 0.80 },
        { x: 218, y: 235, confidence: 0.78 },
        { x: 220, y: 225, confidence: 0.76 },
    ];
    
    // Skeleton connections
    const skeletonConnections = [
        [0, 1], [0, 2], // Face
        [3, 4], [3, 9], [4, 9], // Torso
        [3, 5], [5, 7], [4, 6], [6, 8], // Arms
    ];
    
    // Hand skeleton connections (same for both hands)
    const handConnections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
    ];
    
    // Get current sign prediction (aligned with results interface)
    const getCurrentSign = () => {
        const signs = [
            { text: "HELLO", confidence: 0.94 },
            { text: "GOODBYE", confidence: 0.89 },
            { text: "HELLO", confidence: 0.78 }, // welcome_sign predicting HELLO
            { text: "THANK YOU", confidence: 0.92 },
            { text: "PLEASE", confidence: 0.87 },
            { text: "NO", confidence: 0.65 }, // yes_sign predicting NO
            { text: "NO", confidence: 0.91 },
            { text: "SORRY", confidence: 0.83 }
        ];
        return signs[currentVideoIndex] || signs[0];
    };
    
    const handlePrevFrame = () => {
        setCurrentFrameIndex(prev => Math.max(0, prev - 1));
    };
    
    const handleNextFrame = () => {
        setCurrentFrameIndex(prev => Math.min(totalFrames - 1, prev + 1));
    };
    
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };
    
    // Batch navigation functions
    const handlePrevVideo = () => {
        setCurrentVideoIndex(prev => Math.max(0, prev - 1));
        setCurrentFrameIndex(0); // Reset to first frame of new video
        setIsPlaying(false);
    };
    
    const handleNextVideo = () => {
        setCurrentVideoIndex(prev => Math.min(totalVideos - 1, prev + 1));
        setCurrentFrameIndex(0); // Reset to first frame of new video
        setIsPlaying(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Language Recognition</h1>
                    <p className="text-gray-600">Sign detection and visualization</p>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Main Video Panel */}
                    <div className="xl:col-span-2">
                        {/* Video with Keypoint Overlay */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-800">Video Analysis</h2>
                                    
                                    {/* Inline Batch Navigation */}
                                    {totalVideos > 1 && (
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={handlePrevVideo}
                                                disabled={currentVideoIndex === 0}
                                                className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                            >
                                                <ChevronLeft size={16} className="mr-1" />
                                                Previous
                                            </button>
                                            
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600">Video</span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {currentVideoIndex + 1} of {totalVideos}
                                                </span>
                                            </div>
                                            
                                            <button
                                                onClick={handleNextVideo}
                                                disabled={currentVideoIndex === totalVideos - 1}
                                                className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                            >
                                                Next
                                                <ChevronRight size={16} className="ml-1" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Video indicator dots */}
                                {totalVideos > 1 && (
                                    <div className="flex justify-center space-x-2 mt-3">
                                        {Array.from({ length: totalVideos }, (_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setCurrentVideoIndex(index);
                                                    setCurrentFrameIndex(0);
                                                    setIsPlaying(false);
                                                }}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    currentVideoIndex === index 
                                                        ? 'bg-blue-500 scale-125' 
                                                        : 'bg-gray-300 hover:bg-gray-400'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Video Frame with Keypoint Overlay */}
                            <div className="relative bg-black aspect-video">
                                {/* Video background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                    <span className="text-white text-lg font-medium opacity-60">
                                        Frame {currentFrameIndex + 1} / {totalFrames}
                                    </span>
                                </div>
                                
                                {/* SVG Overlay for keypoints */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 640 360">
                                    {/* Body skeleton connections */}
                                    {showSkeleton && skeletonConnections.map((connection, idx) => {
                                        const point1 = bodyKeypoints[connection[0]];
                                        const point2 = bodyKeypoints[connection[1]];
                                        
                                        return (
                                            <line 
                                                key={`body-connection-${idx}`}
                                                x1={point1.x} y1={point1.y} 
                                                x2={point2.x} y2={point2.y} 
                                                stroke="#10B981" 
                                                strokeWidth="3" 
                                                strokeOpacity="0.8"
                                            />
                                        );
                                    })}
                                    
                                    {/* Right hand skeleton connections */}
                                    {showSkeleton && handConnections.map((connection, idx) => {
                                        const point1 = rightHandKeypoints[connection[0]];
                                        const point2 = rightHandKeypoints[connection[1]];
                                        
                                        return (
                                            <line 
                                                key={`right-hand-connection-${idx}`}
                                                x1={point1.x} y1={point1.y} 
                                                x2={point2.x} y2={point2.y} 
                                                stroke="#3B82F6" 
                                                strokeWidth="2" 
                                                strokeOpacity="0.9"
                                            />
                                        );
                                    })}
                                    
                                    {/* Left hand skeleton connections */}
                                    {showSkeleton && handConnections.map((connection, idx) => {
                                        const point1 = leftHandKeypoints[connection[0]];
                                        const point2 = leftHandKeypoints[connection[1]];
                                        
                                        return (
                                            <line 
                                                key={`left-hand-connection-${idx}`}
                                                x1={point1.x} y1={point1.y} 
                                                x2={point2.x} y2={point2.y} 
                                                stroke="#3B82F6" 
                                                strokeWidth="2" 
                                                strokeOpacity="0.9"
                                            />
                                        );
                                    })}
                                    
                                    {/* Body keypoints */}
                                    {showKeypoints && bodyKeypoints.map((point, idx) => (
                                        <circle 
                                            key={`body-keypoint-${idx}`}
                                            cx={point.x} cy={point.y} r="5" 
                                            fill="#10B981" 
                                            stroke="#fff" strokeWidth="2"
                                        />
                                    ))}
                                    
                                    {/* Right hand keypoints */}
                                    {showKeypoints && rightHandKeypoints.map((point, idx) => (
                                        <circle 
                                            key={`right-hand-keypoint-${idx}`}
                                            cx={point.x} cy={point.y} r="4" 
                                            fill="#3B82F6"
                                            stroke="#fff" strokeWidth="1.5"
                                        />
                                    ))}
                                    
                                    {/* Left hand keypoints */}
                                    {showKeypoints && leftHandKeypoints.map((point, idx) => (
                                        <circle 
                                            key={`left-hand-keypoint-${idx}`}
                                            cx={point.x} cy={point.y} r="4" 
                                            fill="#3B82F6"
                                            stroke="#fff" strokeWidth="1.5"
                                        />
                                    ))}
                                </svg>
                                
                                {/* Current prediction overlay */}
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/20">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{getCurrentSign().text}</div>
                                            <div className="text-sm text-gray-300">
                                                {(getCurrentSign().confidence * 100).toFixed(1)}% confident
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Video Controls */}
                            <div className="bg-gray-900 text-white p-4">
                                {/* Progress bar */}
                                <div className="mb-4">
                                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden cursor-pointer">
                                        <div 
                                            className="bg-blue-500 h-full transition-all duration-300" 
                                            style={{ width: `${(currentFrameIndex / (totalFrames - 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                
                                {/* Control buttons */}
                                <div className="flex items-center justify-center space-x-4">
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <SkipBack size={20} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" onClick={handlePrevFrame}>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button 
                                        className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                                        onClick={togglePlayPause}
                                    >
                                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" onClick={handleNextFrame}>
                                        <ChevronRight size={20} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                        <SkipForward size={20} />
                                    </button>
                                </div>
                                
                                <div className="text-center mt-3 text-sm font-mono">
                                    0:{String(Math.floor((currentFrameIndex / 30) % 60)).padStart(2, '0')} / 0:04
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Panel - Simple Info */}
                    <div className="space-y-6">
                        {/* Current Recognition */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Recognition</h3>
                            
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-blue-600 mb-2">{getCurrentSign().text}</div>
                                <div className="text-gray-600">Detected Sign</div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">Confidence</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {(getCurrentSign().confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                getCurrentSign().confidence >= 0.8 ? 'bg-green-500' : 
                                                getCurrentSign().confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${getCurrentSign().confidence * 100}%` }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        <div>Frame: {currentFrameIndex + 1} of {totalFrames}</div>
                                        <div>Time: {Math.floor(currentFrameIndex / 30)}:{((currentFrameIndex % 30) * (1000/30)/1000).toFixed(2).slice(-2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Display Options */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Display Options</h3>
                            
                            <div className="space-y-4">
                                <label className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={showKeypoints} 
                                        onChange={() => setShowKeypoints(!showKeypoints)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-700">Show Keypoints</span>
                                </label>
                                
                                <label className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={showSkeleton} 
                                        onChange={() => setShowSkeleton(!showSkeleton)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-700">Show Skeleton</span>
                                </label>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="text-xs text-gray-500 space-y-2">
                                    <div className="flex items-center">
                                        <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                                        <span>Hand Keypoints</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                                        <span>Body Keypoints</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Video Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Video Information</h3>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Filename:</span>
                                    <span className="font-medium">{videoFiles[currentVideoIndex]?.name || "video.mp4"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-medium">{videoFiles[currentVideoIndex]?.duration || "4.0s"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Frame Rate:</span>
                                    <span className="font-medium">30 FPS</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Frames:</span>
                                    <span className="font-medium">{totalFrames}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}