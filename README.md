# Filipino Sign Language Recognition System

A modern web-based GUI application for Filipino Sign Language recognition using deep learning models. This project demonstrates an intuitive interface for uploading, processing, and analyzing sign language videos with real-time keypoint visualization and batch processing capabilities.

## 🎯 Project Overview

This application serves as the graphical user interface for a thesis project focused on Filipino Sign Language (FSL) recognition. It provides a comprehensive workflow from video upload to sign recognition results, featuring two state-of-the-art deep learning models for comparison and analysis.

## ✨ Key Features

### 🎥 Video Upload & Management

- **Single & Batch Upload**: Upload individual videos or multiple files simultaneously
- **Drag & Drop Interface**: Intuitive file handling with visual feedback
- **Video Preview**: Built-in video player with standard controls
- **File Validation**: Automatic format checking and size limits
- **Progress Tracking**: Real-time upload progress with detailed status

### 🤖 Dual Model Architecture

- **InceptionV3-GRU Model**: CNN-based feature extraction with recurrent temporal analysis
- **MHAM-Transformer Model**: Multi-Head Attention Mechanism for advanced sequence processing
- **Model Comparison**: Side-by-side performance evaluation capabilities

### 🔍 Real-time Visualization

- **Keypoint Detection**: Live visualization of hand and body landmarks
- **Skeleton Overlay**: Connected joint visualization for movement analysis
- **Frame-by-frame Analysis**: Detailed inspection of recognition process
- **Confidence Scoring**: Real-time confidence metrics display

### 📊 Comprehensive Results

- **Batch Processing Results**: Overview of multiple video analyses
- **Detailed Analytics**: Confidence scores, processing times, and accuracy metrics
- **Export Functionality**: Download results in various formats
- **Search & Filter**: Advanced result filtering and sorting options

## 🛠️ Technology Stack

### Frontend Framework

- **React 18** with Hooks for modern component architecture
- **Tailwind CSS** for responsive, utility-first styling
- **Lucide React** for consistent iconography

### Core Libraries

- **File Management**: Advanced drag-and-drop with validation
- **Video Processing**: Built-in HTML5 video controls with custom overlays
- **Data Visualization**: SVG-based keypoint rendering and skeleton connections
- **State Management**: React hooks for efficient state handling

### UI/UX Features

- **Responsive Design**: Optimized for desktop and tablet viewing
- **Dark/Light Themes**: Adaptive color schemes
- **Smooth Animations**: CSS transitions and micro-interactions
- **Accessibility**: WCAG compliant interface elements

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser with video codec support

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/fsl-recognition-gui.git
   cd fsl-recognition-gui
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## 📁 Project Structure

```
src/
├── components/
│   ├── App.jsx                    # Main application component
│   ├── upload/
│   │   └── FileUploadInterface.jsx    # Video upload and management
│   ├── processing/
│   │   └── ProcessingLoader.jsx       # Real-time processing visualization
│   ├── visualization/
│   │   └── KeypointVisualization.jsx  # Keypoint overlay and analysis
│   └── results/
│       └── BatchResultsInterface.jsx  # Results display and export
├── styles/
│   ├── App.css                   # Component-specific styles
│   └── index.css                 # Global styles and Tailwind imports
└── main.jsx                      # Application entry point
```

## 🎮 Usage Guide

### 1. Upload Videos

- Navigate to the Upload tab
- Choose between single or batch upload mode
- Drag and drop video files or use the file browser
- Preview uploaded videos in the built-in player
- Select your preferred recognition model (InceptionV3-GRU or Transformer)

### 2. Processing

- Monitor real-time processing steps:
  - Video preprocessing and frame extraction
  - Keypoint detection using MediaPipe
  - Feature extraction through CNN layers
  - Temporal analysis via GRU/Transformer
  - Final sign classification
- View detailed progress for each processing stage

### 3. Visualization

- Examine frame-by-frame keypoint detection
- Toggle between keypoint and skeleton views
- Navigate through video frames manually or with playback
- View real-time confidence scores and predictions
- Compare results across multiple videos

### 4. Results Analysis

- Review batch processing outcomes
- Filter results by confidence levels
- Search through predictions and filenames
- Export data for further analysis
- Generate comprehensive reports

## 🎨 Model Information

### InceptionV3-GRU Architecture

- **Feature Extraction**: InceptionV3 CNN for spatial feature learning
- **Temporal Processing**: Bidirectional GRU for sequence modeling
- **Keypoint Input**: 21 hand landmarks + 33 pose keypoints per frame
- **Processing Speed**: Optimized for real-time applications

### MHAM-Transformer Architecture

- **Attention Mechanism**: Multi-Head Attention for parallel processing
- **Positional Encoding**: Sinusoidal encoding for temporal relationships
- **Self-Attention**: Capturing long-range dependencies in sign sequences
- **Advanced Processing**: Superior accuracy for complex sign recognition

## 📊 Dataset Information

- **FSL-105 Dataset**: Comprehensive Filipino Sign Language vocabulary
- **Video Format**: MP4, MOV, AVI, WebM supported
- **Frame Rate**: Standardized to 30 FPS for consistency
- **Resolution**: Adaptive processing for various input resolutions

## 🔧 Configuration

### Model Selection

- Switch between models in the upload interface
- Compare performance metrics across architectures
- Adjust processing parameters based on video characteristics

### Visualization Options

- Toggle keypoint visibility
- Customize skeleton rendering
- Adjust confidence threshold displays
- Modify color schemes for different data types

## 📈 Performance Metrics

The application tracks and displays:

- **Recognition Accuracy**: Per-video confidence scores
- **Processing Speed**: Frame-by-frame timing analysis
- **Model Comparison**: Side-by-side performance evaluation
- **Batch Statistics**: Aggregate results across multiple videos

## 🤝 Contributing

This is a thesis demonstration project. For academic collaboration or research inquiries, please contact the project maintainers.

## 📄 License

This project is part of academic research. Please respect intellectual property rights and cite appropriately if using for academic purposes.

## 📧 Contact

For questions about this thesis project or the Filipino Sign Language recognition system, please reach out through appropriate academic channels.

---

**Note**: This is a GUI demonstration for a thesis project. The actual deep learning models and backend processing are simulated for interface showcase purposes.
