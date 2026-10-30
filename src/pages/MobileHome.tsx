import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Bookmark, CalendarDays, Compass, GraduationCap, MapPin, Plus, Search, ShieldCheck, Sparkles, Ticket, Trophy, Users, Volleyball } from 'lucide-react';
import { courses, dateLabel, listings, sports } from '../data';
import { useDemo } from '../store';
import { Avatar, Badge, Button, Empty, EventCard, go, PageTitle, Progress, SectionTitle } from '../components/ui';
import { BannerCarousel } from './Discover';
import { CourseCard } from './Academy';

const shortcuts = [
 {icon:MapPin,label:'Book a venue',to:'/explore?type=Venue',color:'gold'},
 {icon:Users,label:'Join a match',to:'/explore',color:'green'},
 {icon:GraduationCap,label:'Explore courses',to:'/academy',color:'blue'},
 {icon:Plus,label:'Create a match',to:'/create',color:'coral'},
 {icon:Sparkles,label:'AI Coach',to:'/coach',color:'violet'},
 {icon:Trophy,label:'Rewards',to:'/rewards',color:'lime'},
];
export function MobileHome(){
 const {state}=useDemo();const [sport,setSport]=useState('For you');const [search,setSearch]=useState('');
 const events=[...listings,...state.created].filter(e=>!e.canceled&&!e.official&&!e.private&&e.type!=='Venue'&&e.city===state.profile.city).filter(e=>sport==='For you'?(state.profile.sports.includes(e.sport)&&(state.profile.audience==='All events'||state.profile.audience===e.audience)):e.sport===sport).slice(0,4);
 const recommended=courses.filter(c=>state.profile.sports.includes(c.sport)).slice(0,3);
 const latest=state.analyses.at(-1);const booking=state.bookings.find(b=>b.status==='Confirmed');
 return <>
 <PageTitle eyebrow="LET’S MAKE TODAY A LITTLE MORE ACTIVE" title={`Hey ${state.profile.name.split(' ')[0]}, ready to play?`} description="Your community. Your next great game."/>
 <form className="mobile-home-search" onSubmit={e=>{e.preventDefault();go(`/explore?q=${encodeURIComponent(search)}`)}}><Search size={19}/><input aria-label="Search your community" placeholder="Find a game, a court, a little inspiration…" value={search} onChange={e=>setSearch(e.target.value)}/><button type="submit" aria-label="Search community"><ArrowRight size={18}/></button></form>
 <div className="app-shortcuts">{shortcuts.map(q=><button key={q.label} onClick={()=>go(q.to)}><span className={`shortcut-orb ${q.color}`}><q.icon size={25} strokeWidth={1.8}/><i/></span><strong>{q.label}</strong></button>)}</div>
 <section className="home-promotion"><SectionTitle title="A little something for you"/><BannerCarousel/></section>
 <div className="home-utilities"><button onClick={()=>go('/bookings')}><Ticket size={17}/>My tickets<ArrowUpRight size={12}/></button><button onClick={()=>go('/saved')}><Bookmark size={17}/>Saved<ArrowUpRight size={12}/></button><button onClick={()=>go('/rewards')}><Trophy size={17}/>{state.points.toLocaleString()} points<ArrowUpRight size={12}/></button></div>
 <section className="section-space"><SectionTitle title="Your next great game" subtitle="Good energy. Great people. A place for you." action="Explore all" to="/explore"/><div className="sport-tabs">{['For you',...sports].map(s=><button key={s} className={sport===s?'active':''} onClick={()=>setSport(s)}>{s==='For you'&&<Sparkles size={13}/>} {s}</button>)}</div><div className="event-grid home-events">{events.map(e=><EventCard key={e.id} event={e}/>)}</div>{!events.length&&<Empty title="Your next game is on its way" description="Try another sport or start a match of your own." action="Create a match" to="/create"/>}</section>
 <button className="women-discovery" onClick={()=>go('/explore?audience=Women%20only')}><span><ShieldCheck size={23}/></span><div><strong>Your space to play.</strong><small>Women-only games. A community that gets you.</small></div><ArrowRight size={18}/></button>
 <section className="mobile-coach-promo"><div className="mobile-coach-copy"><Badge tone="light"><Sparkles size={12}/>YOUR AI COACH · DEMO</Badge><h2>Little practice.<br/>Big possibilities.</h2><p>Your {latest?.sport.toLowerCase()||'volleyball'} journey, from a fresh angle.</p><Button variant="yellow" onClick={()=>go('/coach')}>Meet your AI Coach<ArrowRight size={16}/></Button></div><div className="mobile-coach-athlete"><Avatar sport={latest?.sport||'Volleyball'}/><div className="mini-score"><strong>{latest?.score||78}</strong><span>Latest demo score</span></div></div></section>
 <section className="section-space"><SectionTitle title="A little learning. A bigger game." subtitle="A new skill is a new kind of confidence." action="Academy" to="/academy"/><div className="mobile-course-rail">{recommended.map(c=><CourseCard key={c.id} course={c}/>)}</div></section>
 <section className="daily-moments"><SectionTitle title="Your little wins, adding up"/><div className="moment-grid">{booking&&<button className="moment-card next" onClick={()=>go(`/ticket/${booking.id}`)}><span className="moment-icon"><CalendarDays size={21}/></span><small>YOUR NEXT GAME</small><h3>{booking.title}</h3><p>{dateLabel(booking.date)} · {booking.time}</p><span className="moment-link">View your ticket<ArrowRight size={15}/></span></button>}<button className="moment-card points" onClick={()=>go('/rewards')}><span className="moment-icon"><Trophy size={21}/></span><small>EVERY MOVE COUNTS</small><h3 className="moment-points">{state.points.toLocaleString()}<span>points</span></h3><Progress value={state.points/20}/><p>{Math.max(0,2000-state.points)} to your next level</p><span className="moment-link">Explore rewards<ArrowRight size={15}/></span></button></div></section>
 <section className="official-strip"><Trophy size={27}/><div><span className="eyebrow">THE BIG STAGE</span><h3>A seat at the games you love.</h3><p>Fictional official matches & demo tickets.</p></div><button className="text-link" onClick={()=>go('/explore?category=official')}>Explore<ArrowRight size={15}/></button></section>
 </>;
}
