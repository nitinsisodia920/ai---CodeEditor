
import React from 'react';

interface MongoPlaygroundProps {
  results: any;
  isLoading: boolean;
}

const MongoPlayground: React.FC<MongoPlaygroundProps> = ({ results, isLoading }) => {
  return (
    <div className="h-full bg-[#0d1117] flex flex-col">
      <div className="px-4 py-2 border-b border-[#30363d] flex items-center justify-between text-xs font-mono text-gray-400">
        <span>MONGODB RESULTS</span>
        <div className="flex gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Simulation Active
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <pre className="text-blue-300">
            {results ? JSON.stringify(results, null, 2) : "// No results to display. Run a query."}
          </pre>
        )}
      </div>
    </div>
  );
};

export default MongoPlayground;
