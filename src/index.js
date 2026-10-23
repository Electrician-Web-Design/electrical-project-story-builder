import {array,text,escape,issue,list,issuesHTML,https} from './util.js';
export const guide='Supply sector, brief, scope, site_constraints, coordination, handover, publication_permission (boolean), anonymised (boolean), identity_approved, client, location, evidence [{text,source,approved}] and photos [{url,alt,approved}]. Unapproved claims and identity fields are excluded from output.';
export function analyse(input){
 const issues=[];if(input.publication_permission!==true)return {title:'Project story awaiting permission',summary:'No publication output until project permission is confirmed.',sections:[],photos:[],issues:[issue('permission','Confirm permission before creating a public story')],markdown:''};
 for(const key of ['sector','brief','scope','site_constraints','coordination','handover'])text(input[key],key);
 if(typeof input.anonymised!=='boolean')throw Error('Choose anonymised mode explicitly');
 const approved=array(input.evidence||[],'evidence').filter(e=>{text(e.text,'evidence text');if(e.approved===true&&typeof e.source==='string'&&e.source.trim())return true;issues.push(issue('evidence','An unsupported or unapproved result claim was excluded'));return false;}).map(e=>({text:e.text,source:e.source}));
 const photos=array(input.photos||[],'photos').filter(p=>p.approved===true).map(p=>{if(!https(p.url))throw Error('Photo requires safe HTTPS URL');text(p.alt,'photo alt');return {url:p.url,alt:p.alt};});
 const sections=[{heading:'The brief',text:input.brief},{heading:'Work completed',text:input.scope},{heading:'Site constraints',text:input.site_constraints},{heading:'Coordination',text:input.coordination},{heading:'Handover',text:input.handover}];
 const identity=!input.anonymised&&input.identity_approved===true?{client:input.client||'',location:input.location||''}:null;
 const title=input.sector+' project story';
 return {title,summary:'Publication draft composed only from supplied project facts. No electrical design or safety assessment.',identity,sections,approved,photos,issues,markdown:'# '+title+'\n\n'+(identity?[identity.client,identity.location].filter(Boolean).join(', ')+'\n\n':'')+sections.map(s=>'## '+s.heading+'\n\n'+s.text).join('\n\n')+(approved.length?'\n\n## Approved evidence\n\n'+approved.map(e=>'- '+e.text+' (Source: '+e.source+')').join('\n'):'')};
}
export const render=r=>'<h2>'+escape(r.title)+'</h2><p>'+escape(r.summary)+'</p>'+(r.identity?'<p>'+escape([r.identity.client,r.identity.location].filter(Boolean).join(', '))+'</p>':'')+r.sections.map(s=>'<section><h3>'+escape(s.heading)+'</h3><p>'+escape(s.text)+'</p></section>').join('')+(r.approved?.length?'<h3>Approved evidence</h3>'+list(r.approved.map(e=>e.text+' (Source: '+e.source+')')):'')+issuesHTML(r.issues);
