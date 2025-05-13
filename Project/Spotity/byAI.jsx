// import React, { useEffect, useMemo, useState, useRef } from "react";

// // Spotify-style single-file React app
// // - Tailwind CSS utility classes are used for styling (no external icon libs required)
// // - Mock data for songs, playlists, and recommendations
// // - Features: library, search, playlists (create/save), queue, player (play/pause/seek), mini-player, responsive layout
// // - Persistence via localStorage

// export default function SpotifyCloneApp() {
//   // ---- Mock data ----
//   const initialTracks = [
//     {
//       id: "t1",
//       title: "Neon Nights",
//       artist: "Nova Skies",
//       album: "Afterglow",
//       duration: 210, // seconds
//       artwork: "https://picsum.photos/seed/neon/400/400",
//       url: "", // placeholder, using HTMLAudio empty src is allowed for demo
//       genre: "Synthwave",
//     },
//     {
//       id: "t2",
//       title: "Lazy Sunday",
//       artist: "Maple & Pine",
//       album: "Weekend",
//       duration: 185,
//       artwork: "https://picsum.photos/seed/sunday/400/400",
//       url: "",
//       genre: "Indie",
//     },
//     {
//       id: "t3",
//       title: "City Lights",
//       artist: "Aria Blake",
//       album: "Midnight Drive",
//       duration: 242,
//       artwork: "https://picsum.photos/seed/city/400/400",
//       url: "",
//       genre: "Pop",
//     },
//     {
//       id: "t4",
//       title: "Ocean Breath",
//       artist: "Salt & Stem",
//       album: "Blue Horizons",
//       duration: 298,
//       artwork: "https://picsum.photos/seed/ocean/400/400",
//       url: "",
//       genre: "Ambient",
//     },
//     {
//       id: "t5",
//       title: "Runaway",
//       artist: "Stereo Heart",
//       album: "Run",
//       duration: 200,
//       artwork: "https://picsum.photos/seed/run/400/400",
//       url: "",
//       genre: "Electronic",
//     },
//   ];

//   // ---- State ----
//   const [tracks, setTracks] = useState(() => {
//     const saved = localStorage.getItem("tracks_v1");
//     return saved ? JSON.parse(saved) : initialTracks;
//   });

//   const [query, setQuery] = useState("");
//   const [activeView, setActiveView] = useState("home"); // 'home'|'library'|'playlist'|'search'|'now'
//   const [playback, setPlayback] = useState({
//     current: null, // track id
//     playing: false,
//     position: 0,
//   });

//   const [queue, setQueue] = useState(() => {
//     const q = localStorage.getItem("queue_v1");
//     return q ? JSON.parse(q) : [];
//   });

//   const [playlists, setPlaylists] = useState(() => {
//     const p = localStorage.getItem("playlists_v1");
//     return p
//       ? JSON.parse(p)
//       : [
//           { id: "pl1", name: "Favorites", trackIds: ["t2", "t3"] },
//           { id: "pl2", name: "Chill", trackIds: ["t4"] },
//         ];
//   });

//   // audio ref (used for real playback if urls are provided)
//   const audioRef = useRef(null);
//   const progressRef = useRef(null);

//   // ---- Effects: persist state ----
//   useEffect(() => {
//     localStorage.setItem("tracks_v1", JSON.stringify(tracks));
//   }, [tracks]);

//   useEffect(() => {
//     localStorage.setItem("queue_v1", JSON.stringify(queue));
//   }, [queue]);

//   useEffect(() => {
//     localStorage.setItem("playlists_v1", JSON.stringify(playlists));
//   }, [playlists]);

//   // ---- Derived data ----
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return tracks;
//     return tracks.filter(
//       (t) =>
//         t.title.toLowerCase().includes(q) ||
//         t.artist.toLowerCase().includes(q) ||
//         t.album.toLowerCase().includes(q) ||
//         t.genre?.toLowerCase().includes(q)
//     );
//   }, [tracks, query]);

//   const currentTrack = useMemo(() => tracks.find((t) => t.id === playback.current), [tracks, playback.current]);

//   // ---- Playback controls ----
//   function playTrack(trackId, { queueNext = false } = {}) {
//     if (!trackId) return;
//     if (queueNext) {
//       setQueue((q) => [trackId, ...q]);
//       return;
//     }
//     setPlayback((p) => ({ ...p, current: trackId, playing: true, position: 0 }));
//   }

//   function togglePlay() {
//     setPlayback((p) => ({ ...p, playing: !p.playing }));
//   }

//   function stopPlayback() {
//     setPlayback({ current: null, playing: false, position: 0 });
//   }

//   function nextTrack() {
//     if (queue.length > 0) {
//       const [next, ...rest] = queue;
//       setQueue(rest);
//       playTrack(next);
//       return;
//     }
//     // otherwise play next in tracks array
//     const idx = tracks.findIndex((t) => t.id === playback.current);
//     if (idx >= 0 && idx < tracks.length - 1) playTrack(tracks[idx + 1].id);
//   }

//   function prevTrack() {
//     const idx = tracks.findIndex((t) => t.id === playback.current);
//     if (idx > 0) playTrack(tracks[idx - 1].id);
//   }

//   // sync audio element with playback state
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     if (currentTrack?.url) audio.src = currentTrack.url;
//     if (playback.playing) audio.play().catch(() => {});
//     else audio.pause();
//   }, [playback.playing, currentTrack]);

//   // update position every second when playing
//   useEffect(() => {
//     if (!playback.playing) return;
//     const id = setInterval(() => {
//       setPlayback((p) => ({ ...p, position: Math.min((p.position || 0) + 1, currentTrack?.duration || 0) }));
//     }, 1000);
//     return () => clearInterval(id);
//   }, [playback.playing, currentTrack]);

//   // when track ends, go to next
//   useEffect(() => {
//     if (!currentTrack) return;
//     if (playback.position >= currentTrack.duration && playback.duration !== 0) {
//       nextTrack();
//     }
//   }, [playback.position, currentTrack]);

//   // ---- Playlist management ----
//   function createPlaylist(name) {
//     const id = `pl_${Date.now()}`;
//     setPlaylists((p) => [{ id, name, trackIds: [] }, ...p]);
//     return id;
//   }

//   function addToPlaylist(playlistId, trackId) {
//     setPlaylists((p) => p.map((pl) => (pl.id === playlistId ? { ...pl, trackIds: Array.from(new Set([...(pl.trackIds || []), trackId])) } : pl)));
//   }

//   function removeFromPlaylist(playlistId, trackId) {
//     setPlaylists((p) => p.map((pl) => (pl.id === playlistId ? { ...pl, trackIds: (pl.trackIds || []).filter((id) => id !== trackId) } : pl)));
//   }

//   // ---- Utilities ----
//   function formatTime(s) {
//     if (!s && s !== 0) return "0:00";
//     const mm = Math.floor(s / 60);
//     const ss = Math.floor(s % 60).toString().padStart(2, "0");
//     return `${mm}:${ss}`;
//   }

//   // ---- UI components ----
//   const Icon = ({ name, className = "w-5 h-5" }) => {
//     // minimal inline icons
//     switch (name) {
//       case "search":
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <circle cx="11" cy="11" r="6" />
//             <path d="M21 21l-4.35-4.35" />
//           </svg>
//         );
//       case "play":
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//             <path d="M5 3v18l15-9z" />
//           </svg>
//         );
//       case "pause":
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//             <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
//           </svg>
//         );
//       case "next":
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//             <path d="M6 6v12l8.5-6zM16 6h2v12h-2z" />
//           </svg>
//         );
//       case "prev":
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//             <path d="M18 6v12L9.5 12zM8 6H6v12h2z" />
//           </svg>
//         );
//       case "queue":
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <path d="M3 6h18" />
//             <path d="M3 12h12" />
//             <path d="M3 18h6" />
//           </svg>
//         );
//       case "heart":
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//             <path d="M12 21s-7-4.35-9-7.07C0 10.76 2.24 6 6 6c2.14 0 3.37 1.16 4 2.09C11.63 7.16 12.86 6 15 6c3.76 0 6 4.76 3 7.93C19 16.65 12 21 12 21z" />
//           </svg>
//         );
//       default:
//         return <span className={className} />;
//     }
//   };

//   function LibraryList({ items, onPlay, onQueue, onAddToPlaylist }) {
//     return (
//       <div className="space-y-2">
//         {items.map((t) => (
//           <div key={t.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-800/40">
//             <img src={t.artwork} alt="art" className="w-12 h-12 rounded" />
//             <div className="flex-1 min-w-0">
//               <div className="text-sm font-medium truncate">{t.title}</div>
//               <div className="text-xs text-gray-300 truncate">{t.artist} • {t.album}</div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button className="p-2 rounded hover:bg-white/5" onClick={() => onPlay(t.id)} title="Play">
//                 <Icon name="play" />
//               </button>
//               <button className="p-2 rounded hover:bg-white/5" onClick={() => onQueue(t.id)} title="Add to queue">
//                 <Icon name="queue" />
//               </button>
//               <div className="relative">
//                 <select className="bg-transparent text-xs p-1 rounded border border-gray-700" onChange={(e)=>{ if(e.target.value) { onAddToPlaylist(e.target.value, t.id); e.target.selectedIndex = 0; } }}>
//                   <option value="">Add to playlist</option>
//                   {playlists.map((pl)=> (
//                     <option key={pl.id} value={pl.id}>{pl.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // ---- Main render ----
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex">
//       {/* Left sidebar */}
//       <aside className="w-64 p-4 border-r border-gray-800 hidden md:block">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold">Muse</h1>
//           <div className="text-xs text-gray-400">A lightweight Spotify-like prototype</div>
//         </div>
//         <nav className="space-y-2">
//           <button onClick={()=>setActiveView('home')} className={`w-full text-left p-2 rounded ${activeView==='home' ? 'bg-white/10':''}`}>Home</button>
//           <button onClick={()=>setActiveView('library')} className={`w-full text-left p-2 rounded ${activeView==='library' ? 'bg-white/10':''}`}>Your Library</button>
//           <button onClick={()=>setActiveView('playlists')} className={`w-full text-left p-2 rounded ${activeView==='playlists' ? 'bg-white/10':''}`}>Playlists</button>
//           <button onClick={()=>setActiveView('now')} className={`w-full text-left p-2 rounded ${activeView==='now' ? 'bg-white/10':''}`}>Now Playing</button>
//         </nav>
//         <div className="mt-6">
//           <div className="text-xs text-gray-400">Playlists</div>
//           <div className="mt-2 space-y-1">
//             {playlists.map((pl) => (
//               <div key={pl.id} className="flex items-center justify-between text-sm p-1">
//                 <button className="truncate text-left" onClick={()=>{ setActiveView('playlist'); setQuery(pl.id); }}>{pl.name}</button>
//                 <div className="text-xs text-gray-400">{(pl.trackIds || []).length}</div>
//               </div>
//             ))}
//             <div className="pt-2">
//               <NewPlaylist onCreate={(n)=>{ createPlaylist(n); }} />
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-6 overflow-auto">
//         <header className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search for songs, artists, albums..." className="bg-gray-800/60 rounded-full px-4 py-2 pr-10 w-96 focus:outline-none" />
//               <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                 <Icon name="search" />
//               </div>
//             </div>
//             <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
//               <div className="p-2 rounded hover:bg-white/5">Account</div>
//               <div className="p-2 rounded hover:bg-white/5">Settings</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <button className="p-2 rounded hover:bg-white/5">Upgrade</button>
//             <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">U</div>
//           </div>
//         </header>

//         {/* Content area */}
//         <section>
//           {activeView === 'home' && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Recommended for you</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {tracks.slice(0,6).map((t) => (
//                   <div key={t.id} className="p-3 bg-white/3 rounded flex gap-3 items-center">
//                     <img src={t.artwork} className="w-20 h-20 rounded" />
//                     <div className="flex-1">
//                       <div className="font-medium">{t.title}</div>
//                       <div className="text-sm text-gray-300">{t.artist}</div>
//                       <div className="mt-2 flex gap-2">
//                         <button className="px-3 py-1 bg-white/5 rounded" onClick={()=>playTrack(t.id)}>Play</button>
//                         <button className="px-3 py-1 border border-gray-700 rounded" onClick={()=>setQueue((q)=>[...q,t.id])}>Add to queue</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-8">
//                 <h3 className="text-lg font-semibold mb-3">Recently added</h3>
//                 <LibraryList items={tracks} onPlay={(id)=>playTrack(id)} onQueue={(id)=>setQueue((q)=>[...q,id])} onAddToPlaylist={(pl, t)=>addToPlaylist(pl, t)} />
//               </div>
//             </div>
//           )}

//           {activeView === 'library' && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Your Library</h2>
//               <LibraryList items={filtered} onPlay={(id)=>playTrack(id)} onQueue={(id)=>setQueue((q)=>[...q,id])} onAddToPlaylist={(pl, t)=>addToPlaylist(pl, t)} />
//             </div>
//           )}

//           {activeView === 'playlists' && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Playlists</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {playlists.map((pl) => (
//                   <div key={pl.id} className="p-4 bg-white/3 rounded">
//                     <div className="flex items-center gap-3">
//                       <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded flex items-center justify-center">{pl.name[0]}</div>
//                       <div className="flex-1">
//                         <div className="font-medium">{pl.name}</div>
//                         <div className="text-xs text-gray-300">{pl.trackIds?.length || 0} songs</div>
//                       </div>
//                       <div>
//                         <button onClick={()=>{ setActiveView('playlist'); setQuery(pl.id); }} className="px-3 py-1 rounded bg-white/5">Open</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeView === 'playlist' && (
//             <div>
//               {/* We repurposed query to hold playlist id when opening a playlist */}
//               {(() => {
//                 const pl = playlists.find((p) => p.id === query);
//                 if (!pl) return <div className="text-sm text-gray-400">Select a playlist from the sidebar</div>;
//                 return (
//                   <div>
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-blue-500 rounded flex items-center justify-center">{pl.name[0]}</div>
//                       <div>
//                         <div className="text-2xl font-bold">{pl.name}</div>
//                         <div className="text-sm text-gray-300">{pl.trackIds?.length || 0} songs</div>
//                         <div className="mt-3 flex gap-2">
//                           <button className="px-3 py-1 bg-white/5 rounded" onClick={()=>{ if(pl.trackIds?.[0]) playTrack(pl.trackIds[0]) }}>Play</button>
//                           <button className="px-3 py-1 border border-gray-700 rounded" onClick={()=>setQueue((q)=>[...q,...(pl.trackIds||[])])}>Add to queue</button>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <LibraryList items={(pl.trackIds||[]).map((id)=>tracks.find(t=>t.id===id)).filter(Boolean)} onPlay={(id)=>playTrack(id)} onQueue={(id)=>setQueue((q)=>[...q,id])} onAddToPlaylist={(plId,t)=>addToPlaylist(plId,t)} />
//                     </div>
//                   </div>
//                 );
//               })()}
//             </div>
//           )}

//           {activeView === 'now' && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
//               {!currentTrack && <div className="text-gray-400">No track playing. Click Play on any song.</div>}
//               {currentTrack && (
//                 <div className="md:flex gap-6">
//                   <img src={currentTrack.artwork} className="w-48 h-48 rounded mb-4 md:mb-0" />
//                   <div className="flex-1">
//                     <div className="text-2xl font-bold">{currentTrack.title}</div>
//                     <div className="text-sm text-gray-300 mb-4">{currentTrack.artist} • {currentTrack.album}</div>

//                     <div className="flex items-center gap-4 mb-2">
//                       <button onClick={prevTrack} className="p-2 rounded hover:bg-white/5"><Icon name="prev" /></button>
//                       <button onClick={togglePlay} className="p-3 rounded bg-white/5">{playback.playing ? <Icon name="pause" /> : <Icon name="play" />}</button>
//                       <button onClick={nextTrack} className="p-2 rounded hover:bg-white/5"><Icon name="next" /></button>
//                       <div className="text-xs text-gray-300 ml-4">{formatTime(playback.position)} / {formatTime(currentTrack.duration)}</div>
//                     </div>

//                     <div className="w-full bg-gray-800 rounded h-2 mb-2">
//                       <div className="h-2 rounded bg-white/40" style={{ width: `${(playback.position / currentTrack.duration) * 100}%` }} />
//                     </div>

//                     <div className="mt-4">
//                       <button className="px-3 py-1 mr-2 rounded bg-white/5" onClick={()=>setQueue((q)=>[...q,currentTrack.id])}>Queue</button>
//                       <button className="px-3 py-1 rounded border border-gray-700" onClick={()=>{
//                         // toggle favorite (demo: add/remove from 'Favorites' playlist if exists)
//                         const fav = playlists.find(pl=>pl.name==='Favorites');
//                         if(!fav){
//                           const id = createPlaylist('Favorites');
//                           addToPlaylist(id, currentTrack.id);
//                         } else {
//                           if(!fav.trackIds.includes(currentTrack.id)) addToPlaylist(fav.id, currentTrack.id);
//                         }
//                       }}>Save</button>
//                     </div>

//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* If search query is used, show search results */}
//           {query && activeView !== 'playlist' && (
//             <div className="mt-8">
//               <h3 className="text-lg mb-3">Search results</h3>
//               <LibraryList items={filtered} onPlay={(id)=>playTrack(id)} onQueue={(id)=>setQueue((q)=>[...q,id])} onAddToPlaylist={(pl,t)=>addToPlaylist(pl,t)} />
//             </div>
//           )}

//         </section>
//       </main>

//       {/* Right side - queue / recommendations */}
//       <aside className="w-80 p-4 border-l border-gray-800 hidden lg:block">
//         <div className="text-sm text-gray-400 mb-3">Up next</div>
//         <div className="space-y-2">
//           {queue.length === 0 && <div className="text-xs text-gray-400">Queue is empty. Add songs to the queue.</div>}
//           {queue.map((id, idx) => {
//             const t = tracks.find(x=>x.id===id);
//             if(!t) return null;
//             return (
//               <div key={id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5">
//                 <img src={t.artwork} className="w-10 h-10 rounded" />
//                 <div className="flex-1 text-sm truncate">{t.title} <div className="text-xs text-gray-400">{t.artist}</div></div>
//                 <button className="p-2" onClick={()=>{ setQueue((q)=>q.filter((_,i)=>i!==idx)); }}>×</button>
//               </div>
//             );
//           })}

//           <div className="mt-4">
//             <h4 className="text-sm font-semibold mb-2">Suggested</h4>
//             <div className="space-y-2">
//               {tracks.slice(0,3).map((t)=> (
//                 <div key={t.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5">
//                   <img src={t.artwork} className="w-10 h-10 rounded" />
//                   <div className="flex-1 text-sm truncate">{t.title}</div>
//                   <button onClick={()=>setQueue((q)=>[...q,t.id])} className="p-2">+</button>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </aside>

//       {/* Mini player at bottom */}
//       <div className="fixed left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black to-transparent border-t border-gray-800">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             {currentTrack ? (
//               <>
//                 <img src={currentTrack.artwork} className="w-12 h-12 rounded" />
//                 <div className="min-w-0">
//                   <div className="text-sm font-medium truncate">{currentTrack.title}</div>
//                   <div className="text-xs text-gray-300 truncate">{currentTrack.artist}</div>
//                 </div>
//               </>
//             ) : (
//               <div className="text-sm text-gray-400">Nothing playing</div>
//             )}
//           </div>

//           <div className="flex items-center gap-4">
//             <button onClick={prevTrack} className="p-2"><Icon name="prev" /></button>
//             <button onClick={togglePlay} className="p-3 rounded bg-white/5">{playback.playing ? <Icon name="pause" /> : <Icon name="play" />}</button>
//             <button onClick={nextTrack} className="p-2"><Icon name="next" /></button>
//           </div>

//           <div className="w-1/3 hidden md:block">
//             <div className="text-xs text-gray-400">{formatTime(playback.position)} / {currentTrack ? formatTime(currentTrack.duration) : '0:00'}</div>
//             <div className="w-full bg-gray-800 rounded h-2 mt-1">
//               <div className="h-2 rounded bg-white/40" style={{ width: `${currentTrack ? (playback.position / currentTrack.duration) * 100 : 0}%` }} />
//             </div>
//           </div>
//         </div>
//       </div>

//       <audio ref={audioRef} onEnded={nextTrack} />
//     </div>
//   );
// }

// // ---- Helper component: NewPlaylist ----
// function NewPlaylist({ onCreate }){
//   const [name, setName] = useState("");
//   return (
//     <div className="flex gap-2">
//       <input className="bg-gray-800/50 rounded px-2 py-1 text-sm flex-1" value={name} onChange={(e)=>setName(e.target.value)} placeholder="New playlist name" />
//       <button className="px-2 py-1 bg-white/5 rounded text-sm" onClick={()=>{ if(name.trim()){ onCreate(name.trim()); setName(''); } }}>Create</button>
//     </div>
//   );
// }
