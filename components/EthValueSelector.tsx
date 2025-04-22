import { useState, useEffect } from 'react';

const EthValueSelector = ({ onValueChange, minValue = 0.001, maxValue = 10, defaultValue = 0.1 }) => {
  const [ethValue, setEthValue] = useState(defaultValue);
  const [isCustom, setIsCustom] = useState(false);
  
  // Predefined values
  const quickValues = [0.01, 0.05, 0.1, 0.5, 1];
  
  useEffect(() => {
    // Notify parent component when value changes
    onValueChange(ethValue);
  }, [ethValue, onValueChange]);
  
  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= minValue && value <= maxValue) {
      setEthValue(value);
    }
  };
  
  const handleQuickValueClick = (value) => {
    setIsCustom(false);
    setEthValue(value);
  };
  
  const handleCustomToggle = () => {
    setIsCustom(true);
  };
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        ETH Amount
      </label>
      
      {/* Quick value selection */}
      <div className="flex flex-wrap gap-2 mb-3">
        {quickValues.map((value) => (
          <button
            key={value}
            onClick={() => handleQuickValueClick(value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !isCustom && ethValue === value 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {value} ETH
          </button>
        ))}
        <button
          onClick={handleCustomToggle}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isCustom 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Custom
        </button>
      </div>
      
      {/* Custom value slider and input */}
      <div className={`${isCustom ? 'block' : 'hidden'} space-y-3`}>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={0.1}
            value={ethValue}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="relative">
            <input
              type="number"
              min={minValue}
              max={maxValue}
              step={0.1}
              value={ethValue}
              onChange={handleInputChange}
              className="w-24 p-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg text-right bg-white dark:bg-gray-800"
            />
            <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400">ETH</span>
          </div>
        </div>
        
        {/* Min/Max display */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{minValue} ETH</span>
          <span>{maxValue} ETH</span>
        </div>
      </div>
      
      {/* Selected value display (when not in custom mode) */}
      {!isCustom && (
        <div className="mt-2 text-center font-medium text-blue-600 dark:text-blue-400">
          Selected: {ethValue} ETH
        </div>
      )}
    </div>
  );
};

export default EthValueSelector;