import {clean,lines,selected,requireText,number,pence,pounds,section,report,enumValue,webAddress} from './customer-ui.js';
export const config = {
  "title": "Commercial Electrical Case Study Builder",
  "short": "Turn completed work into a clear project story",
  "audience": "For commercial electrical contractors",
  "summary": "Write a useful project example from the work you actually delivered, ready to check before it goes on your website.",
  "button": "Build my project story",
  "filename": "electrical-project-case-study",
  "eyebrow": "Show the work. Explain the thinking.",
  "time": "About 5 minutes",
  "outcome": "A structured project story and a short publication checklist.",
  "layout": "project",
  "intro": "Describe the brief, the work and the handover. Client names are left out unless you confirm you have permission to use them.",
  "note": "Use approved project facts only. This does not provide installation advice or verify technical safety, qualifications or compliance.",
  "fields": [
    {
      "id": "sector",
      "label": "Project type or sector",
      "help": "For example: warehouse lighting refurbishment.",
      "required": true,
      "type": "text",
      "maxLength": 180
    },
    {
      "id": "location",
      "label": "General area",
      "help": "Optional. Avoid a private or sensitive address.",
      "required": false,
      "type": "text",
      "maxLength": 180
    },
    {
      "id": "permission",
      "label": "Can you publicly identify the client?",
      "options": [
        [
          "no",
          "No, keep it anonymous"
        ],
        [
          "yes",
          "Yes, I have permission"
        ]
      ],
      "help": "",
      "required": true,
      "type": "select"
    },
    {
      "id": "client",
      "label": "Approved client name",
      "help": "Only included if you choose Yes above.",
      "required": false,
      "type": "text",
      "maxLength": 180
    },
    {
      "id": "brief",
      "label": "What did the client need?",
      "help": "Describe the actual brief.",
      "required": true,
      "type": "textarea",
      "maxLength": 2500,
      "wide": true
    },
    {
      "id": "work",
      "label": "What work did your team carry out?",
      "help": "Keep it factual. Do not include confidential site details.",
      "required": true,
      "type": "textarea",
      "maxLength": 2500,
      "wide": true
    },
    {
      "id": "constraints",
      "label": "What did you have to plan around?",
      "help": "For example: occupied premises or agreed shutdown times.",
      "required": false,
      "type": "textarea",
      "maxLength": 2500,
      "wide": true
    },
    {
      "id": "handover",
      "label": "What was handed over?",
      "help": "Describe the actual records, information or completed scope.",
      "required": true,
      "type": "textarea",
      "maxLength": 2500,
      "wide": true
    },
    {
      "id": "outcome",
      "label": "What outcome can you support with evidence?",
      "help": "Optional. Leave out savings, performance or results that were not measured.",
      "required": false,
      "type": "textarea",
      "maxLength": 2500,
      "wide": true
    }
  ],
  "example": {
    "sector": "Warehouse lighting refurbishment",
    "location": "Greater Manchester",
    "permission": "no",
    "client": "Example Client",
    "brief": "Replace agreed lighting in an occupied warehouse.",
    "work": "The team replaced the specified fittings in agreed work zones.",
    "constraints": "Work was scheduled around the client’s operating hours.",
    "handover": "The completed scope and project records were reviewed with the site contact.",
    "outcome": "The agreed work zones were handed back to the client."
  }
};
export function evaluate(v){enumValue(v.permission,['yes','no'],'whether you have permission to name the client');if(v.permission==='yes'&&!clean(v.client))throw Error('Enter the approved client name, or choose to keep it anonymous.');const sector=requireText(v.sector,'the project type');const story=[{title:'The brief',text:requireText(v.brief,'the client brief')},{title:'The work',text:requireText(v.work,'the work carried out')}];if(clean(v.constraints))story.push({title:'Planning around the site',text:clean(v.constraints)});story.push({title:'Handover',text:requireText(v.handover,'the handover details')});if(clean(v.outcome))story.push({title:'Reported outcome',text:clean(v.outcome)});return report(sector,[v.permission==='yes'?clean(v.client):'Client identity withheld',clean(v.location)].filter(Boolean).join(' | '),[section('Before publication',['Confirm client permission for names, photographs and project details.','Ask the responsible contractor to check the technical descriptions.','Add only outcomes you can substantiate. No results or savings have been generated.'])],{story});}
