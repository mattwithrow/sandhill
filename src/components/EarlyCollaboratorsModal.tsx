import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

interface EarlyCollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EarlyCollaboratorsModal: React.FC<EarlyCollaboratorsModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSignUp = () => {
    navigate('/login?signup=true');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        {/* Close button */}
        <button
          onClick={onClose}
          className="modal-close-button"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Modal content */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Sandhill is brand new, and we're looking for early collaborators.
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            The more ideas and experts that join in, the more creative, meaningful things we can bring to life together.
          </p>
          
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">
              Want to be part of it from the ground up?
            </p>
            
            <p className="text-gray-600">
              Sign up and help shape what gets built.
            </p>
            
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleSignUp}
                className="btn btn-primary w-full"
              >
                Sign Up
              </button>
              <button
                onClick={onClose}
                className="btn btn-outline w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render at document root
  return createPortal(modalContent, document.body);
};

export default EarlyCollaboratorsModal; 