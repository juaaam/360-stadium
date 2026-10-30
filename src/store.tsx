import { createContext, useContext, useState, type ReactNode } from 'react';
import { demoDate, type Listing, type Banner, type Sport } from './data';
export type Booking = {id:string;eventId:string;title:string;date:string;time:string;venue:string;type:string;seats:string[];parking:boolean;total:number;points:number;status:'Confirmed'|'Canceled'};
export type Notice = {id:string;title:string;body:string;target:string;read:boolean;category:string};
export type Analysis = {id:string;sport:Sport;score:number;date:string;skill:string};
export type Request = {id:string;eventId:string;name:string;status:'Pending'|'Approved'|'Rejected';team:string};
export type DemoState = {
 profile:{name:string;city:string;sports:Sport[];audience:string;interests:string[];private:boolean;notifications:boolean;onboarded:boolean};saved:string[];bookings:Booking[];created:Listing[];requests:Request[];enrolled:Record<string,number[]>;savedCourses:string[];analyses:Analysis[];points:number;activity:{id:string;label:string;points:number}[];notifications:Notice[];banners:Banner[];autoRotate:boolean;premium:boolean;redeemed:string[];
};
export const initialState = (): DemoState => ({
 profile:{name:'Noura',city:'Riyadh',sports:['Volleyball','Football'],audience:'All events',interests:['Playing sports','Learning & improving'],private:true,notifications:true,onboarded:true},saved:['volley-social'],savedCourses:['serve'],
 bookings:[{id:'ST-260810',eventId:'volley-camp',title:'Rise & rally: volleyball camp',date:demoDate(6),time:'08:00',venue:'Palm Courts',type:'Player',seats:['P11'],parking:false,total:180,points:180,status:'Confirmed'}],created:[],requests:[],enrolled:{mindset:[0]},
 analyses:[{id:'a1',sport:'Volleyball',score:68,date:new Date(Date.now()-28*86400000).toISOString(),skill:'Serve technique'},{id:'a2',sport:'Volleyball',score:74,date:new Date(Date.now()-14*86400000).toISOString(),skill:'Serve technique'},{id:'a3',sport:'Volleyball',score:78,date:new Date(Date.now()-7*86400000).toISOString(),skill:'Serve technique'}],
 points:1250,activity:[{id:'p1',label:'Welcome to the club · Demo balance',points:1000},{id:'p2',label:'Volleyball camp booking',points:180},{id:'p3',label:'Learning & participation · Demo activity',points:70}],
 notifications:[{id:'n1',title:'Your next rally is waiting',body:'The Friday volleyball club has 6 player places. Bring your game; we’ll bring the community.',target:'/event/volley-social',read:false,category:'For you'},{id:'n2',title:'A little practice goes a long way',body:'Continue your volleyball serving journey with Coach Sara.',target:'/course/serve',read:false,category:'AI Coach'},{id:'n3',title:'You’re on the list!',body:'Your place at Rise & rally camp is confirmed.',target:'/ticket/ST-260810',read:true,category:'Bookings'},{id:'n4',title:'You’re a Game Changer',body:'You have 1,250 demo points. Explore your next reward.',target:'/rewards',read:true,category:'Rewards'}],
 banners:[],autoRotate:false,premium:false,redeemed:[],
});
const KEY='360-stadium-demo-v1';
function read():DemoState {try {const raw=localStorage.getItem(KEY);if(raw){const s=JSON.parse(raw);if(s.profile&&Array.isArray(s.bookings)&&Array.isArray(s.analyses)) return {...initialState(),...s};}}catch{}return initialState();}
type Ctx={state:DemoState;update:(fn:(s:DemoState)=>DemoState)=>void;toast:(text:string)=>void;message:string;reset:()=>void};
const Context=createContext<Ctx>(null!);
export function DemoProvider({children}:{children:ReactNode}) {const [state,setState]=useState(read);const [message,setMessage]=useState('');
 const toast=(text:string)=>{setMessage(text);window.setTimeout(()=>setMessage(m=>m===text?'':m),3800)};
 const update=(fn:(s:DemoState)=>DemoState)=>setState(s=>{const next=fn(s);try{localStorage.setItem(KEY,JSON.stringify(next));}catch{toast('Browser storage is full. Your changes are saved for this visit only.')}return next});
 const reset=()=>{const next=initialState();setState(next);try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}toast('Demo reset. Ready for a fresh start.')};
 return <Context.Provider value={{state,update,toast,message,reset}}>{children}</Context.Provider>;
}
export const useDemo=()=>useContext(Context);
export const uid=(prefix:string)=>`${prefix}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
export function addNotice(s:DemoState,title:string,body:string,target:string,category:string):Notice[]{return [{id:uid('N'),title,body,target,category,read:false},...s.notifications];}
