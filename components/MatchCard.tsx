
import React from 'react';
import { MatchPrediction } from '../types';
import { Info, ChartPie } from './Icons';

interface MatchCardProps {
  match: MatchPrediction;
  index: number;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, index }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 transition-all hover:bg-slate-800 hover:border-emerald-500/50 group">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          {match.league}
        </span>
        <span className="text-slate-500 text-xs font-medium">
          #{index + 1} • {match.time}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-center">
          <p className="font-bold text-sm md:text-base text-white">{match.homeTeam}</p>
        </div>
        <div className="px-3 text-emerald-500 font-bold italic text-xs">VS</div>
        <div className="flex-1 text-center">
          <p className="font-bold text-sm md:text-base text-white">{match.awayTeam}</p>
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-700/50 pt-3">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/10 p-1 rounded">
             <ChartPie className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-xs font-semibold text-emerald-400">CustomBet Inteligente</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/30 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Mercado 1</p>
            <p className="text-xs font-semibold text-slate-100">{match.customBet.market1}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/30 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Mercado 2</p>
            <p className="text-xs font-semibold text-slate-100">{match.customBet.market2}</p>
          </div>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2 flex items-start gap-2">
          <Info className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] leading-tight text-slate-300 italic">
            "{match.insight}"
          </p>
        </div>

        <div className="flex justify-between items-center pt-1">
          <div className="h-1.5 flex-1 bg-slate-700 rounded-full overflow-hidden mr-3">
            <div 
              className="h-full bg-emerald-500" 
              style={{ width: `${match.probability}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-emerald-500">{match.probability}% Prob.</span>
        </div>
      </div>
    </div>
  );
};
