import {test,expect} from '@playwright/test';
const endpoint='https://formsubmit.co/ajax/project@cws.com';
async function fill(page){await page.getByLabel('Your name',{exact:true}).fill('Example Client');await page.getByLabel('Email address (optional)',{exact:true}).fill('client@example.test');await page.locator('textarea[name="message"]').fill('We need a clear website and an AI assistant for customer questions.');await page.getByRole('checkbox').check()}
test('public pages have no account navigation, arrows or backend requests on desktop and mobile',async({page})=>{
 const errors=[],api=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(new URL(r.url()).pathname.startsWith('/api/'))api.push(r.url())});
 for(const width of [1440,390]){await page.setViewportSize({width,height:900});for(const route of ['/','/about','/build','/book-a-meeting','/request-a-callback','/packages','/services/ai-agents-and-automation']){await page.goto(route);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('a[href*="signup"],a[href*="login"],a[href*="portal"],a[href*="admin"],a[href*="preview"]')).toHaveCount(0);await expect(page.locator('.lucide-arrow-up-right,.lucide-arrow-right,.lucide-chevron-right,.lucide-chevron-left')).toHaveCount(0);expect(await page.locator('body').innerText()).not.toMatch(/[↗→←↑]/);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}}expect(api).toEqual([]);expect(errors).toEqual([]);
});
test('old account routes are retired and old automation route redirects',async({page})=>{
 for(const route of ['/login','/signup','/admin','/portal','/preview/admin','/verify#token=obsolete']){await page.goto(route);await expect(page).toHaveURL(/\/contact$/);await expect(page.getByRole('form',{name:'General inquiry'})).toBeVisible()}
 await page.goto('/services/workflow-automation');await expect(page).toHaveURL(/ai-agents-and-automation$/);await expect(page.locator('h1')).toHaveText('AI Agents & Automation');await expect(page.getByRole('heading',{name:'What we deliver'})).toBeVisible();await page.locator('.service-brief-card').click();await expect(page.getByLabel('Service',{exact:true})).toHaveValue('AI Agents & Automation');
});
test('all request types prepare WhatsApp messages and preserve details without claiming delivery',async({page})=>{
 await page.addInitScript(()=>{window.open=(url)=>{window.preparedMessage=url;return null}});
 const outbound=[];page.on('request',r=>{if(r.url().includes('formsubmit.co'))outbound.push(r.url())});
 for(const [route,kind] of [['/build?package=Business%20Growth','Project inquiry'],['/contact','General inquiry'],['/book-a-meeting','Meeting request'],['/request-a-callback','Callback request']]){
 await page.goto(route);await fill(page);
 if(kind==='Callback request')await page.getByLabel('Callback number (with country code)',{exact:true}).fill('+254712345678');
 if(['Meeting request','Callback request'].includes(kind)){await page.getByLabel('Preferred date',{exact:true}).fill('2099-01-01');await page.getByLabel('Preferred time',{exact:true}).fill('14:30');await page.getByLabel('Time zone',{exact:true}).fill('Africa/Nairobi')}
 await page.getByRole('button',{name:'Continue to WhatsApp',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('not yet sent');await expect(page.getByRole('status')).toContainText('Send in WhatsApp');
 const url=new URL(await page.evaluate(()=>window.preparedMessage));expect(url.hostname).toBe('wa.me');expect(url.pathname).toBe('/254710885507');expect(url.searchParams.get('text')).toContain(kind);expect(url.searchParams.get('text')).toContain('Example Client');
 if(kind==='Callback request')expect(url.searchParams.get('text')).toContain('+254712345678');
 await expect(page.getByRole('link',{name:'Open WhatsApp CWS',exact:true})).toHaveAttribute('href',url.href);await expect(page.getByLabel('Your name',{exact:true})).toHaveValue('Example Client');
 await page.getByLabel('Your name',{exact:true}).fill('Updated Client');await expect(page.getByRole('status')).toHaveCount(0);
 }expect(outbound).toEqual([]);
});
test('callback validates country code and does not require an email',async({page})=>{
 await page.addInitScript(()=>{window.open=(url)=>{window.preparedMessage=url;return null}});await page.goto('/request-a-callback');await fill(page);await page.getByLabel('Email address (optional)',{exact:true}).fill('');await page.getByLabel('Callback number (with country code)',{exact:true}).fill('0712345678');await page.getByLabel('Preferred date',{exact:true}).fill('2099-01-01');await page.getByLabel('Preferred time',{exact:true}).fill('14:30');await page.getByRole('button',{name:'Continue to WhatsApp'}).click();await expect(page.getByRole('alert')).toContainText('country code');expect(await page.evaluate(()=>window.preparedMessage)).toBeUndefined();await page.getByLabel('Callback number (with country code)',{exact:true}).fill('+254712345678');await page.getByRole('button',{name:'Continue to WhatsApp'}).click();await expect(page.getByRole('status')).toBeVisible();
});
test('compact photographic hero and callback CTA work on desktop and mobile',async({page})=>{
 for(const width of [1440,390]){await page.setViewportSize({width,height:900});await page.goto('/');const hero=page.locator('.photo-hero');await expect(hero.locator('img')).toBeVisible();expect(await hero.locator('img').evaluate(x=>x.complete&&x.naturalWidth>0)).toBe(true);await expect(hero.locator('h1')).toContainText('less than 5 hours');await expect(page.locator('.launch-studio,.launch-globe')).toHaveCount(0);if(width===1440)expect((await hero.boundingBox()).height).toBeLessThanOrEqual(290);await expect(page.locator('.cloud-account').getByRole('link',{name:'Request a callback'})).toBeVisible();await hero.getByRole('link',{name:'Request a callback'}).click();await expect(page).toHaveURL(/request-a-callback$/)}
});
test('about principles, photography, meeting navigation and clickable pricing work',async({page})=>{
 await page.goto('/about');await expect(page.locator('.principle-grid article')).toHaveCount(6);await expect(page.locator('.principle-grid')).toContainText('Responsible technology');for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(x=>x.complete&&x.naturalWidth>0)).toBe(true)}await page.locator('.about-invitation').getByRole('link',{name:'Book a meeting',exact:true}).click();await expect(page).toHaveURL(/book-a-meeting$/);await page.goto('/packages');await page.locator('.package-card').first().click({position:{x:30,y:30}});await expect(page).toHaveURL(/build\?package=Launch/);
 await page.goto('/');await page.getByRole('button',{name:'Next solution',exact:true}).click();await expect(page.locator('.journey-slide')).toContainText('Bring your store');await page.getByRole('button',{name:'Search CWS',exact:true}).click();await page.getByRole('textbox',{name:'Search services',exact:true}).fill('AI Agents');await page.locator('.search-results a').click();await expect(page).toHaveURL(/ai-agents-and-automation$/);
});

test('portfolio link, distinct homepage photos and browser icons are available',async({page,context})=>{
 await page.goto('/');const card=page.getByRole('link',{name:'View Orbitways website (opens in a new tab)'});await expect(card).toHaveAttribute('href','https://orbitways.netlify.app/');await expect(card).toHaveAttribute('target','_blank');await expect(card.locator('img')).toHaveAttribute('src','/images/orbitways-project.png');
 await context.route('https://orbitways.netlify.app/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<h1>Orbitways destination</h1>'}));const popupPromise=page.waitForEvent('popup');await card.click();const popup=await popupPromise;await popup.waitForLoadState();expect(popup.url()).toBe('https://orbitways.netlify.app/');await popup.close();
 const images=await page.locator('main img').evaluateAll(xs=>xs.map(x=>x.getAttribute('src')));expect(new Set(images).size).toBe(images.length);
 for(const selector of ['link[rel="icon"][type="image/svg+xml"]','link[rel="icon"][type="image/png"]','link[rel="apple-touch-icon"]','link[rel="manifest"]']){const url=await page.locator(selector).getAttribute('href');const response=await page.request.get(url);expect(response.ok()).toBe(true);expect(response.headers()['content-type']).not.toContain('text/html')}
 await page.goto('/about');await page.locator('nav').getByRole('link',{name:'Projects',exact:true}).click();await expect(page).toHaveURL(/#completed-projects$/);await expect(page.locator('#completed-projects')).toBeInViewport();
});
