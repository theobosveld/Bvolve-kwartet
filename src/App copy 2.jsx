import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Cpu, Trophy, RotateCcw, Play, Info,
  Shield, Database, FileSpreadsheet, Bot, 
  CheckCircle, Network, BarChart3, Scale, 
  ArrowLeftRight, ImageOff
} from 'lucide-react';

// --- CONFIGURATIE ---
// Je kunt hieronder bij 'imageUrl' de bestandsnaam invullen.
// De code probeert dat plaatje te laden uit de map 'public/images'.
// Bestaat het plaatje niet? Dan toont hij automatisch het Icoon.

const CARD_SETS = {
  datagovernance: {
    label: 'Data Governance',
    themeDescription: 'Het vaststellen van regels, beleid en verantwoordelijkheden voor databeheer.',
    icon: Scale, 
    imageUrl: '/images/Compleetheid.png', // Probeer dit plaatje
    setId: 'DG',
    items: [
      { title: 'Databeleid & Standaarden', description: 'Definieert richtlijnen voor consistent databeheer en kwaliteitsnormen.' },
      { title: 'Data Stewardship', description: 'Verantwoordelijkheid voor kwaliteit, veiligheid en juist gebruik van data.' },
      { title: 'Compliance & Regelgeving', description: 'Voldoen aan wettelijke normen (AVG) en ethisch datagebruik.' },
      { title: 'Datastrategie & Eigenaarschap', description: 'Afstemmen van datamanagement op bedrijfsdoelen.' }
    ]
  },
  dataarchitectuur: {
    label: 'Data Architectuur',
    themeDescription: 'De blauwdruk van hoe data gestructureerd en verplaatst wordt.',
    icon: Network, 
    imageUrl: '/images/architectuur.png', 
    setId: 'DA',
    items: [
      { title: 'Enterprise Data Modellen', description: 'Overkoepelend kader voor hoe data georganiseerd is binnen het bedrijf.' },
      { title: 'Dataflow & Integratie', description: 'Hoe informatie tussen systemen wordt uitgewisseld.' },
      { title: 'Infrastructuur & Platforms', description: 'Hardware en software die dataopslag ondersteunen.' },
      { title: 'Schaalbaarheid & Flexibiliteit', description: 'Systemen die kunnen meegroeien met de organisatie.' }
    ]
  },
  datamodellering: {
    label: 'Data Modelleren',
    themeDescription: 'Het visueel weergeven van datastructuren en relaties.',
    icon: FileSpreadsheet,
    imageUrl: '/images/modelleren.png', 
    setId: 'DM',
    items: [
      { title: 'Conceptuele Modellen', description: 'Hoog-over weergave van data zonder technische details.' },
      { title: 'Logische Modellen', description: 'Gedetailleerde structuur van data, onafhankelijk van techniek.' },
      { title: 'Fysieke Modellen', description: 'Technische implementatie (tabellen, indexen) in de database.' },
      { title: 'ERD Diagrammen', description: 'Schema\'s die relaties tussen data-entiteiten tonen.' }
    ]
  },
  aigeletterdheid: {
    label: 'AI Geletterdheid',
    themeDescription: 'Basisprincipes van Kunstmatige Intelligentie en hoe het werkt.',
    icon: Bot, 
    imageUrl: '/images/ai.png',
    setId: 'AI',
    items: [
      { title: 'Fundament van AI', description: 'De geschiedenis en basisprincipes van kunstmatige intelligentie.' },
      { title: 'Machine Learning', description: 'Computers die leren van data en patronen herkennen.' },
      { title: 'Ethiek in AI', description: 'Morele keuzes, fairness en vooroordelen in algoritmes.' },
      { title: 'AI in Business', description: 'Toepassen van AI om zakelijke uitdagingen op te lossen.' }
    ]
  },
  datakwaliteit: { 
    label: 'Data Kwaliteit', 
    themeDescription: 'Waarborgen dat data nauwkeurig, volledig en consistent is.',
    icon: CheckCircle, 
    imageUrl: '/images/kwaliteit.png',
    setId: 'DQ',
    items: [
      {title: 'Nauwkeurigheid', description: 'Data is correct, vrij van fouten en betrouwbaar.'},
      {title: 'Compleetheid', description: 'Alle benodigde data is aanwezig; er ontbreekt niets.'},
      {title: 'Consistentie', description: 'Data is uniform over verschillende systemen heen.'},
      {title: 'Data Opschonen', description: 'Het opsporen en corrigeren van fouten in datasets.'}
    ] 
  },
  databeveiliging: { 
    label: 'Security & Privacy', 
    themeDescription: 'Beschermen van data tegen ongeautoriseerde toegang.',
    icon: Shield, 
    imageUrl: '/images/security.png',
    setId: 'SP',
    items: [
      {title: 'Toegangscontroles', description: 'Wie mag wat zien? Autorisaties en rollen.'},
      {title: 'Encryptie & Maskering', description: 'Data onleesbaar maken voor onbevoegden.'},
      {title: 'Privacy Regelgeving', description: 'Wettelijke kaders zoals GDPR/AVG naleven.'},
      {title: 'Risicomanagement', description: 'Identificeren en beperken van datalek-risico\'s.'}
    ] 
  },
  dataintegratie: { 
    label: 'Data Integratie', 
    themeDescription: 'Verbinden van databronnen zodat ze samenwerken.',
    icon: ArrowLeftRight, 
    imageUrl: '/images/integratie.png',
    setId: 'DI',
    items: [
      {title: 'ETL Processen', description: 'Extract, Transform, Load: data verplaatsen en opschonen.'},
      {title: 'API\'s & Interfaces', description: 'Systemen laten communiceren via standaarden.'},
      {title: 'Datamigratie', description: 'Data verhuizen van het ene naar het andere systeem.'},
      {title: 'Dataconsolidatie', description: 'Data samenvoegen tot één uniforme weergave.'}
    ] 
  },
  businessintelligence: { 
    label: 'Business Intelligence', 
    themeDescription: 'Omzetten van ruwe data in inzichten via dashboards.',
    icon: BarChart3, 
    imageUrl: '/images/bi.png',
    setId: 'BI',
    items: [
      {title: 'Rapportage', description: 'Presenteren van data in leesbare vorm.'},
      {title: 'Datavisualisatie', description: 'Data vereenvoudigen via grafieken en diagrammen.'},
      {title: 'Voorspellende analyses', description: 'Trends voorspellen op basis van historie.'},
      {title: 'Prestatie indicatoren', description: 'KPI\'s: meten hoe goed een proces presteert.'}
    ] 
  },
};

const ALL_CARDS = Object.entries(CARD_SETS).flatMap(([setKey, setData]) => 
  setData.items.map(itemObj => ({ 
    setKey, 
    ...itemObj, 
    label: setData.label, 
    Icon: setData.icon,
    imageUrl: setData.imageUrl,
    setId: setData.setId
  }))
);

const RANDOM_NAMES = ['Sanne', 'Mark', 'Lisa', 'Tom', 'Kevin', 'Iris', 'Jasper', 'Emma'];

// --- NIEUW COMPONENT: Slimme Afbeelding ---
// Probeert plaatje te laden, valt terug op Icoon bij error.
const SmartImage = ({ src, alt, Icon, className, iconClassName, iconSize = 24 }) => {
  const [hasError, setHasError] = useState(false);

  // Als er geen src is opgegeven, toon direct icoon
  if (!src || hasError) {
    return <Icon size={iconSize} className={iconClassName} />;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setHasError(true)} // Dit vangt de fout op als bestand mist
    />
  );
};

export default function KwartetApp() {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [hands, setHands] = useState({ 0: [], 1: [], 2: [], 3: [] });
  const [completedSets, setCompletedSets] = useState({ 0: [], 1: [], 2: [], 3: [] });
  const [turn, setTurn] = useState(0); 
  const [logs, setLogs] = useState([]);
  const [gameState, setGameState] = useState('setup'); 
  const [selectedCardRequest, setSelectedCardRequest] = useState(null); 
  const [lastAction, setLastAction] = useState(null);
  const [hoveredSet, setHoveredSet] = useState(null);

  const initGame = (name) => {
    const finalName = name.trim() || 'Speler';
    setPlayerName(finalName);
    const shuffledNames = [...RANDOM_NAMES].sort(() => Math.random() - 0.5);
    const newPlayers = [
      { id: 0, name: finalName, type: 'human' },
      { id: 1, name: shuffledNames[0], type: 'cpu' },
      { id: 2, name: shuffledNames[1], type: 'cpu' },
      { id: 3, name: shuffledNames[2], type: 'cpu' },
    ];
    setPlayers(newPlayers);
    startNewGame(newPlayers);
  };

  const startNewGame = (currentPlayers = players) => {
    const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5);
    const newHands = { 0: [], 1: [], 2: [], 3: [] };
    shuffled.forEach((card, index) => {
      const playerId = index % 4;
      newHands[playerId].push(card);
    });
    setHands(newHands);
    setCompletedSets({ 0: [], 1: [], 2: [], 3: [] });
    setTurn(0);
    setLogs([`Welkom ${currentPlayers[0].name}! Jij mag beginnen.`]);
    setGameState('playing');
    setLastAction(null);
    checkAllQuartets(newHands, currentPlayers);
  };

  useEffect(() => {
    if (gameState === 'playing' && turn !== 0) {
      const timer = setTimeout(() => {
        playAiTurn();
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [turn, gameState, hands, players]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const checkQuartetsForPlayer = (playerId, currentHand, currentPlayerList) => {
    const setsCount = {};
    currentHand.forEach(card => {
      setsCount[card.setKey] = (setsCount[card.setKey] || 0) + 1;
    });
    const newCompleted = [];
    let remainingCards = [...currentHand];
    Object.entries(setsCount).forEach(([setKey, count]) => {
      if (count === 4) {
        newCompleted.push(setKey);
        remainingCards = remainingCards.filter(c => c.setKey !== setKey);
        addLog(`${currentPlayerList[playerId].name} heeft kwartet: ${CARD_SETS[setKey].label}!`);
      }
    });
    return { newCompleted, remainingCards };
  };

  const checkAllQuartets = (currentHands, currentPlayerList = players) => {
    const nextHands = { ...currentHands };
    const nextCompleted = { ...completedSets };
    let changed = false;
    currentPlayerList.forEach(p => {
      const { newCompleted, remainingCards } = checkQuartetsForPlayer(p.id, nextHands[p.id], currentPlayerList);
      if (newCompleted.length > 0) {
        nextHands[p.id] = remainingCards;
        nextCompleted[p.id] = [...(nextCompleted[p.id] || []), ...newCompleted];
        changed = true;
      }
    });
    if (changed) {
      setHands(nextHands);
      setCompletedSets(nextCompleted);
    }
    const totalSets = Object.values(nextCompleted).reduce((acc, curr) => acc + curr.length, 0);
    if (totalSets === 8) {
      setGameState('game_over');
    }
  };

  const executeTurn = (fromPlayerId, toPlayerId, cardTitle, setKey) => {
    const targetHand = hands[toPlayerId];
    const hasCard = targetHand.find(c => c.title === cardTitle && c.setKey === setKey);
    if (hasCard) {
      addLog(`${players[fromPlayerId].name} krijgt '${cardTitle}' van ${players[toPlayerId].name}.`);
      setLastAction({ type: 'success', msg: `${players[fromPlayerId].name} wint kaart!` });
      const newHands = { ...hands };
      newHands[toPlayerId] = newHands[toPlayerId].filter(c => c !== hasCard);
      newHands[fromPlayerId] = [...newHands[fromPlayerId], hasCard];
      setHands(newHands);
      checkAllQuartets(newHands);
    } else {
      addLog(`${players[toPlayerId].name} heeft '${cardTitle}' niet.`);
      setLastAction({ type: 'fail', msg: `Helaas, mis!` });
      setTurn(toPlayerId);
    }
  };

  const handleCardClick = (setKey, itemTitle, isOwned) => {
    if (gameState !== 'playing' || turn !== 0) return;
    if (isOwned) return; 
    setSelectedCardRequest({ setKey, itemTitle });
    setGameState('selecting_player');
  };

  const handlePlayerSelect = (targetPlayerId) => {
    if (!selectedCardRequest) return;
    executeTurn(0, targetPlayerId, selectedCardRequest.itemTitle, selectedCardRequest.setKey);
    setSelectedCardRequest(null);
    setGameState('playing');
  };

  const playAiTurn = () => {
    const myHand = hands[turn];
    if (myHand.length === 0) {
      let nextTurn = (turn + 1) % 4;
      setTurn(nextTurn);
      return;
    }
    const mySets = [...new Set(myHand.map(c => c.setKey))];
    const targetSetKey = mySets[Math.floor(Math.random() * mySets.length)];
    const ownedTitles = myHand.filter(c => c.setKey === targetSetKey).map(c => c.title);
    const allItems = CARD_SETS[targetSetKey].items;
    const missingItems = allItems.filter(i => !ownedTitles.includes(i.title));
    if (missingItems.length === 0) return; 
    const targetItem = missingItems[Math.floor(Math.random() * missingItems.length)];
    const validOpponents = players.filter(p => p.id !== turn && hands[p.id].length > 0);
    if (validOpponents.length === 0) {
        setGameState('game_over');
        return;
    }
    const targetPlayer = validOpponents[Math.floor(Math.random() * validOpponents.length)];
    addLog(`${players[turn].name} vraagt ${players[targetPlayer.id].name} om '${targetItem.title}'...`);
    executeTurn(turn, targetPlayer.id, targetItem.title, targetSetKey);
  };

  const getGroupedUserHand = () => {
    const userHand = hands[0];
    const grouped = {};
    userHand.forEach(card => {
      if (!grouped[card.setKey]) grouped[card.setKey] = [];
      grouped[card.setKey].push(card.title);
    });
    return Object.entries(grouped).map(([setKey, ownedTitles]) => {
      const setData = CARD_SETS[setKey];
      return {
        setKey,
        setLabel: setData.label,
        Icon: setData.icon,
        imageUrl: setData.imageUrl,
        cards: setData.items.map(itemObj => ({
          title: itemObj.title,
          description: itemObj.description,
          isOwned: ownedTitles.includes(itemObj.title)
        }))
      };
    });
  };

  // --- TOOLTIP LOGIC ---
  const handleSetHover = (e, setKey, ownerName) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredSet({
        setKey,
        x: rect.left + rect.width / 2,
        y: rect.top,
        ownerName
    });
  };

  const handleSetLeave = () => {
    setHoveredSet(null);
  };

  // --- COMPONENT: CARD (The visual look) ---
  const renderCard = (cardObj, setKey, isOwned, Icon, imageUrl, turn, onClick) => {
    return (
    <button
        key={cardObj.title}
        disabled={isOwned || turn !== 0}
        onClick={onClick}
        className={`
            relative w-40 h-64 rounded-xl flex flex-col text-left transition-all overflow-hidden group shadow-sm
            ${isOwned 
                ? 'bg-white border-2 border-orange-200' 
                : 'bg-slate-50 border-2 border-dashed border-slate-300 hover:border-orange-400 hover:bg-white cursor-pointer hover:-translate-y-1'
            }
        `}
    >
        {/* Card Header */}
        <div className={`p-3 h-12 flex items-center justify-between border-b ${isOwned ? 'bg-orange-50 border-orange-100' : 'bg-slate-100 border-slate-200'}`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider truncate mr-1 ${isOwned ? 'text-orange-600' : 'text-slate-500'}`}>
                {CARD_SETS[setKey].label}
            </span>
             {/* Mini Icon/Img in header (Smart Fallback) */}
             <SmartImage 
                src={imageUrl} 
                Icon={Icon} 
                iconSize={16}
                className="w-4 h-4 object-contain"
                iconClassName={isOwned ? 'text-orange-500' : 'text-slate-400'}
             />
        </div>
        
        {/* Card Body */}
        <div className="flex-1 p-3 flex flex-col relative overflow-hidden">
            <h4 className={`font-bold text-sm mb-2 leading-tight ${isOwned ? 'text-slate-800' : 'text-slate-500'}`}>
                {cardObj.title}
            </h4>

            {isOwned ? (
                <div className="flex-1 flex flex-col">
                    {/* Achtergrond image (Smart Fallback) - Alleen subtiel als plaatje er is */}
                    {imageUrl && (
                        <div className="absolute bottom-0 right-0 w-full h-24 opacity-10 pointer-events-none">
                             <SmartImage src={imageUrl} Icon={Icon} className="w-full h-full object-contain" />
                        </div>
                    )}
                    
                    <p className="text-xs text-slate-600 leading-relaxed z-10 overflow-y-auto custom-scrollbar">
                        {cardObj.description}
                    </p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                    {/* GROTE AFBEELDING MET FALLBACK */}
                    <div className="flex items-center justify-center h-32 w-full mb-2">
                        <SmartImage 
                            src={imageUrl} 
                            Icon={Icon} 
                            className="w-full h-full object-contain opacity-20 grayscale" 
                            iconClassName="text-slate-400 opacity-20"
                            iconSize={48}
                        />
                    </div>
                    <span className="text-[10px] text-center uppercase font-bold text-slate-400 mt-2">Ontbreekt</span>
                </div>
            )}

            {/* Hover Action Overlay */}
            {!isOwned && turn === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <span className="font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 text-sm shadow-sm">
                        VRAAG KAART
                    </span>
                </div>
            )}
        </div>
    </button>
  )};

  if (gameState === 'setup') {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-100 text-slate-800 p-4 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full border-t-4 border-orange-500">
          <div className="flex justify-center mb-4">
             <div className="bg-orange-500 p-3 rounded-full text-white">
                <Shield size={32} />
             </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Datamanagement Kwartet</h1>
          <p className="text-slate-500 mb-6">Test je kennis in de Bvolve arena!</p>
          
          <div className="mb-6">
            <label htmlFor="pName" className="block text-sm font-bold text-slate-700 mb-2 text-left">Jouw Naam</label>
            <input 
              id="pName" type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Typ je naam..." className="w-full p-3 border border-slate-300 rounded focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-lg"
              onKeyPress={(e) => e.key === 'Enter' && initGame(playerName)}
            />
          </div>
          
          <button onClick={() => initGame(playerName)} className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-bold text-lg transition-colors shadow-md">
            <Play size={20} /> Start Spel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden select-none">
      
      {/* TOOLTIP */}
      {hoveredSet && (
          <div 
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 w-72 bg-white rounded shadow-xl border border-slate-200 text-slate-800"
            style={{ left: hoveredSet.x, top: hoveredSet.y }}
          >
             <div className="p-3 border-b border-orange-100 bg-orange-50 flex items-center gap-2">
                <SmartImage 
                    src={CARD_SETS[hoveredSet.setKey].imageUrl} 
                    Icon={CARD_SETS[hoveredSet.setKey].icon} 
                    className="w-6 h-6 object-contain" 
                    iconClassName="text-orange-500" 
                    iconSize={16}
                />
                <span className="font-bold text-sm text-slate-800">{CARD_SETS[hoveredSet.setKey].label}</span>
             </div>
             <div className="p-3">
                 <p className="text-xs text-slate-500 mb-3 italic leading-relaxed">
                    "{CARD_SETS[hoveredSet.setKey].themeDescription}"
                 </p>
                 <div className="space-y-1">
                     {CARD_SETS[hoveredSet.setKey].items.map((item, idx) => (
                         <div key={idx} className="text-xs flex items-center gap-2 text-slate-600">
                             <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                             {item.title}
                         </div>
                     ))}
                 </div>
                 <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-right text-slate-400">
                    Bezit door: <span className="font-bold">{hoveredSet.ownerName}</span>
                 </div>
             </div>
             <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-b border-r border-slate-200"></div>
          </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-slate-200 shadow-sm z-20">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold">B</div>
            <h1 className="text-lg font-bold text-slate-700 hidden sm:block">Datamanagement Kwartet</h1>
        </div>
        
        {/* TOP PLAYER */}
        <div className={`transition-all duration-300 ${turn === 2 ? 'scale-110 opacity-100' : 'opacity-60 scale-90'}`}>
           <OpponentAvatar 
                player={players[2]} handCount={hands[2].length} sets={completedSets[2]} isTurn={turn === 2} 
                onHoverSet={handleSetHover} onLeaveSet={handleSetLeave}
            />
        </div>
        
        <div className="flex gap-2">
             {players.length > 0 && (
                 <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded border border-slate-200">
                    <User size={16} className="text-slate-500"/>
                    <span className="font-bold text-slate-700">{players[0].name}</span>
                </div>
            )}
            <button onClick={() => setGameState('setup')} className="p-2 text-slate-400 hover:text-orange-500 transition-colors" title="Reset">
                <RotateCcw size={18} />
            </button>
        </div>
      </div>

      {/* ARENA */}
      <div className="flex-1 flex row relative overflow-hidden bg-slate-50">
        
        {/* LEFT PLAYER */}
        <div className="w-24 flex items-center justify-center border-r border-slate-100 bg-white/50">
            <div className={`transition-all duration-300 ${turn === 1 ? 'scale-110 opacity-100' : 'opacity-60 scale-90'}`}>
                <OpponentAvatar 
                    player={players[1]} handCount={hands[1].length} sets={completedSets[1]} isTurn={turn === 1} 
                    onHoverSet={handleSetHover} onLeaveSet={handleSetLeave}
                />
            </div>
        </div>

        {/* CENTER TABLE */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
            
            {/* Action Log / Status */}
            <div className="w-full max-w-lg flex flex-col items-center gap-6">
                 <div className="h-8">
                    {lastAction ? (
                        <div className={`text-lg font-bold px-4 py-1 rounded-full shadow-sm bg-white border ${lastAction.type === 'success' ? 'text-green-600 border-green-200' : 'text-slate-400 border-slate-200'}`}>
                            {lastAction.msg}
                        </div>
                    ) : (
                         <div className={`text-lg font-bold ${turn === 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                            {turn === 0 ? "Jij bent aan de beurt!" : `${players[turn].name} denkt na...`}
                        </div>
                    )}
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm w-full h-40 overflow-hidden relative">
                     <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                     <div className="h-full overflow-y-auto custom-scrollbar flex flex-col-reverse gap-2">
                     {logs.map((log, i) => (
                        <div key={i} className={`text-sm ${i === 0 ? 'font-medium text-slate-800' : 'text-slate-400'}`}>
                            {log}
                        </div>
                     ))}
                     </div>
                </div>
            </div>

            {/* MODALS */}
            {gameState === 'selecting_player' && (
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg">
                    <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-200 max-w-md w-full text-center">
                        <h3 className="text-xl font-bold mb-1 text-slate-800">Aan wie vraag je deze kaart?</h3>
                        <p className="text-orange-500 font-medium mb-6 text-lg">{selectedCardRequest?.itemTitle}</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[1, 2, 3].map(pid => (
                                 <button 
                                    key={pid}
                                    disabled={hands[pid].length === 0}
                                    onClick={() => handlePlayerSelect(pid)}
                                    className={`flex flex-col items-center p-3 rounded-lg border transition-all
                                        ${hands[pid].length === 0 
                                            ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed' 
                                            : 'border-slate-200 bg-white hover:border-orange-500 hover:shadow-md cursor-pointer'
                                        }
                                    `}
                                 >
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                         <Cpu size={20} className="text-slate-500" />
                                    </div>
                                    <span className="font-bold text-sm text-slate-700">{players[pid].name}</span>
                                    <span className="text-[10px] text-slate-400">{hands[pid].length} krt</span>
                                 </button>
                            ))}
                        </div>
                        <button onClick={() => { setGameState('playing'); setSelectedCardRequest(null); }} className="text-slate-400 hover:text-slate-600 text-sm underline">Annuleren</button>
                    </div>
                </div>
            )}
            
            {gameState === 'game_over' && (
                <div className="absolute inset-0 bg-slate-900/80 z-50 flex flex-col items-center justify-center text-white">
                    <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
                        <Trophy size={64} className="text-orange-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-6">Eindstand</h2>
                        
                        <div className="space-y-3 mb-8">
                             {players.map(p => (
                                 <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                                     <span className="font-medium flex items-center gap-2">
                                         {p.id === 0 ? <User size={16}/> : <Cpu size={16}/>}
                                         {p.name}
                                     </span>
                                     <span className="font-bold text-xl text-orange-500">{completedSets[p.id].length}</span>
                                 </div>
                             ))}
                        </div>

                        <button 
                            onClick={() => setGameState('setup')}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold"
                        >
                            Opnieuw Spelen
                        </button>
                    </div>
                </div>
            )}

        </div>

        {/* RIGHT PLAYER */}
        <div className="w-24 flex items-center justify-center border-l border-slate-100 bg-white/50">
             <div className={`transition-all duration-300 ${turn === 3 ? 'scale-110 opacity-100' : 'opacity-60 scale-90'}`}>
                <OpponentAvatar 
                    player={players[3]} handCount={hands[3].length} sets={completedSets[3]} isTurn={turn === 3} 
                    onHoverSet={handleSetHover} onLeaveSet={handleSetLeave}
                />
            </div>
        </div>

      </div>

      {/* PLAYER HAND (BOTTOM) */}
      <div className={`h-80 bg-white border-t border-slate-200 transition-colors relative z-30 flex flex-col`}>
         {/* Status Bar */}
         <div className="h-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center px-4">
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Jouw Collectie</span>
                 {turn === 0 && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
              </div>
              <div className="flex gap-2">
                    {completedSets[0].length === 0 && <span className="text-xs text-slate-300 italic">Verzamel 4 kaarten van een set</span>}
                    {completedSets[0].map(setKey => (
                         <div 
                            key={setKey} 
                            onMouseEnter={(e) => handleSetHover(e, setKey, players[0].name)}
                            onMouseLeave={handleSetLeave}
                            className={`h-6 px-2 rounded bg-orange-100 border border-orange-200 text-orange-700 text-xs flex items-center gap-1 font-bold cursor-help`} 
                         >
                            <Trophy size={10} />
                            {CARD_SETS[setKey].label}
                         </div>
                    ))}
              </div>
         </div>

         {/* Cards Scroll Area */}
         <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar p-4">
             <div className="flex gap-4 h-full items-start min-w-max">
                 {getGroupedUserHand().length === 0 && gameState === 'playing' && (
                    <div className="flex-1 text-center text-slate-400 mt-10 italic">Je hand is leeg.</div>
                 )}

                 {getGroupedUserHand().map((group) => (
                    <div key={group.setKey} className="flex flex-col gap-2">
                        {/* Group Label */}
                        <div className="flex items-center justify-center gap-1">
                            <SmartImage 
                                src={group.imageUrl} 
                                Icon={group.Icon} 
                                className="w-3 h-3 object-contain" 
                                iconSize={12}
                                iconClassName="text-slate-400"
                            />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.setLabel}</span>
                        </div>
                        
                        {/* Cards */}
                        <div className="flex gap-2">
                            {group.cards.map((cardObj) => 
                                renderCard(cardObj, group.setKey, cardObj.isOwned, group.Icon, group.imageUrl, turn, 
                                    () => handleCardClick(group.setKey, cardObj.title, cardObj.isOwned)
                                )
                            )}
                        </div>
                    </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
}

// Sub-component for displaying Opponents
const OpponentAvatar = ({ player, handCount, sets, isTurn, onHoverSet, onLeaveSet }) => {
  if (!player) return null;
  return (
  <div className="flex flex-col items-center">
    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-sm transition-all duration-300 ${isTurn ? 'bg-orange-500 text-white ring-4 ring-orange-100' : 'bg-white border border-slate-200 text-slate-400'}`}>
        <Cpu size={24} />
        <div className={`absolute -top-2 -right-2 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${isTurn ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
            {handCount}
        </div>
    </div>
    <div className={`text-xs font-bold mb-1 truncate max-w-[80px] ${isTurn ? 'text-orange-600' : 'text-slate-500'}`}>{player.name}</div>
    
    {/* Mini collected sets */}
    <div className="flex flex-wrap justify-center gap-1 w-16 min-h-[20px]">
        {sets.map(setKey => (
            <div 
                key={setKey} 
                onMouseEnter={(e) => onHoverSet(e, setKey, player.name)}
                onMouseLeave={onLeaveSet}
                className="w-3 h-3 rounded-full bg-orange-400 border border-white shadow-sm cursor-help hover:scale-125 transition-transform"
            ></div>
        ))}
    </div>
  </div>
)};