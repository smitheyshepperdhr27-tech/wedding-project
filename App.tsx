import React, { useState, useEffect, useRef, useCallback } from 'react';
import { STORY_DATA, WEDDING_DETAILS, CREDITS, BG_MUSIC_URL } from './constants';
import { MusicPlayer } from './components/MusicPlayer';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const autoScroll = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (hasStarted && !isPaused && !showRSVP) {
      const move = (deltaTime * 0.035); 
      window.scrollBy(0, move);
    }
    requestRef.current = requestAnimationFrame(autoScroll);
  }, [hasStarted, isPaused, showRSVP]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(autoScroll);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [autoScroll]);

  const handleStart = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // 微信环境下可能需要二次触摸
        console.log('Autoplay blocked, waiting for next touch');
      });
    }
  };

  const handleInteractionStart = () => setIsPaused(true);
  const handleInteractionEnd = () => setIsPaused(false);

  return (
    <div 
      className="relative min-h-screen bg-black select-none overflow-x-hidden"
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
    >
      <audio ref={audioRef} src={BG_MUSIC_URL} loop playsInline />
      
      {hasStarted && <MusicPlayer audioRef={audioRef} />}

      {/* --- 片头加载 Overlay --- */}
      {!hasStarted && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black">
          <div className="text-center p-6">
            <div className="mb-12 space-y-2 opacity-40 animate-pulse">
              <p className="text-[10px] tracking-[0.8em] uppercase">Premiering Soon</p>
              <div className="w-40 h-[1px] bg-white/20 mx-auto"></div>
            </div>
            <h2 className="text-white/30 font-serif italic text-sm mb-16 tracking-widest">
              谨以此片，献给所有相信爱的人
            </h2>
            <button 
              onClick={handleStart}
              className="group relative px-16 py-5 overflow-hidden border border-white/10"
            >
              <span className="relative z-10 text-white tracking-[1em] text-xs font-light">
                开启放映
              </span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      )}

      {/* --- 章节 0: 标题 --- */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-10">
        <div className={hasStarted ? "animate-entrance" : "opacity-0"}>
          <p className="text-[10px] tracking-[0.8em] uppercase gold-text mb-8">A Love Story Production</p>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-6 tracking-wider leading-relaxed">
            {WEDDING_DETAILS.groom} <span className="text-xl mx-4 opacity-30">&</span> {WEDDING_DETAILS.bride}
          </h1>
          <div className="w-12 h-[1px] bg-white/10 mx-auto mt-16 mb-8"></div>
          <p className="text-sm font-light opacity-40 tracking-[0.4em]">故事开始于那年盛夏</p>
        </div>
      </section>

      {/* --- 故事章节 --- */}
      {STORY_DATA.map((chapter) => (
        <section key={chapter.id} className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={chapter.image} 
              alt={chapter.title}
              className="w-full h-full object-cover ken-burns opacity-60 grayscale-[30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
          </div>
          
          <div className="relative h-full flex flex-col justify-end p-12 pb-32">
            <p className="text-[9px] tracking-[0.5em] gold-text mb-4 opacity-70 italic">{chapter.title}</p>
            <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight tracking-wide">{chapter.subtitle}</h2>
            {chapter.quote && (
              <p className="text-xs md:text-sm font-light opacity-50 italic max-w-xs border-l border-white/20 pl-4 leading-relaxed">
                {chapter.quote}
              </p>
            )}
          </div>
        </section>
      ))}

      {/* --- 详情章节 (Billing Block Style) --- */}
      <section className="min-h-screen flex items-center justify-center bg-black py-20 px-8">
        <div className="w-full max-w-md text-center">
          <div className="space-y-16">
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.5em] uppercase opacity-30">Save The Date</p>
              <h3 className="text-5xl font-serif tracking-tighter">{WEDDING_DETAILS.date}</h3>
              <p className="text-lg font-light tracking-[0.3em] opacity-60 italic">{WEDDING_DETAILS.time}</p>
            </div>

            <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto"></div>

            <div className="space-y-6">
              <p className="text-xl font-serif tracking-widest">{WEDDING_DETAILS.location}</p>
              <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] max-w-[200px] mx-auto leading-loose">
                {WEDDING_DETAILS.address}
              </p>
              <button 
                className="inline-block mt-4 text-[9px] tracking-[0.3em] uppercase py-3 px-8 border border-white/10 hover:bg-white/5 transition-colors"
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(WEDDING_DETAILS.address)}`)}
              >
                查看地图位置
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 片尾滚动 (Credits) --- */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-black py-32 space-y-16">
        <div className="text-center space-y-12 w-full max-w-xs">
          {CREDITS.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-[10px] tracking-[0.5em] uppercase opacity-30">{item.role}</p>
              <p className="text-lg font-serif italic tracking-widest">{item.names}</p>
            </div>
          ))}
        </div>

        <div className="pt-20">
          <button 
            onClick={() => setShowRSVP(true)}
            className="group relative px-12 py-4 border border-white/20 overflow-hidden"
          >
            <span className="relative z-10 text-xs tracking-[0.6em] gold-text">确认出席 RSVP</span>
            <div className="absolute inset-0 bg-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>
        </div>
      </section>

      {/* --- 最终定格 --- */}
      <section className="h-screen flex flex-col items-center justify-center bg-black text-center px-10">
        <h2 className="text-3xl font-serif italic opacity-30 mb-8 tracking-widest">Fin.</h2>
        <p className="text-[10px] tracking-[0.8em] opacity-20 uppercase">敬请光临 · 共证良缘</p>
        <div className="mt-40">
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="text-[9px] tracking-[0.4em] opacity-20 hover:opacity-50 transition-opacity uppercase border-b border-white/5 pb-2"
           >
             重放 OUR STORY
           </button>
        </div>
      </section>

      {/* RSVP Modal */}
      {showRSVP && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowRSVP(false)}></div>
          <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-8 text-center animate-entrance">
            <h3 className="text-xl font-serif mb-8 tracking-widest italic">出席确认</h3>
            <input 
              type="text" 
              placeholder="您的姓名"
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm mb-6 focus:outline-none focus:border-white/30 transition-colors"
              value={rsvpName}
              onChange={(e) => setRsvpName(e.target.value)}
            />
            <button 
              className="w-full py-4 bg-white text-black text-[10px] tracking-[0.4em] uppercase font-bold"
              onClick={() => {
                alert(`感谢 ${rsvpName}，期待您的光临！`);
                setShowRSVP(false);
              }}
            >
              提交回执
            </button>
          </div>
        </div>
      )}

      {/* 指引 */}
      <div className="fixed bottom-16 left-0 w-full text-center z-[150] pointer-events-none transition-opacity duration-1000" style={{ opacity: isPaused ? 1 : 0.2 }}>
        <p className="text-[8px] tracking-[1em] uppercase font-light">长按屏幕 慢速放映</p>
      </div>
    </div>
  );
};

export default App;
