// Generate original illustrated practice clips; no uploaded footage or external assets.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-background-timer-throttling'] });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:5173');
const result = await page.evaluate(async () => {
 const sports = ['Volleyball', 'Football', 'Padel', 'Basketball', 'Tennis', 'Jiu-jitsu'];
 return Promise.all(sports.map(sport => new Promise(resolve => {
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=360;document.body.append(canvas);const c=canvas.getContext('2d');
  const stream=canvas.captureStream(20);const rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8',videoBitsPerSecond:400000});const chunks=[];
  rec.ondataavailable=e=>chunks.push(e.data);rec.onstop=async()=>{const b=new Blob(chunks,{type:'video/webm'});const reader=new FileReader();reader.onload=()=>{stream.getTracks().forEach(t=>t.stop());canvas.remove();resolve({sport,data:String(reader.result).split(',')[1]})};reader.readAsDataURL(b)};
  const line=(x1,y1,x2,y2,color,width)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()};
  const circle=(x,y,r,color)=>{c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()};
  let frame=0;const fps=20;
  const draw=()=>{const t=frame/fps;const phase=Math.min(3,Math.floor(t/4));const swing=Math.sin((t%4)/4*Math.PI);const g=c.createLinearGradient(0,0,640,360);g.addColorStop(0,'#163e32');g.addColorStop(1,'#2d5846');c.fillStyle=g;c.fillRect(0,0,640,360);
   c.strokeStyle='#ffffff10';c.lineWidth=1;for(let x=0;x<640;x+=40){c.beginPath();c.moveTo(x,0);c.lineTo(x,360);c.stroke()}for(let y=0;y<360;y+=40){c.beginPath();c.moveTo(0,y);c.lineTo(640,y);c.stroke()}
   c.fillStyle='#a6c59b';c.font='10px sans-serif';c.fillText('360 STADIUM  /  ILLUSTRATED PRACTICE SAMPLE',25,27);c.fillStyle='#ecf3da';c.font='bold 22px sans-serif';c.fillText(sport.toUpperCase(),25,59);
   line(20,294,620,294,'#9dbc8b',2);line(80,294,80,330,'#9dbc8b',1);line(500,294,500,330,'#9dbc8b',1);
   const x=310+(sport==='Jiu-jitsu'?swing*15:0),y=sport==='Basketball'&&phase===1?136-swing*20:136;circle(x,305,36,'#112f26');c.save();c.translate(x,y);if(sport==='Jiu-jitsu')c.rotate(swing*.25);
   line(-12,77,-19,126,'#162d27',18);line(-19,126,-24,151,'#162d27',15);line(12,77,24+(sport==='Football'&&phase===1?swing*50:0),124-(sport==='Football'&&phase===1?swing*10:0),'#162d27',18);line(24+(sport==='Football'&&phase===1?swing*50:0),124-(sport==='Football'&&phase===1?swing*10:0),37+(sport==='Football'&&phase===1?swing*50:0),151-(sport==='Football'&&phase===1?swing*30:0),'#162d27',15);
   line(-32,154,-15,154,'#e7edcf',8);line(32+(sport==='Football'&&phase===1?swing*50:0),154-(sport==='Football'&&phase===1?swing*30:0),49+(sport==='Football'&&phase===1?swing*50:0),154-(sport==='Football'&&phase===1?swing*30:0),'#e7edcf',8);
   c.fillStyle=sport==='Jiu-jitsu'?'#eff1df':'#35c8b4';c.beginPath();c.moveTo(-22,8);c.lineTo(22,8);c.lineTo(27,82);c.lineTo(-27,82);c.closePath();c.fill();
   const lift=phase===1?swing:phase===2?1-swing*.2:0;const ax=40+lift*12,ay=35-lift*70;
   line(-22,18,-38,48,'#35c8b4',13);line(-38,48,-13,58,'#bf8d67',11);line(22,18,ax,ay,'#35c8b4',13);line(ax,ay,ax+15,ay-14,'#bf8d67',11);
   circle(0,-12,22,'#26382e');circle(2,-9,17,'#c79771');c.fillStyle='#27382d';c.beginPath();c.arc(0,-18,20,Math.PI,Math.PI*2);c.fill();line(-17,-20,-26,14,'#26382e',8);circle(8,-12,1.7,'#25372c');line(7,-2,12,-3,'#7e4b35',1.3);c.fillStyle='#e8f6d8';c.font='bold 12px sans-serif';c.fillText('360',-11,44);
   if(['Tennis','Padel'].includes(sport)){line(ax+15,ay-14,ax+24,ay-38,'#e3d85c',5);c.strokeStyle='#d2df88';c.lineWidth=4;c.beginPath();c.ellipse(ax+30,ay-60,14,22,.25,0,Math.PI*2);c.stroke();for(let p=-8;p<10;p+=6)line(ax+22+p,ay-75,ax+22+p,ay-45,'#8fb68b',1)}
   c.restore();
   if(sport!=='Jiu-jitsu'){let bx=x+57,by=y+21;if(sport==='Football'){bx=x+64+(phase===1?swing*135:0);by=283}else if(phase===1){bx=x+57+swing*105;by=y+21-swing*130}else if(phase===2){bx=x+145+Math.sin(t)*15;by=y-70+Math.sin(t)*25}const color=sport==='Basketball'?'#eaa44f':sport==='Football'?'#f6f4db':'#f1de56';circle(bx,by,sport==='Tennis'||sport==='Padel'?7:14,color);if(sport==='Football'){circle(bx,by,5,'#294132')}else if(sport==='Basketball'){line(bx-12,by,bx+12,by,'#8d5a28',1);line(bx,by-12,bx,by+12,'#8d5a28',1)}}
   if(sport==='Basketball'){line(540,100,540,292,'#a7bba0',3);line(515,100,565,100,'#f1de56',4);line(515,100,525,125,'#d7e2c8',1);line(565,100,555,125,'#d7e2c8',1);line(525,125,555,125,'#d7e2c8',1)}else if(sport!=='Football'&&sport!=='Jiu-jitsu'){line(520,110,520,294,'#a7bba0',3);line(520,110,640,110,'#d7e2c8',2);for(let a=120;a<=180;a+=12)line(520,a,640,a,'#a4bc9477',1)}
   c.fillStyle='#c2d5ad';c.font='12px sans-serif';c.fillText(['01  Preparation','02  Movement execution','03  Follow-through','04  Reset and repeat'][phase],25,330);c.fillStyle='#9bb790';c.font='9px sans-serif';c.fillText('SIMULATED MOTION · EDUCATIONAL DEMO',400,330);c.fillStyle='#35c8b4';c.fillRect(0,355,640*(t/16),5);
   frame++;if(frame>320){clearInterval(timer);rec.stop()}
  };draw();rec.start();const timer=setInterval(draw,50);
 })));
});
await mkdir('public/samples',{recursive:true});
for(const clip of result){const path=`public/samples/${clip.sport.toLowerCase().replaceAll(' ','-')}.webm`;const temp=`/tmp/stadium-${clip.sport.toLowerCase()}.webm`;await writeFile(temp,Buffer.from(clip.data,'base64'));execFileSync('ffmpeg',['-y','-loglevel','error','-i',temp,'-c','copy',path]);console.log('Created',path)}
await browser.close();
