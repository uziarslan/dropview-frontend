import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft, 
  Star, 
  Video, 
  Type, 
  Pause, 
  RotateCcw, 
  ArrowRight,
  Camera,
  CheckCircle,
  Info
} from 'lucide-react';

export function ReviewFlow({ onComplete, userProfile }) {
  const navigate = useNavigate();
  const [reviewType, setReviewType] = useState('text');
  const [showVideoGuide, setShowVideoGuide] = useState(false);
  
  // Text review state
  const [textReview, setTextReview] = useState('');
  const [rating, setRating] = useState(0);
  
  // Video review state
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimer = useRef(0);

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 720, height: 1280 },
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setVideoDuration(recordingTimer.current);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      const startTime = Date.now();
      const timer = setInterval(() => {
        recordingTimer.current = Math.floor((Date.now() - startTime) / 1000);
        if (recordingTimer.current >= 180) { // 3 minutes max
          stopVideoRecording();
        }
      }, 1000);

      mediaRecorder.addEventListener('stop', () => clearInterval(timer));

    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please allow camera permissions and try again.');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const retakeVideo = () => {
    setVideoUrl('');
    setVideoDuration(0);
    recordingTimer.current = 0;
  };

  const handleSubmit = () => {
    onComplete();
    navigate('/dashboard');
  };

  const isFormValid = () => {
    if (reviewType === 'text') {
      return textReview.trim().length > 0 && rating > 0;
    } else {
      return videoUrl.length > 0;
    }
  };

  const VideoGuideOverlay = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 bg-white">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center mx-auto mb-4">
            <Video className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-display text-xl text-[#2d2d2d] mb-2">
            How to Make an Effective Video Review
          </h3>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-medium">1</span>
            </div>
            <div>
              <h4 className="font-medium text-[#2d2d2d] mb-1">Be authentic and honest</h4>
              <p className="text-sm text-[#2d2d2d]/70">Share your genuine experience, both positive and negative aspects</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-medium">2</span>
            </div>
            <div>
              <h4 className="font-medium text-[#2d2d2d] mb-1">Show how you use the product</h4>
              <p className="text-sm text-[#2d2d2d]/70">Demonstrate the product in action and how it fits into your routine</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-medium">3</span>
            </div>
            <div>
              <h4 className="font-medium text-[#2d2d2d] mb-1">Mention what you liked and what could improve</h4>
              <p className="text-sm text-[#2d2d2d]/70">Help others understand the pros and cons from your perspective</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowVideoGuide(false)}
            variant="outline"
            className="flex-1"
          >
            Got it!
          </Button>
          <Button
            onClick={() => {
              setShowVideoGuide(false);
              startVideoRecording();
            }}
            className="flex-1 bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90"
          >
            Start Recording
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD1DC]/10 via-white to-[#A7DADC]/10">
      {/* Video Guide Overlay */}
      {showVideoGuide && <VideoGuideOverlay />}

      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-[#2d2d2d] mb-4">
              Share Your Product Experience
            </h1>
            <p className="text-lg text-[#2d2d2d]/70 max-w-2xl mx-auto">
              Help others discover great products by sharing your honest feedback. Choose the review format that feels most comfortable for you.
            </p>
          </div>

          <Card className="p-6 shadow-lg border-0">
            <Tabs value={reviewType} onValueChange={(value) => setReviewType(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Written Review
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video Review
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Written Review</h3>
                      <p className="text-sm text-blue-700">
                        Share your detailed thoughts in writing. Include how you used the product, what you liked, and any areas for improvement.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="block mb-3">How would you rate this product overall?</Label>
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="group"
                      >
                        <Star 
                          className={`h-10 w-10 transition-colors ${
                            star <= rating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300 group-hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="block mb-3">Tell us about your experience</Label>
                  <Textarea
                    placeholder="How did this product work for you? What did you like about it? What could be improved? Be specific and honest - your feedback helps both the brand and other users."
                    value={textReview}
                    onChange={(e) => setTextReview(e.target.value)}
                    className="min-h-40 resize-none"
                    rows={8}
                  />
                  <div className="flex justify-between items-center mt-2 text-xs text-[#2d2d2d]/60">
                    <span>{textReview.length} characters</span>
                    <span>
                      {textReview.length < 50 ? 'Tell us more for a helpful review' : 
                       textReview.length < 150 ? 'Good detail - keep going!' : 
                       'Great detailed review! 👍'}
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-purple-800 mb-1">Video Review</h3>
                      <p className="text-sm text-purple-700">
                        Record a video showing and telling us about your experience. This format helps others see the product in action.
                      </p>
                    </div>
                  </div>
                </div>

                {!videoUrl ? (
                  <div className="space-y-6">
                    <div className="bg-black rounded-lg aspect-[9/16] max-w-sm mx-auto overflow-hidden relative">
                      <video 
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      {!isRecording && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Camera className="h-16 w-16 text-white/70" />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center space-y-4">
                      {!isRecording ? (
                        <div className="space-y-4">
                          <Button
                            onClick={() => setShowVideoGuide(true)}
                            variant="outline"
                            className="mr-3"
                          >
                            <Info className="mr-2 h-4 w-4" />
                            Review Tips
                          </Button>
                          <Button
                            onClick={startVideoRecording}
                            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full"
                          >
                            <Video className="mr-2 h-5 w-5" />
                            Start Recording
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-red-500 font-medium text-lg">
                            🔴 Recording... {recordingTimer.current}s
                          </div>
                          <Button
                            onClick={stopVideoRecording}
                            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-full"
                          >
                            <Pause className="mr-2 h-5 w-5" />
                            Stop Recording
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-black rounded-lg aspect-[9/16] max-w-sm mx-auto overflow-hidden">
                      <video 
                        src={videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                        <CheckCircle className="h-5 w-5" />
                        Video recorded successfully ({videoDuration}s)
                      </div>
                      <Button
                        onClick={retakeVideo}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Record Again
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="pt-8 border-t border-gray-100 mt-8">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className="w-full bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 py-3 disabled:opacity-50"
              >
                Submit Your Review
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-[#2d2d2d]/60">
                  Your honest feedback helps improve products and guides other users
                </p>
              </div>
            </div>
          </Card>

          {/* Review Guidelines */}
          <Card className="p-6 bg-gray-50 border-0">
            <h3 className="font-display text-lg text-[#2d2d2d] mb-4">Review Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-[#2d2d2d]/70">
              <div>
                <h4 className="font-medium text-[#2d2d2d] mb-2">What to Include</h4>
                <ul className="space-y-1">
                  <li>• How you used the product</li>
                  <li>• What you liked about it</li>
                  <li>• Any issues or improvements</li>
                  <li>• Who might benefit from it</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[#2d2d2d] mb-2">Keep in Mind</h4>
                <ul className="space-y-1">
                  <li>• Be honest and specific</li>
                  <li>• Focus on your personal experience</li>
                  <li>• Help others make informed decisions</li>
                  <li>• Be respectful and constructive</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}