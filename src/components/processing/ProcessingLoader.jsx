import { useState, useEffect } from 'react';
import { Video, Brain, Eye, Layers, ArrowRight, CheckCircle, Clock, Zap, Activity, FileVideo, Database } from 'lucide-react';

export default function ProcessingLoader() {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [selectedModel, setSelectedModel] = useState('iv3-gru'); // iv3-gru or transformer

    // Updated processing steps for InceptionV3-GRU model
    const processingSteps = selectedModel === 'transformer' ? [
    { 
        id: 'preprocessing', 
        label: 'Video Preprocessing', 
        description: 'Extracting frames and preparing video data for analysis',
        duration: 1500,
        icon: FileVideo,
        details: 'Converting to 30 FPS, MediaPipe keypoint extraction'
    },
    { 
        id: 'keypoint-normalization', 
        label: 'Feature Normalization', 
        description: 'Normalizing and structuring keypoints into sequential format',
        duration: 1200,
        icon: Eye,
        details: 'Scale adjustment and sequence creation'
    },
    { 
        id: 'positional-encoding', 
        label: 'Positional Encoding', 
        description: 'Applying sinusoidal positional encoding for temporal order',
        duration: 800,
        icon: Layers,
        details: 'Adding temporal position information'
    },
    { 
        id: 'transformer-processing', 
        label: 'Multi-Head Attention Processing', 
        description: 'Transformer capturing spatial-temporal dependencies',
        duration: 3500,
        icon: Brain,
        details: 'MHAM analyzing parallel attention patterns'
    },
    { 
        id: 'classification', 
        label: 'Sign Classification', 
        description: 'Linear classifier generating final predictions',
        duration: 1000,
        icon: Activity,
        details: 'Softmax layer producing probability distribution'
    }
    ] : [
        { 
        id: 'preprocessing', 
        label: 'Video Preprocessing', 
        description: 'Extracting frames and preparing video data for analysis',
        duration: 1800,
        icon: FileVideo,
        details: 'Converting video to 30 FPS, normalizing resolution'
        },
        { 
        id: 'keypoint-extraction', 
        label: 'Keypoint Detection', 
        description: 'Detecting hand and body keypoints using MediaPipe',
        duration: 2500,
        icon: Eye,
        details: 'Extracting 21 hand landmarks and 33 pose keypoints per frame'
        },
        { 
        id: 'feature-extraction', 
        label: 'Feature Extraction', 
        description: 'InceptionV3 CNN extracting spatial features from keypoint sequences',
        duration: 3200,
        icon: Layers,
        details: 'Processing through InceptionV3 convolutional layers'
        },
        { 
        id: 'sequence-processing', 
        label: 'Temporal Analysis', 
        description: 'GRU network analyzing temporal dependencies in sign sequences',
        duration: 2800,
        icon: Activity,
        details: 'Bidirectional GRU processing sequential features'
        },
        { 
        id: 'classification', 
        label: 'Sign Recognition', 
        description: 'Final classification layer predicting sign language gestures',
        duration: 1200,
        icon: Brain,
        details: 'Generating confidence scores for detected signs'
        }
    ];

    const totalDuration = processingSteps.reduce((sum, step) => sum + step.duration, 0);

    useEffect(() => {
        const timer = setInterval(() => {
        setElapsedTime(prev => {
            const newTime = prev + 100;
            
            // Calculate current step based on elapsed time
            let cumulativeTime = 0;
            let newCurrentStep = 0;
            
            for (let i = 0; i < processingSteps.length; i++) {
            cumulativeTime += processingSteps[i].duration;
            if (newTime < cumulativeTime) {
                newCurrentStep = i;
                break;
            } else if (i === processingSteps.length - 1) {
                newCurrentStep = i;
                if (newTime >= totalDuration) {
                setIsComplete(true);
                }
            }
            }
            
            setCurrentStep(newCurrentStep);
            setProgress(Math.min((newTime / totalDuration) * 100, 100));
            
            return newTime;
        });
        }, 100);

        return () => clearInterval(timer);
    }, [totalDuration]);

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isStepComplete = (stepIndex) => {
        let cumulativeTime = 0;
        for (let i = 0; i <= stepIndex; i++) {
        cumulativeTime += processingSteps[i].duration;
        }
        return elapsedTime >= cumulativeTime;
    };

    const isStepActive = (stepIndex) => {
        return stepIndex === currentStep && !isStepComplete(stepIndex);
    };

    const getStepProgress = (stepIndex) => {
        if (isStepComplete(stepIndex)) return 100;
        if (!isStepActive(stepIndex)) return 0;
        
        let previousTime = 0;
        for (let i = 0; i < stepIndex; i++) {
        previousTime += processingSteps[i].duration;
        }
        
        const stepElapsed = elapsedTime - previousTime;
        return Math.min((stepElapsed / processingSteps[stepIndex].duration) * 100, 100);
    };

    const getEstimatedTimeRemaining = () => {
        const remainingTime = totalDuration - elapsedTime;
        return Math.max(0, Math.floor(remainingTime / 1000));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
            
            {/* Header Section */}
            <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
                <Brain size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Processing Video</h1>
            <p className="text-lg text-gray-600 mb-1">
                Analyzing with {selectedModel === 'transformer' ? 'MHAM-Transformer' : 'InceptionV3-GRU'} Model
            </p>
            <p className="text-sm text-gray-500">File: hello_sign.mp4</p>
            </div>

            {/* Main Processing Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Processing Progress</h2>
                    <p className="text-blue-100 text-sm">
                    {isComplete ? 'Analysis Complete!' : `Step ${currentStep + 1} of ${processingSteps.length}`}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold">{Math.round(progress)}%</div>
                    <div className="text-blue-100 text-sm">
                    {isComplete ? 'Finished' : `${getEstimatedTimeRemaining()}s remaining`}
                    </div>
                </div>
                </div>
                
                {/* Main Progress Bar */}
                <div className="w-full bg-blue-500/30 rounded-full h-3 overflow-hidden">
                <div 
                    className="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${progress}%` }}
                />
                </div>
            </div>

            {/* Processing Steps */}
            <div className="p-6">
                <div className="space-y-4">
                {processingSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isComplete = isStepComplete(index);
                    const isActive = isStepActive(index);
                    const stepProgress = getStepProgress(index);
                    
                    return (
                    <div 
                        key={step.id}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        isComplete 
                            ? 'bg-green-50 border-green-200 shadow-sm' 
                            : isActive 
                            ? 'bg-blue-50 border-blue-200 shadow-md' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                        {/* Step Progress Background */}
                        {isActive && (
                        <div 
                            className="absolute inset-0 bg-blue-100/50 transition-all duration-300"
                            style={{ width: `${stepProgress}%` }}
                        />
                        )}
                        
                        <div className="relative p-6">
                        <div className="flex items-start">
                            {/* Step Icon */}
                            <div className={`flex items-center justify-center w-12 h-12 rounded-xl mr-4 flex-shrink-0 ${
                            isComplete 
                                ? 'bg-green-600' 
                                : isActive 
                                ? 'bg-blue-600' 
                                : 'bg-gray-400'
                            }`}>
                            {isComplete ? (
                                <CheckCircle size={24} className="text-white" />
                            ) : isActive ? (
                                <div className="relative">
                                <IconComponent size={24} className="text-white" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
                                </div>
                            ) : (
                                <IconComponent size={24} className="text-white" />
                            )}
                            </div>
                            
                            {/* Step Content */}
                            <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className={`text-lg font-semibold ${
                                isComplete 
                                    ? 'text-green-800' 
                                    : isActive 
                                    ? 'text-blue-800' 
                                    : 'text-gray-600'
                                }`}>
                                {step.label}
                                </h3>
                                
                                {/* Step Status */}
                                <div className="flex items-center ml-4">
                                {isActive && (
                                    <div className="flex items-center text-blue-600 text-sm font-medium mr-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
                                    Processing... {Math.round(stepProgress)}%
                                    </div>
                                )}
                                
                                {isComplete && (
                                    <div className="flex items-center text-green-600 text-sm font-medium">
                                    <CheckCircle size={16} className="mr-1" />
                                    Complete
                                    </div>
                                )}
                                </div>
                            </div>
                            
                            <p className={`text-sm mb-2 ${
                                isComplete 
                                ? 'text-green-700' 
                                : isActive 
                                    ? 'text-blue-700' 
                                    : 'text-gray-500'
                            }`}>
                                {step.description}
                            </p>
                            
                            <p className={`text-xs ${
                                isComplete 
                                ? 'text-green-600' 
                                : isActive 
                                    ? 'text-blue-600' 
                                    : 'text-gray-400'
                            }`}>
                                {step.details}
                            </p>
                            
                            {/* Individual Step Progress Bar */}
                            {isActive && (
                                <div className="mt-3 w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${stepProgress}%` }}
                                />
                                </div>
                            )}
                            </div>
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>

            {/* Model Information */}
            <div className="border-t border-gray-200 bg-gray-50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
                    <Brain size={20} className="text-blue-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">Model Architecture</div>
                    <div className="text-xs text-gray-500">
                        {selectedModel === 'transformer' ? 'MHAM-Transformer' : 'InceptionV3-GRU'}
                    </div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
                    <Zap size={20} className="text-green-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">Processing Speed</div>
                    <div className="text-xs text-gray-500">{Math.round((elapsedTime / 1000) / ((progress / 100) || 0.01))}s total</div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-2">
                    <Database size={20} className="text-purple-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">Dataset</div>
                    <div className="text-xs text-gray-500">FSL-105</div>
                </div>
                </div>
            </div>
            </div>

            {/* Timer Display */}
            <div className="text-center mt-6">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                <Clock size={16} className="text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                Elapsed Time: {formatTime(elapsedTime)}
                </span>
            </div>
            </div>
        </div>
        </div>
    );
}