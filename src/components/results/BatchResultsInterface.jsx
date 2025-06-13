import { useState } from 'react';
import { Video, CheckCircle, AlertTriangle, Download, Share, Filter, TrendingUp } from 'lucide-react';

export default function SimplifiedResultsInterface() {
    const [selectedClip, setSelectedClip] = useState(0);
    const [filterMode, setFilterMode] = useState('all'); // all, high_confidence, low_confidence

    // Simplified batch results data - model recognitions only
    const batchResults = [
        {
        id: 1,
        filename: "hello_sign.mp4",
        predictedSign: "HELLO",
        confidence: 0.94,
        processingTime: 156
        },
        {
        id: 2,
        filename: "goodbye_sign.mp4",
        predictedSign: "GOODBYE",
        confidence: 0.89,
        processingTime: 142
        },
        {
        id: 3,
        filename: "welcome_sign.mp4",
        predictedSign: "HELLO",
        confidence: 0.78,
        processingTime: 167
        },
        {
        id: 4,
        filename: "thank_you_sign.mp4",
        predictedSign: "THANK YOU",
        confidence: 0.92,
        processingTime: 189
        },
        {
        id: 5,
        filename: "please_sign.mp4",
        predictedSign: "PLEASE",
        confidence: 0.87,
        processingTime: 203
        },
        {
        id: 6,
        filename: "yes_sign.mp4",
        predictedSign: "NO",
        confidence: 0.65,
        processingTime: 174
        },
        {
        id: 7,
        filename: "no_sign.mp4",
        predictedSign: "NO",
        confidence: 0.91,
        processingTime: 158
        },
        {
        id: 8,
        filename: "sorry_sign.mp4",
        predictedSign: "SORRY",
        confidence: 0.83,
        processingTime: 195
        }
    ];

    const filteredResults = batchResults.filter(result => {
        if (filterMode === 'all') return true;
        if (filterMode === 'high_confidence') return result.confidence >= 0.8;
        if (filterMode === 'low_confidence') return result.confidence < 0.8;
        return true;
    });

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Recognition Results</h1>
                <p className="text-gray-600">Sign language recognition analysis results</p>
                </div>
                <div className="flex items-center space-x-3">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download size={18} className="mr-2" />
                    Export Results
                </button>
                <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share size={18} className="mr-2" />
                    Share
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Results Table */}
            <div className="xl:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Results Overview</h2>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Filter size={16} className="text-gray-500" />
                        <select 
                        value={filterMode} 
                        onChange={(e) => setFilterMode(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                        >
                        <option value="all">All Results</option>
                        <option value="high_confidence">High Confidence (≥80%)</option>
                        <option value="low_confidence">Low Confidence (&lt;80%)</option>
                        </select>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResults.map((result, index) => (
                        <tr 
                            key={result.id}
                            className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedClip === index ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => setSelectedClip(index)}
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
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{result.processingTime}ms</div>
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
                        
                        <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-900 mb-1">Processing Time</div>
                        <div className="text-lg font-bold text-gray-700">{filteredResults[selectedClip].processingTime}ms</div>
                        </div>
                    </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recognition Details</h3>
                    <div className="space-y-3">
                        {filteredResults[selectedClip].confidence >= 0.8 && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                            <CheckCircle size={20} className="text-green-600 mr-2" />
                            <div>
                                <div className="font-medium text-green-800">High Confidence Recognition</div>
                                <div className="text-sm text-green-700">
                                The model is confident about this recognition ({(filteredResults[selectedClip].confidence * 100).toFixed(1)}%).
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                        
                        {filteredResults[selectedClip].confidence < 0.8 && filteredResults[selectedClip].confidence >= 0.6 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center">
                            <AlertTriangle size={20} className="text-yellow-600 mr-2" />
                            <div>
                                <div className="font-medium text-yellow-800">Moderate Confidence</div>
                                <div className="text-sm text-yellow-700">
                                The model has moderate confidence in this recognition ({(filteredResults[selectedClip].confidence * 100).toFixed(1)}%).
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                        
                        {filteredResults[selectedClip].confidence < 0.6 && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                            <AlertTriangle size={20} className="text-red-600 mr-2" />
                            <div>
                                <div className="font-medium text-red-800">Low Confidence</div>
                                <div className="text-sm text-red-700">
                                The model has low confidence in this recognition ({(filteredResults[selectedClip].confidence * 100).toFixed(1)}%). Review recommended.
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
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