import {test,expect} from '@playwright/test';
test('marketing navigation and layouts at desktop and mobile widths',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});await page.goto('/');await expect(page.getByRole('heading',{level:1})).toContainText('Your next big idea.');
  await expect(page.getByRole('img',{name:'CWS',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(width===390){await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Services',exact:true}).click();}
  else await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Services',exact:true}).click();
  await expect(page.getByRole('heading',{name:'One partner. Every step online.'})).toBeVisible();
 }
 expect(errors).toEqual([]);
});
test('eight-step brief saves a real project and verified client can find it',async({page})=>{
 const email=`browser-${Date.now()}@example.test`;await page.goto('/build');
 await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByRole('alert')).toBeVisible();
 await page.getByLabel('Business name',{exact:true}).fill('Browser Test Studio');await page.getByLabel('Industry',{exact:true}).fill('Design');await page.getByLabel('What does your business do?').fill('We create considered spaces and designs for small businesses.');await page.getByLabel('City',{exact:true}).fill('Nairobi');await page.getByLabel('Country',{exact:true}).fill('Kenya');await page.getByLabel('Your name',{exact:true}).fill('Test Client');await page.getByLabel('Email address',{exact:true}).fill(email);
 for(let i=0;i<7;i++)await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Your vision, all together.'})).toBeVisible();await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Submit my project brief'}).click();
 await expect(page.getByRole('heading',{name:'Your brief is in. Let’s make it happen.'})).toBeVisible();await expect(page.locator('.receipt-reference')).toContainText('CWS-');
 await page.getByRole('link',{name:'Go to your project portal'}).click();await page.getByLabel('Email address').fill(email);await page.getByRole('button',{name:'Email my sign-in link'}).click();await page.getByRole('link',{name:'Development only: open sign-in link'}).click();
 await expect(page.getByRole('heading',{name:'Your next chapter.',exact:true})).toBeVisible();await page.getByRole('button').filter({hasText:'Browser Test Studio'}).click();await expect(page.getByRole('heading',{name:'Your brief is being reviewed.'})).toBeVisible();
});

test('signup verifies an email and opens a client workspace',async({page})=>{
 await page.goto('/signup');await page.getByLabel('Your name',{exact:true}).fill('New CWS Client');await page.getByLabel('Email address').fill(`signup-${Date.now()}@example.test`);await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(page.getByRole('status')).toContainText('verify your account');await page.getByRole('link',{name:'Development only: open sign-in link'}).click();await expect(page.getByRole('heading',{name:'Your next chapter.',exact:true})).toBeVisible();
});

test('photographs load, service cards navigate and WhatsApp uses CWS number',async({page})=>{
 await page.goto('/');for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(x=>x.complete&&x.naturalWidth>0)).toBe(true)}
 await expect(page.locator('a[href="https://wa.me/254710885507"]').first()).toBeVisible();await page.locator('.service-card').first().click();await expect(page.getByRole('heading',{level:1})).toHaveText('Website design & development');
});

test('service categories, global search, carousel and delivery controls work',async({page})=>{
 await page.goto('/');await page.getByRole('tab',{name:'Commerce & integrations'}).click();await expect(page.getByRole('tabpanel')).toContainText('Workflow automation');await expect(page.getByRole('tabpanel')).not.toContainText('Website design & development');
 await page.getByRole('button',{name:'Search CWS'}).click();await page.getByRole('textbox',{name:'Search services',exact:true}).fill('hosting');await page.locator('.search-results').getByRole('link').click();await expect(page.getByRole('heading',{level:1})).toContainText('Cloud, domains & email');
 await page.goto('/');await page.getByRole('button',{name:'Next solution'}).click();await expect(page.locator('.journey-slide')).toContainText('Bring your store and payments together.');await page.getByRole('button',{name:'Previous solution'}).click();await expect(page.locator('.journey-slide')).toContainText('Give your customers');await page.getByRole('button',{name:'03 Develop',exact:true}).click();await expect(page.locator('.delivery-stage-card')).toContainText('business logic');
 await page.getByRole('textbox',{name:'Search industries'}).fill('education');await expect(page.locator('.industry-grid>a')).toHaveCount(1);
});

test('featured hero controls and reduced motion are supported',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:'Show featured slide 2'}).click();await expect(page.getByRole('heading',{level:1})).toContainText('Connect your customers');await page.getByRole('button',{name:'Show featured slide 1'}).click();await expect(page.getByRole('heading',{level:1})).toContainText('Your next big idea.');await expect(page.getByRole('button',{name:'Play featured slides'})).toBeVisible();
});
