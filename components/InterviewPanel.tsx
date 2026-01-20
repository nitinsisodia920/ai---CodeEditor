
import React from 'react';

const InterviewPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-none p-5 bg-[var(--bg-sidebar)]">
      <div className="flex items-center gap-2 mb-6">
        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[8px] font-black rounded uppercase tracking-widest">Medium</span>
        <span className="text-[10px] font-bold opacity-30 tracking-widest uppercase">Array, Greedy</span>
      </div>

      <h2 className="text-[14px] font-black text-[var(--text-highlight)] uppercase tracking-tight mb-4">
        1. Maximum Area Island
      </h2>

      <div className="space-y-4 text-[12px] leading-relaxed text-[var(--text-app)]">
        <p>
          You are given an <code>m x n</code> binary matrix <code>grid</code>. An island is a group of <code>1</code>'s (representing land) connected 4-directionally (horizontal or vertical). You may assume all four edges of the grid are surrounded by water.
        </p>
        <p>
          The <strong>area</strong> of an island is the number of cells with value <code>1</code> in the island.
        </p>
        <p>
          Return <em>the maximum <strong>area</strong> of an island</em> in <code>grid</code>. If there is no island, return <code>0</code>.
        </p>

        <div className="mt-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Example 1</h3>
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 font-mono text-[11px] space-y-2">
            <div><span className="opacity-30">Input:</span> grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0], ...]</div>
            <div><span className="opacity-30">Output:</span> 6</div>
            <div className="opacity-50 mt-2">Explanation: The answer is not 11, because the island must be connected 4-directionally.</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Constraints</h3>
          <ul className="list-disc list-inside space-y-1 opacity-60 text-[11px]">
            <li>m == grid.length</li>
            <li>n == grid[i].length</li>
            <li>1 &le; m, n &le; 50</li>
            <li>grid[i][j] is either 0 or 1.</li>
          </ul>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">Ready to submit?</p>
      </div>
    </div>
  );
};

export default InterviewPanel;
