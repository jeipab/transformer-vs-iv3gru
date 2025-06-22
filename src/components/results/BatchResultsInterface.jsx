import { useState } from 'react';
import { Video, CheckCircle, AlertTriangle, Download, Filter, TrendingUp, ArrowLeft, Search, SortAsc, SortDesc } from 'lucide-react';

export default function SimplifiedResultsInterface({ onBack }) {
    const [selectedClip, setSelectedClip] = useState(0);
    const [filterMode, setFilterMode] = useState('all'); // all, high_confidence, low_confidence
    const [selectedModel, setSelectedModel] = useState('iv3-gru'); // iv3-gru or transformer
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('filename'); // filename, confidence
    const [sortOrder, setSortOrder] = useState('asc'); // asc, desc

    // Static batch results data - model recognitions only
    const batchResults = [
        {
        id: 1,
        filename: "hello_sign.mp4",
        predictedSign: "HELLO",
        confidence: 0.94,
        videoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='56'%3E%3Crect width='100' height='56' fill='%23000'/%3E%3Ctext x='50' y='28' font-family='Arial' font-size='12' fill='white' text-anchor='middle' dominant-baseline='middle'%3EVideo%3C/text%3E%3C/svg%3E"
        },
        {
        id: 2,
        filename: "goodbye_sign.mp4",
        predictedSign: "GOODBYE",
        confidence: 0.89,
        videoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='56'%3E%3Crect width='100' height='56' fill='%23000'/%3E%3Ctext x='50' y='28' font-family='Arial' font-size='12' fill='white' text-anchor='middle' dominant-baseline='middle'%3EVideo%3C/text%3E%3C/svg%3E"
        },
        {
        id: 3,
        filename: "welcome_sign.mp4",
        predictedSign: "HELLO",
        confidence: 0.78,
        videoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='56'%3E%3Crect width='100' height='56' fill='%23000'/%3E%3Ctext x='50' y='28' font-family='Arial' font-size='12' fill='white' text-anchor='middle' dominant-baseline='middle'%3EVideo%3C/text%3E%3C/svg%3E"
        },
        {
        id: 4,
        filename: "thank_you_sign.mp4",
        predictedSign: "THANK YOU",
        confidence: 0.92,
        videoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='56'%3E%3Crect width='100' height='56' fill='%23000'/%3E%3Ctext x='50' y='28' font-family='Arial' font-size='12' fill='white' text-anchor='middle' dominant-baseline='middle'%3EVideo%3C/text%3E%3C/svg%3E"
        },
        {
        id: 5,
        filename: "please_sign.mp4",
        predictedSign: "PLEASE",
        confidence: 0.87,
        videoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='56'%3E%3Crect width='100' height='56' fill='%23000'/%3E%3Ctext x='50' y='28' font-family='Arial' font-size='12' fill='white' text-anchor='middle' dominant-baseline='middle'%3EVideo%3C/text%3E%3C/svg%3E"
        },
        {
        id: 6,
        filename: "yes_sign.mp4",
        predictedSign: "NO",
        confidence: 0.65,
        videoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='56'%3E%3Crect width='100' height='56' fill='%23000'/%3E%3Ctext x='50' y='28' font-family='Arial' font-size='12' fill='white' text-anchor='middle' dominant-baseline='middle'%3EVideo%3C/text%3E%3C/svg%3E"
        },
        {
        id: 7,
        filename: "no_sign.mp4",
        predictedSign: "NO",
        confidence: 0.91,
        videoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='56'%3E%3Crect width='100' height='56' fill='%23000'/%3E%3Ctext x='50' y='28' font-family='Arial' font-size='12' fill='white' text-anchor='middle' dominant-baseline='middle'%3EVideo%3C/text%3E%3C/svg%3E"
        },
        {
        id: 8,
        filename: "sorry_sign.mp4",
        predictedSign: "SORRY",
        confidence: 0.83,
        videoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='56'%3E%3Crect width='100' height='56' fill='%23000'/%3E%3Ctext x='50' y='28' font-family='Arial' font-size='12' fill='white' text-anchor='middle' dominant-baseline='middle'%3EVideo%3C/text%3E%3C/svg%3E"
        }
    ];

    // Filter and sort results
    const getFilteredAndSortedResults = () => {
        let filtered = batchResults.filter(result => {
            // Apply confidence filter
            const confidenceFilter = (() => {
                if (filterMode === 'high_confidence') return result.confidence >= 0.8;
                if (filterMode === 'low_confidence') return result.confidence < 0.8;
                return true;
            })();
            
            // Apply search filter
            const searchFilter = result.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               result.predictedSign.toLowerCase().includes(searchTerm.toLowerCase());
            
            return confidenceFilter && searchFilter;
        });

        // Sort results
        filtered.sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'filename':
                    comparison = a.filename.localeCompare(b.filename);
                    break;
                case 'confidence':
                    comparison = a.confidence - b.confidence;
                    break;
                default:
                    comparison = 0;
            }
            
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    };

    const filteredResults = getFilteredAndSortedResults();

    const getOverallStats = () => {
        const total = batchResults.length;
        const avgConfidence = batchResults.reduce((acc, r) => acc + r.confidence, 0) / total;
        const highConfidence = batchResults.filter(r => r.confidence >= 0.8).length;
        
        return {
        avgConfidence: avgConfidence * 100,
        totalProcessed: total,
        highConfidenceCount: highConfidence
        };
    };

    const stats = getOverallStats();

    const handleSort = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
    };

    const handleVideoSelect = (result, index) => {
        setSelectedClip(index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <button 
                        onClick={onBack}
                        className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors mr-4"
                    >
                        <ArrowLeft size={18} className="mr-1" />
                        Back
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recognition Results</h1>
                        <p className="text-gray-600">Sign language recognition analysis results</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download size={18} className="mr-2" />
                    Export Results
                </button>
                </div>
            </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-gray-600">Average Confidence</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.avgConfidence.toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp size={24} className="text-blue-600" />
                </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-gray-600">High Confidence</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.highConfidenceCount}/{stats.totalProcessed}</div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle size={24} className="text-green-600" />
                </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-gray-600">Videos Processed</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalProcessed}</div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                    <Video size={24} className="text-purple-600" />
                </div>
                </div>
            </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Search size={16} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search files or signs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-2 w-64"
                        />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Filter size={16} className="text-gray-500" />
                        <select 
                            value={filterMode} 
                            onChange={(e) => setFilterMode(e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="all">All Results</option>
                            <option value="high_confidence">High Confidence (≥80%)</option>
                            <option value="low_confidence">Low Confidence (&lt;80%)</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <button
                            onClick={() => handleSort('filename')}
                            className={`flex items-center px-3 py-1 rounded text-sm transition-colors ${
                                sortBy === 'filename' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Filename {sortBy === 'filename' && (sortOrder === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                        </button>
                        <button
                            onClick={() => handleSort('confidence')}
                            className={`flex items-center px-3 py-1 rounded text-sm transition-colors ${
                                sortBy === 'confidence' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Confidence {sortBy === 'confidence' && (sortOrder === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                        </button>
                    </div>
                    
                    <div className="text-sm text-gray-500 ml-auto">
                        Showing {filteredResults.length} of {batchResults.length} results
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Results Table */}
            <div className="xl:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-xl font-semibold text-gray-800">Results Overview</h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                selectedModel === 'transformer' 
                                    ? 'bg-purple-500 text-white' 
                                    : 'bg-blue-500 text-white'
                            }`}>
                                {selectedModel === 'transformer' ? 'Transformer' : 'IV3-GRU'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recognized Sign</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResults.map((result, index) => (
                        <tr 
                            key={result.id}
                            className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedClip === index ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => handleVideoSelect(result, index)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-16 bg-gray-900 rounded overflow-hidden mr-3">
                                <div className="w-full h-full flex items-center justify-center">
                                    <Video size={16} className="text-white" />
                                </div>
                                </div>
                                <div>
                                <div className="text-sm font-medium text-gray-900">{result.filename}</div>
                                <div className="text-xs text-gray-500">Video file</div>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-blue-600">{result.predictedSign}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3 max-w-[60px]">
                                <div 
                                    className={`h-2 rounded-full ${
                                    result.confidence >= 0.8 ? 'bg-green-500' : 
                                    result.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${result.confidence * 100}%` }}
                                />
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                {(result.confidence * 100).toFixed(1)}%
                                </span>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            
            {/* Selected Video Details */}
            <div className="space-y-6">
                {filteredResults[selectedClip] && (
                <>
                    {/* Video Preview */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Video Preview</h3>
                        </div>
                        <div className="relative bg-black aspect-video">
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <Video size={48} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm opacity-75">Video Preview</p>
                                    <p className="text-xs opacity-50">{filteredResults[selectedClip].filename}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Video</h3>
                    <div className="space-y-4">
                        <div>
                        <div className="text-sm font-medium text-gray-600 mb-2">Filename</div>
                        <div className="text-lg font-bold text-gray-900">{filteredResults[selectedClip].filename}</div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-900">Predicted Sign</div>
                        <div className="text-2xl font-bold text-blue-700">{filteredResults[selectedClip].predictedSign}</div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-900 mb-2">Confidence Score</div>
                        <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                            <div 
                                className={`h-3 rounded-full ${
                                filteredResults[selectedClip].confidence >= 0.8 ? 'bg-green-500' : 
                                filteredResults[selectedClip].confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${filteredResults[selectedClip].confidence * 100}%` }}
                            />
                            </div>
                            <span className="text-sm font-medium">
                            {(filteredResults[selectedClip].confidence * 100).toFixed(1)}%
                            </span>
                        </div>
                        </div>
                    </div>
                    </div>
                </>
                )}
            </div>
            </div>
        </div>
        </div>
    );
}