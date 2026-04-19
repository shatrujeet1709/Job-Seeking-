import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';
import { uploadResume } from '../api/profileApi';
import { updateResumeUrl } from '../store/profileSlice';
import toast from 'react-hot-toast';

export default function UploadResume({ currentUrl }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleFileChange = async (file) => {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadResume(file);
      dispatch(updateResumeUrl(res.resumeUrl));
      toast.success('Resume uploaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">Resume (PDF)</label>
      
      {currentUrl ? (
        <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-xl">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="h-6 w-6" />
            <div>
              <p className="font-medium">Resume Uploaded</p>
              <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline hover:text-green-800">
                View current resume
              </a>
            </div>
          </div>
          <label className="cursor-pointer text-sm font-medium text-primary hover:text-primary-dark">
            Replace
            <input type="file" className="hidden" accept=".pdf" onChange={handleChange} />
          </label>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            ) : (
              <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">{isUploading ? 'Uploading...' : 'Click to upload'}</span> {!isUploading && 'or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
          </div>
          <input type="file" className="hidden" accept=".pdf" onChange={handleChange} disabled={isUploading} />
        </label>
      )}
    </div>
  );
}
