/**
 * Centralized Icon exports using lucide-react
 * Icons used in the application
 */

// Legacy icon exports - used in orderBoard.jsx
export const PlusSquareIcon = ({ className = "h-5 w-5" }) => {
  const { PlusSquare } = require("lucide-react");

  return <PlusSquare className={className} />;
};

export const RefreshIcon = ({ className = "h-5 w-5" }) => {
  const { RefreshCw } = require("lucide-react");

  return <RefreshCw className={className} />;
};
