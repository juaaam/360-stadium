import { test, expect, type Page } from '@playwright/test';

const state = (page:Page) => page.evaluate(()=>JSON.parse(localStorage.getItem('360-stadium-demo-v1')||'null'));
async function visit(page:Page,path='/'){await page.goto(`/#${path}`);}
async function book(page:Page,parking=false){
 await visit(page,'/event/volley-social');await page.getByRole('button',{name:'Count me in'}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:'P07',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 if(parking)await page.getByRole('button',{name:/Reserve parking/}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:'Confirm demo booking'}).click();
 await expect(page.getByRole('heading',{name:'You’re in. Let’s play!'})).toBeVisible();
}

test('connected investor journey: discover, book, assess, learn, persist',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await visit(page);await expect(page.getByRole('heading',{name:'Hey Noura, ready to play?'})).toBeVisible();
 await page.getByRole('button',{name:'Find your next game'}).click();
 await page.getByRole('button',{name:'Women only',exact:true}).click();
 await page.getByLabel('Filter sport').selectOption('Volleyball');
 const cards=page.locator('.event-card');await expect(cards).toHaveCount(3);
 await expect(cards.filter({hasText:'Under the lights'})).toHaveCount(0);
 await page.getByRole('button',{name:'View The Friday volleyball club',exact:true}).click();
 await page.getByRole('button',{name:'Count me in'}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:'P07',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:/Reserve parking/}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:'Confirm demo booking'}).click();
 await expect(page.getByRole('heading',{name:'You’re in. Let’s play!'})).toBeVisible();
 await expect(page.locator('.ticket-details')).toContainText('Zone A');
 let data=await state(page);expect(data.points).toBe(1340);expect(data.bookings).toHaveLength(2);
 await page.getByRole('button',{name:'Meet your AI Coach'}).click();
 await page.getByRole('button',{name:'Use sample clip'}).click();
 await expect.poll(()=>page.locator('video').evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThanOrEqual(2);
 await page.getByRole('button',{name:'Run demo assessment'}).click();
 await expect(page.getByRole('heading',{name:'Small insights. Meaningful next steps.'})).toBeVisible();
 await expect(page.locator('.metric-card')).toContainText('Ball toss');
 await page.getByRole('button',{name:'00:08'}).click();
 await expect(page.locator('.observation-detail')).toContainText('toss drifts');
 await page.getByRole('button',{name:'Explore recommended course'}).click();
 await page.getByRole('button',{name:'Enroll in demo course'}).click();
 await page.getByRole('button',{name:'Continue learning',exact:true}).click();
 await page.getByRole('button',{name:'Play lesson',exact:true}).click();
 await page.getByRole('button',{name:'Mark lesson complete',exact:true}).click();
 await expect(page.getByRole('button',{name:'Lesson completed',exact:true})).toBeVisible();
 await visit(page,'/profile');await expect(page.locator('.profile-layout')).toContainText('The Friday volleyball club');
 await expect(page.locator('.profile-layout')).toContainText('1 of 4 lessons completed');
 await page.reload();data=await state(page);expect(data.points).toBe(1460);expect(data.enrolled.serve).toEqual([0]);expect(data.analyses.at(-1).score).toBe(82);expect(errors).toEqual([]);
});

test('cancellation releases inventory and reverses exactly the earned points',async({page})=>{
 await book(page,true);const reference=(await state(page)).bookings[0].id;
 await visit(page,'/book/volley-social');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.getByRole('button',{name:'P07 unavailable',exact:true})).toBeDisabled();
 await visit(page,`/ticket/${reference}`);await page.getByRole('button',{name:'Cancel demo booking',exact:true}).click();
 await page.getByRole('button',{name:'Confirm cancellation',exact:true}).click();
 expect((await state(page)).points).toBe(1250);
 await visit(page,'/book/volley-social');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.getByRole('button',{name:'P07',exact:true})).toBeEnabled();
});

test('match creation, approval, team assignment, editing, and cancellation',async({page})=>{
 await visit(page,'/create');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Add a match title');
 await page.getByLabel('Match title',{exact:true}).fill('Sunset community volleyball');
 await page.getByLabel('A little about your event').fill('A friendly women-only game. All levels welcome.');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:'Publish demo match',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Sunset community volleyball'})).toBeVisible();
 const sara=page.locator('.request-row').filter({hasText:'Sara Al-Ahmad'});
 await sara.getByRole('button',{name:'Approve',exact:true}).click();
 await page.getByLabel('Team for Sara Al-Ahmad').selectOption('Team Turquoise');
 await page.locator('.request-row').filter({hasText:'Laila Omar'}).getByRole('button',{name:'Reject',exact:true}).click();
 let data=await state(page);expect(data.created[0].places).toBe(11);expect(data.requests.find((r:any)=>r.name==='Sara Al-Ahmad').team).toBe('Team Turquoise');
 await page.getByRole('button',{name:'Edit event',exact:true}).click();await page.getByLabel('Event title',{exact:true}).fill('Sunset community rally');await page.getByRole('button',{name:'Save changes',exact:true}).click();
 const eventId=(await state(page)).created[0].id;
 await visit(page,'/explore');await page.getByLabel('Search events').fill('Sunset community rally');await expect(page.locator('.event-card')).toHaveCount(1);
 await visit(page,`/manage/${eventId}`);await page.getByRole('button',{name:'Cancel event',exact:true}).click();await page.getByRole('button',{name:'Confirm event cancellation'}).click();
 await visit(page,'/explore');await page.getByLabel('Search events').fill('Sunset community rally');await expect(page.locator('.event-card')).toHaveCount(0);
});

test('reward credits change the next booking total and are consumed once',async({page})=>{
 await visit(page,'/rewards');await page.locator('.reward-card').filter({hasText:'15 SAR toward your next game'}).getByRole('button',{name:'Redeem reward'}).click();
 await page.getByRole('button',{name:'Confirm redemption'}).click();expect((await state(page)).points).toBe(750);
 await book(page,true);const data=await state(page);expect(data.bookings[0].total).toBe(75);expect(data.points).toBe(825);expect(data.redeemed).toContain('booking15:used');
});

test('sport scenarios differ and uploaded video remains local',async({page})=>{
 const uploadRequests:string[]=[];page.on('request',r=>{if(r.method()==='POST')uploadRequests.push(r.url())});
 await visit(page,'/coach');await page.getByRole('button',{name:'Football',exact:true}).click();
 await expect(page.getByRole('img',{name:'Illustrated female digital athlete with Football equipment'})).toBeVisible();
 await page.locator('input[type=file]').setInputFiles('public/samples/football.webm');
 await expect(page.locator('video')).toHaveAttribute('src',/^blob:/);
 await expect.poll(()=>page.locator('video').evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThanOrEqual(2);
 await page.getByRole('button',{name:'Run demo assessment'}).click();await expect(page.locator('.metric-card')).toContainText('Plant foot');
 expect((await state(page)).analyses.at(-1).score).toBe(78);expect(uploadRequests).toEqual([]);
 await page.getByRole('button',{name:'Basketball',exact:true}).click();await expect(page.locator('.assessment-results')).toHaveCount(0);await expect(page.getByLabel('What would you like to work on?')).toContainText('Shooting form');
});

test('custom banners preserve their full image and can be reset',async({page})=>{
 await visit(page,'/banners');await page.getByLabel('Headline').fill('Community night');await page.getByLabel('Description',{exact:true}).fill('A place for every player.');
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=','base64');
 await page.locator('input[type=file]').setInputFiles({name:'banner.png',mimeType:'image/png',buffer:png});
 await page.getByLabel('Sponsored promotion').check();await page.getByRole('button',{name:'Add banner'}).click();
 await page.getByRole('button',{name:'View homepage'}).click();await expect(page.locator('.hero-banner')).toContainText('Community night');await expect(page.locator('.hero-banner')).toContainText('SPONSORED');
 await expect(page.locator('.custom-banner-image')).toHaveCSS('object-fit','contain');
 await page.getByRole('button',{name:'Discover more'}).click();await expect(page.getByRole('heading',{name:'There’s a game for everyone.'})).toBeVisible();
 await visit(page,'/profile');await page.getByRole('button',{name:'Preferences',exact:true}).click();await page.getByRole('button',{name:'Reset Demo',exact:true}).click();await page.getByRole('button',{name:'Reset demo now',exact:true}).click();
 expect((await state(page)).banners).toEqual([]);await expect(page.getByRole('heading',{name:'Hey Noura, ready to play?'})).toBeVisible();
});

test('profile personalization, notifications, saved events, and course credit persist',async({page})=>{
 await visit(page,'/profile');await page.getByRole('button',{name:'Edit profile',exact:true}).click();await page.getByLabel('Name',{exact:true}).fill('Amal');await page.getByRole('combobox',{name:'Event preference',exact:true}).selectOption('Women only');await page.getByRole('button',{name:'Save preferences'}).click();
 await visit(page);await expect(page.getByRole('heading',{name:'Hey Amal, ready to play?'})).toBeVisible();await expect(page.locator('.home-events')).not.toContainText('Under the lights');
 await visit(page,'/explore');await page.getByRole('button',{name:'Save Padel, play & a little coffee',exact:true}).click();await visit(page,'/saved');await expect(page.locator('.event-grid')).toContainText('Padel, play & a little coffee');
 await visit(page,'/notifications');await page.getByRole('button',{name:'Mark all as read'}).click();expect((await state(page)).notifications.every((n:any)=>n.read)).toBeTruthy();
 await visit(page,'/rewards');await page.locator('.reward-card').filter({hasText:'25 SAR toward a little growth'}).getByRole('button',{name:'Redeem reward'}).click();await page.getByRole('button',{name:'Confirm redemption'}).click();
 await visit(page,'/course/serve');await expect(page.locator('.large-price')).toContainText('95');await page.getByRole('button',{name:'Enroll in demo course'}).click();expect((await state(page)).points).toBe(595);expect((await state(page)).redeemed).toContain('course25:used');
 await page.reload();await expect(page.getByRole('button',{name:'Continue learning',exact:true})).toBeVisible();
});

test('official ticketing, venue reservations, school consent and empty filters',async({page})=>{
 await visit(page,'/explore?category=official');await expect(page.locator('.event-card')).toHaveCount(1);await expect(page.locator('.info-banner')).toContainText('authorized ticketing partner');
 await visit(page,'/book/official-derby');await expect(page.getByRole('button',{name:/Spectator/})).toBeVisible();
 await visit(page,'/explore?type=Venue');await expect(page.locator('.event-card')).toHaveCount(2);await page.getByRole('button',{name:'View Your court. Your crew.',exact:true}).click();await page.getByRole('button',{name:'Book this venue'}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'C01',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Confirm demo booking'}).click();expect((await state(page)).bookings[0].type).toBe('Court');
 await visit(page,'/book/basketball-school');await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeDisabled();await page.getByRole('checkbox').check();await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeEnabled();
 await visit(page,'/explore');await page.getByLabel('Search events').fill('No such event');await expect(page.locator('.event-card')).toHaveCount(0);await page.getByRole('button',{name:'Clear filters'}).click();await expect(page.locator('.event-card').first()).toBeVisible();
});

test('all primary screens render without errors or horizontal page overflow',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));const broken:string[]=[];page.on('response',r=>{if(r.status()>=400)broken.push(`${r.status()} ${r.url()}`)});
 for(const path of ['/','/explore','/event/volley-social','/book/volley-social','/ticket/ST-260810','/create','/academy','/course/serve','/learn/mindset/0','/coach','/history','/membership','/profile','/bookings','/saved','/rewards','/notifications','/onboarding','/banners']){
  await visit(page,path);await expect(page.locator('h1').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${path}`).toBeTruthy();
 }
 expect(errors).toEqual([]);expect(broken).toEqual([]);
});
