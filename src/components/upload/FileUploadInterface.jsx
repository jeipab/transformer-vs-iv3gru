import { useState } from 'react';
import { Upload, Video, X, Check, AlertCircle, Play, Files, Plus, Download, Share, Edit, Zap, Pause, SkipBack, SkipForward, Volume2, Maximize, Settings } from 'lucide-react';

    export default function FileUploadInterface() {
    const [files, setFiles] = useState([]);
    const [selectedFileIndex, setSelectedFileIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [batchMode, setBatchMode] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(272); // 4:32 in seconds
    const [volume, setVolume] = useState(0.8);
    const [showSettings, setShowSettings] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('video/'));
        if (droppedFiles.length > 0) {
        if (batchMode) {
            handleBatchUpload(droppedFiles);
        } else {
            handleFileUpload(droppedFiles[0]);
        }
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
        if (batchMode) {
            handleBatchUpload(selectedFiles);
        } else {
            handleFileUpload(selectedFiles[0]);
        }
        }
    };

    const handleBatchUpload = (uploadedFiles) => {
        const newFiles = uploadedFiles.map(file => ({
        file,
        status: 'uploading',
        progress: 0,
        id: Date.now() + Math.random(),
        thumbnail: `/api/placeholder/160/90?text=${encodeURIComponent(file.name.split('.')[0])}`
        }));
        
        setFiles(prev => [...prev, ...newFiles]);
        setUploadStatus('uploading');
        
        newFiles.forEach((fileObj, index) => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15 + 5;
            
            setFiles(prev => prev.map(f => 
            f.id === fileObj.id 
                ? { ...f, progress: Math.min(currentProgress, 100) }
                : f
            ));
            
            if (currentProgress >= 100) {
            clearInterval(interval);
            setFiles(prev => prev.map(f => 
                f.id === fileObj.id 
                ? { ...f, status: 'success', progress: 100 }
                : f
            ));
            }
        }, 200 + index * 100);
        });
        
        setTimeout(() => {
        setUploadStatus('success');
        }, 3000 + uploadedFiles.length * 500);
    };

    const handleFileUpload = (uploadedFile) => {
        const newFile = {
        file: uploadedFile,
        status: 'uploading',
        progress: 0,
        id: Date.now(),
        thumbnail: `/api/placeholder/160/90?text=${encodeURIComponent(uploadedFile.name.split('.')[0])}`
        };
        
        setFiles([newFile]);
        setSelectedFileIndex(0);
        setUploadStatus('uploading');
        
        let currentProgress = 0;
        const interval = setInterval(() => {
        currentProgress += 5;
        setProgress(currentProgress);
        
        setFiles(prev => prev.map(f => 
            f.id === newFile.id 
            ? { ...f, progress: Math.min(currentProgress, 100) }
            : f
        ));
        
        if (currentProgress >= 100) {
            clearInterval(interval);
            setUploadStatus('success');
            setFiles(prev => prev.map(f => 
            f.id === newFile.id 
                ? { ...f, status: 'success' }
                : f
            ));
        }
        }, 100);
    };

    const handleRemoveFile = (fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        if (files.length === 1) {
        setUploadStatus(null);
        setProgress(0);
        setIsPlaying(false);
        setSelectedFileIndex(0);
        } else if (selectedFileIndex >= files.length - 1) {
        setSelectedFileIndex(Math.max(0, files.length - 2));
        }
    };

    const handleRemoveAllFiles = () => {
        setFiles([]);
        setUploadStatus(null);
        setProgress(0);
        setIsPlaying(false);
        setSelectedFileIndex(0);
    };

    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
    };

    const getCurrentFile = () => {
        return files[selectedFileIndex];
    };

    const getTotalSize = () => {
        return files.reduce((total, fileObj) => total + fileObj.file.size, 0);
    };

    const getCompletedUploads = () => {
        return files.filter(f => f.status === 'success').length;
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        setCurrentTime(percent * duration);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Upload Studio</h1>
            <p className="text-gray-600">Upload and manage your sign language videos for AI analysis</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Panel - Upload Section */}
            <div className="space-y-6">
                {/* Upload Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Upload Videos</h2>
                    <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <input
                        type="checkbox"
                        id="batchMode"
                        checked={batchMode}
                        onChange={() => setBatchMode(!batchMode)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor="batchMode" className="ml-2 text-sm font-medium text-gray-700">
                        Batch Upload
                        </label>
                    </div>
                    {files.length > 0 && (
                        <button
                        onClick={handleRemoveAllFiles}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors font-medium"
                        >
                        Clear All
                        </button>
                    )}
                    </div>
                </div>
                
                {/* Upload Area */}
                <div 
                    className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
                    isDragging 
                        ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {files.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <Upload size={32} className="text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {batchMode ? 'Upload Multiple Videos' : 'Upload Video'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                        {batchMode 
                            ? 'Drag and drop multiple video files or browse to upload' 
                            : 'Drag and drop your video file or browse to upload'
                        }
                        </p>
                        <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-sm">
                        <Plus size={18} className="mr-2" />
                        {batchMode ? 'Browse Files' : 'Browse File'}
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="video/*" 
                            multiple={batchMode}
                            onChange={handleFileChange}
                        />
                        </label>
                        <p className="text-xs text-gray-400 mt-4">
                        Supported formats: MP4, MOV, AVI, WebM • Max 100MB per file
                        {batchMode && <span className="block mt-1">Up to 10 files per batch</span>}
                        </p>
                    </div>
                    ) : (
                    <div className="p-6">
                        {/* Batch Summary */}
                        {files.length > 1 && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-600 rounded-lg mr-3">
                                <Files className="text-white" size={20} />
                                </div>
                                <div>
                                <h3 className="font-semibold text-blue-900">Batch Upload</h3>
                                <p className="text-sm text-blue-600">{files.length} files • {(getTotalSize() / (1024 * 1024)).toFixed(1)} MB total</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-blue-900">{getCompletedUploads()}/{files.length}</div>
                                <div className="text-xs text-blue-600">completed</div>
                            </div>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(getCompletedUploads() / files.length) * 100}%` }}
                            />
                            </div>
                        </div>
                        )}
                        
                        {/* File Grid */}
                        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                        {files.map((fileObj, index) => (
                            <div 
                            key={fileObj.id}
                            className={`group flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedFileIndex === index 
                                ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedFileIndex(index)}
                            >
                            {/* Thumbnail */}
                            <div className="relative w-20 h-12 bg-gray-900 rounded overflow-hidden mr-4 flex-shrink-0">
                                <img 
                                src={fileObj.thumbnail} 
                                alt="Video thumbnail" 
                                className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                <Play size={16} className="text-white opacity-80" fill="white" />
                                </div>
                            </div>
                            
                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">
                                {fileObj.file.name}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                <span>{(fileObj.file.size / (1024 * 1024)).toFixed(1)} MB</span>
                                <span className="mx-2">•</span>
                                <span>{fileObj.file.type.split('/')[1].toUpperCase()}</span>
                                </div>
                            </div>
                            
                            {/* Status */}
                            <div className="flex items-center ml-4">
                                {fileObj.status === 'uploading' && (
                                <div className="flex items-center">
                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                                    <div 
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${fileObj.progress}%` }}
                                    />
                                    </div>
                                    <span className="text-xs text-gray-500 w-8">{Math.round(fileObj.progress)}%</span>
                                </div>
                                )}
                                
                                {fileObj.status === 'success' && (
                                <div className="flex items-center">
                                    <div className="p-1 bg-green-100 rounded-full mr-2">
                                    <Check size={14} className="text-green-600" />
                                    </div>
                                    <span className="text-xs text-green-600 font-medium">Ready</span>
                                </div>
                                )}
                                
                                <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile(fileObj.id);
                                }}
                                className="ml-3 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                <X size={16} />
                                </button>
                            </div>
                            </div>
                        ))}
                        </div>
                        
                        {/* Add More Files */}
                        {batchMode && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <label className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium">
                            <Plus size={16} className="mr-2" />
                            Add More Files
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="video/*" 
                                multiple
                                onChange={handleFileChange}
                            />
                            </label>
                        </div>
                        )}
                    </div>
                    )}
                </div>
                </div>

                {/* File Details */}
                {files.length > 0 && uploadStatus === 'success' && getCurrentFile() && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {files.length > 1 ? `Selected File (${selectedFileIndex + 1}/${files.length})` : 'File Details'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-gray-500 mb-1">Filename</div>
                        <div className="font-medium text-gray-900 truncate">{getCurrentFile().file.name}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">File Size</div>
                        <div className="font-medium text-gray-900">{(getCurrentFile().file.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Format</div>
                        <div className="font-medium text-gray-900">{getCurrentFile().file.type.split('/')[1].toUpperCase()}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Status</div>
                        <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="font-medium text-green-600">Ready to Process</span>
                        </div>
                    </div>
                    </div>
                </div>
                )}
            </div>
            
            {/* Right Panel - Video Preview */}
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Video Preview {files.length > 1 && `(${selectedFileIndex + 1}/${files.length})`}
                    </h2>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Settings size={20} />
                    </button>
                    </div>
                </div>
                
                {files.length > 0 && uploadStatus === 'success' ? (
                    <div className="relative">
                    {/* Video Player */}
                    <div className="relative bg-black aspect-video">
                        <img 
                        src={`/api/placeholder/640/360?text=${encodeURIComponent(getCurrentFile().file.name.split('.')[0])}`}
                        alt="Video preview" 
                        className="w-full h-full object-cover"
                        />
                        
                        {/* Video Overlay Controls */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors group">
                        {/* Center Play Button */}
                        {!isPlaying && (
                            <button 
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={togglePlayback}
                            >
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                                <Play size={32} className="text-white ml-1" fill="white" />
                            </div>
                            </button>
                        )}
                        
                        {/* Video Controls Bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Progress Bar */}
                            <div className="mb-4">
                            <div 
                                className="w-full h-1 bg-white/30 rounded-full cursor-pointer hover:h-2 transition-all"
                                onClick={handleSeek}
                            >
                                <div 
                                className="h-full bg-blue-500 rounded-full relative"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                                >
                                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
                                </div>
                            </div>
                            </div>
                            
                            {/* Control Buttons */}
                            <div className="flex items-center justify-between text-white">
                            <div className="flex items-center space-x-3">
                                <button className="p-1 hover:bg-white/20 rounded transition-colors">
                                <SkipBack size={20} />
                                </button>
                                <button 
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                onClick={togglePlayback}
                                >
                                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="white" className="ml-0.5" />}
                                </button>
                                <button className="p-1 hover:bg-white/20 rounded transition-colors">
                                <SkipForward size={20} />
                                </button>
                                
                                <div className="flex items-center space-x-2 ml-4">
                                <Volume2 size={18} />
                                <div className="w-16 h-1 bg-white/30 rounded-full">
                                    <div 
                                    className="h-full bg-white rounded-full"
                                    style={{ width: `${volume * 100}%` }}
                                    ></div>
                                </div>
                                </div>
                                
                                <span className="text-sm font-mono ml-4">
                                {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <button className="p-1 hover:bg-white/20 rounded transition-colors">
                                <Maximize size={20} />
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    
                    {/* Video Navigation for Batch */}
                    {files.length > 1 && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <button
                            onClick={() => setSelectedFileIndex(Math.max(0, selectedFileIndex - 1))}
                            disabled={selectedFileIndex === 0}
                            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                            ← Previous
                            </button>
                            
                            <div className="flex items-center space-x-2">
                            {files.map((fileObj, index) => (
                                <button
                                key={fileObj.id}
                                onClick={() => setSelectedFileIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${
                                    selectedFileIndex === index 
                                    ? 'bg-blue-500 scale-125' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                />
                            ))}
                            </div>
                            
                            <button
                            onClick={() => setSelectedFileIndex(Math.min(files.length - 1, selectedFileIndex + 1))}
                            disabled={selectedFileIndex === files.length - 1}
                            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                            Next →
                            </button>
                        </div>
                        </div>
                    )}
                    </div>
                ) : (
                    <div className="bg-gray-50 aspect-video flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No Video Selected</h3>
                        <p className="text-gray-500 text-sm">
                        {files.length === 0 
                            ? 'Upload videos to see the preview' 
                            : 'Select a completed upload to preview'
                        }
                        </p>
                    </div>
                    </div>
                )}
                </div>
                
                {/* Action Panel */}
                {files.length > 0 && uploadStatus === 'success' && getCurrentFile() && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-wrap gap-3 mb-4">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                        <Zap size={18} className="mr-2" />
                        Start Analysis
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        <Download size={18} className="mr-2" />
                        Download
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        <Share size={18} className="mr-2" />
                        Share
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        <Edit size={18} className="mr-2" />
                        Edit
                    </button>
                    {files.length > 1 && (
                        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm">
                        <Files size={18} className="mr-2" />
                        Batch Process
                        </button>
                    )}
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {files.length > 1 
                        ? `Video ${selectedFileIndex + 1} of ${files.length} ready for analysis. Use batch process to analyze all videos simultaneously with optimized performance.`
                        : 'Video ready for sign language analysis. Click "Start Analysis" to begin keypoint extraction and gesture recognition.'
                    }
                    </div>
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    );
}