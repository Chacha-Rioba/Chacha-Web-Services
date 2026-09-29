import { z } from 'zod';
import { types, features, styles, packages, services } from './catalog.js';
const text = (min, max) => z.string().trim().min(min).max(max);
export const businessSchema = z.object({ name: text(2,120), industry: text(2,100), description: text(20,2000), city: text(2,100), country: text(2,100), contactName: text(2,100), email: z.string().trim().email().max(254).transform(v=>v.toLowerCase()), phone: z.string().max(30).default(''), website: z.union([z.literal(''), z.string().url().refine(v=>/^https?:\/\//.test(v),'Use an HTTP or HTTPS address')]).default('') });
export const briefSchema = z.object({
  business: businessSchema,
  service: z.enum(services.map(s=>s[0])).optional(),
  websiteType: z.enum(types),
  package: z.enum(packages.map(p=>p.name)),
  pages: z.array(text(1,60)).min(1).max(20), features: z.array(z.enum(features)).max(11),
  style: z.enum([...styles,'Guide me']), palette: text(1,100),
  branding: z.enum(['Existing identity','New logo','Full brand identity','Refresh identity']),
  content: z.enum(['Ready','Provide later','Create content for me']), notes: z.string().max(3000).default(''),
  domain: z.enum(['Existing domain','CWS domain assistance','Need advice']), domainName: z.string().max(253).default(''),
  hosting: z.enum(['Existing hosting','CWS managed hosting','Need advice']),
  emailService: z.enum(['Existing email','New professional email','Not required']), mailboxes: z.number().int().min(1).max(100).default(1),
  uploadIds: z.array(z.string().uuid()).max(10).default([]), privacy: z.literal(true),
}).superRefine((v,ctx)=>{if(v.domain==='Existing domain'&&!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(v.domainName))ctx.addIssue({code:'custom',path:['domainName'],message:'Enter a valid domain such as yourbusiness.com'});});
export const contactSchema = z.object({name:text(2,100),email:z.string().email().max(254),subject:text(5,150),message:text(20,3000),privacy:z.literal(true)});
export function estimate(brief) { const custom=['E-commerce','Booking website','Custom'].includes(brief.websiteType)||brief.features?.some(v=>['M-Pesa','Card payments','Customer accounts','Multilingual','Booking'].includes(v)); return {type:'quote',label:'Personalized quote',eligible:!custom,reason:custom?'Your features need a scoped delivery timeline.':'Standard delivery eligibility will be confirmed after review.',oneTime:null,recurring:null}; }
