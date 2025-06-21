import { useState } from 'react';
import FileUploadInterface from './upload/FileUploadInterface';
import ProcessingLoader from './processing/ProcessingLoader';
import KeypointVisualization from './visualization/KeypointVisualization';
import BatchResultsInterface from './results/BatchResultsInterface';

function App() {
    const [currentStep, setCurrentStep] = useState('upload'); // upload, processing, visualization, results

    const renderCurrentStep = () => {
        switch(currentStep) {
        case 'upload':
            return <FileUploadInterface onNext={() => setCurrentStep('processing')} />;
        case 'processing':
            return <ProcessingLoader onComplete={() => setCurrentStep('visualization')} />;
        case 'visualization':
            return <KeypointVisualization onNext={() => setCurrentStep('results')} />;
        case 'results':
            return <BatchResultsInterface onBack={() => setCurrentStep('upload')} />;
        default:
            return <FileUploadInterface onNext={() => setCurrentStep('processing')} />;
        }
    };

    return (
        <div className="App">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Filipino Sign Language Recognition</h1>
            <div className="flex space-x-2">
                {['upload', 'processing', 'visualization', 'results'].map((step) => (
                <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    currentStep === step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                </button>
                ))}
            </div>
            </div>
        </nav>

        {/* Main Content */}
        <main>
            {renderCurrentStep()}
        </main>
        </div>
    );
}

export default App;