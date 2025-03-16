interface ConvertButtonProps {
    onClick: () => void;
    disabled: boolean;
    isLoading: boolean
  }
  
  export default function ConvertButton({ onClick, disabled, isLoading }: ConvertButtonProps) {
    return (
      <button
        className={`w-full p-3 rounded-lg text-white ${disabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        onClick={onClick}
        disabled={disabled}
      >
        {disabled ? 'Converting...' : 'Convert to Podcast'}
      </button>
    );
  }