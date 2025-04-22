import React from 'react';

interface RevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMoves: string | null;
  setShowRevealModal: (value: boolean) => void;
  setErrorMessage: (msg: string) => void;
  passPhrase: string;
  setPassPhrase: (val: string) => void;
  setShowInviteModal: (value: boolean) => void;
  handleRegister: () => void;
  handleRevealOutcome: () => void;
}

const RevealModal: React.FC<RevealModalProps> = ({
  showRevealModal,  
  selectedMoves,
  setShowRevealModal,
  setErrorMessage,
  passPhrase,
  setPassPhrase,
  setShowInviteModal,
  handleRegister,
  handleRevealOutcome,
}) => {
  if (!showRevealModal) return null;

  if (!selectedMoves) {
    setShowRevealModal(false);
    setErrorMessage("Please select a move.");
    return null;
  }

  const handleReveal = () => {
    if (!selectedMoves) {
      setErrorMessage("Please select a move.");
      return;
    }
    // handleRegister();
    setShowRevealModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={() => setShowRevealModal(false)}
      ></div>

      {/* Modal Card */}
      <div className="relative w-96 rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5">
          <h2 className="text-2xl font-bold text-white text-center">Reveal Move</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Pass Phrase Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reveal Pass Phrase
            </label>
            <input
              type="text"
              placeholder="Enter Pass Phrase"
              value={passPhrase}
              onChange={(e) => setPassPhrase(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowRevealModal(false)}
              className="px-6 py-3 rounded-xl font-medium bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleRevealOutcome}
              className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
                Reveal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevealModal;
