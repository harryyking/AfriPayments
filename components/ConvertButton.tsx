interface ConvertButtonProps {
    onClick: () => void;
    disabled: boolean;
    isLoading: boolean
  }
  
  export default function ConvertButton({ onClick, disabled, isLoading }: ConvertButtonProps) {
    return (
      <button
        className={`btn  ${disabled ? 'btn-disabled' : 'btn-primary'}`}
        onClick={onClick}
        disabled={disabled}
      >
        {disabled ? 'Converting...' : 'Convert to Podcast'}
      </button>
    );
  }