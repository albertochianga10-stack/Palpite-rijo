
import React, { useState, useEffect } from 'react';
import { generateDailyBetSlip } from './geminiService';
import { BetSlip, AppState } from './types';
import { MatchCard } from './components/MatchCard';
import { Loader, SoccerBall, Calendar, Trophy } from './components/Icons';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [slip, setSlip] = useState<BetSlip | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchPredictions = async (date: string) => {
    setState(AppState.LOADING);
    try {
      const data = await generateDailyBetSlip(date);
      setSlip(data);
      setState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setState(AppState.ERROR);
    }
  };

  useEffect(() => {
    fetchPredictions(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const saveToFavorites = () => {
    if (slip) {
      const saved = localStorage.getItem('f14_favorites');
      const list = saved ? JSON.parse(saved) : [];
      list.push(slip);
      localStorage.setItem('f14_favorites', JSON.stringify(list.slice(-10))); // keep last 10
      alert('Ficha salva nos favoritos!');
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <SoccerBall className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">FICHA<span className="text-emerald-500">14</span></h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Palpites CustomBet de IA</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 px-3">
              <Calendar className="text-slate-400" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={handleDateChange}
                className="bg-transparent text-sm font-semibold focus:outline-none text-white cursor-pointer"
              />
            </div>
            <button 
              onClick={() => fetchPredictions(selectedDate)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              ATUALIZAR
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8">
        {state === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader className="w-12 h-12 text-emerald-500 animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Analisando calendários...</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Nossa IA está consultando o BeSoccer e processando as melhores estatísticas para {selectedDate}.
              </p>
            </div>
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-lg mx-auto">
            <h3 className="text-red-400 font-bold mb-2">Ops! Falha na Conexão</h3>
            <p className="text-slate-300 text-sm mb-6">Não conseguimos obter os palpites de hoje. Verifique sua chave de API ou tente novamente.</p>
            <button 
              onClick={() => fetchPredictions(selectedDate)}
              className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {state === AppState.SUCCESS && slip && (
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* Summary Banner */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <Trophy className="w-48 h-48" />
              </div>
              
              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-widest">
                    BILHETE DO DIA
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    slip.reliability === 'Alta' ? 'bg-green-400 text-green-950' : 
                    slip.reliability === 'Média' ? 'bg-yellow-400 text-yellow-950' : 'bg-orange-400 text-orange-950'
                  }`}>
                    Confiança: {slip.reliability}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  FICHA DE 14 JOGOS <br/>
                  <span className="text-emerald-200">COMBINADA INTELIGENTE</span>
                </h2>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="bg-black/20 px-4 py-2 rounded-2xl">
                    <p className="text-[10px] text-emerald-200 uppercase font-bold">Odds Estimadas</p>
                    <p className="text-xl font-black text-white">@{slip.totalOddsEstimate}</p>
                  </div>
                  <div className="bg-black/20 px-4 py-2 rounded-2xl">
                    <p className="text-[10px] text-emerald-200 uppercase font-bold">Total Jogos</p>
                    <p className="text-xl font-black text-white">14/14</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex gap-3">
                <button 
                  onClick={saveToFavorites}
                  className="bg-white text-emerald-900 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-transform"
                >
                  Salvar Ficha
                </button>
              </div>
            </div>

            {/* Match Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {slip.matches.map((match, index) => (
                <MatchCard key={match.id} match={match} index={index} />
              ))}
            </div>

            {/* Footer Disclaimer */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 text-center">
              <p className="text-slate-500 text-xs leading-relaxed max-w-2xl mx-auto italic">
                Aviso: Nossas análises utilizam algoritmos de IA e dados históricos do BeSoccer, porém apostas envolvem risco. Aposte com responsabilidade. Os palpites de CustomBet são sugestões baseadas em probabilidade estatística.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
