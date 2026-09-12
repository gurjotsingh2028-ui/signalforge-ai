import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const MAKE_WEBHOOK = 'https://hook.eu1.make.com/sz2r6acduhi7g5v7z68ptzgk2abinyx2'

const initialActivity = [
  { agent: 'Research Agent', tag: 'HIGH SIGNAL', text: 'AI agent observability is becoming a product layer, not just logging.', meta: '12 min ago · 3 sources' },
  { agent: 'Chief of Staff', tag: 'RECOMMENDATION', text: 'Prioritize Command Centre → approval loop before adding more specialists.', meta: '34 min ago' },
  { agent: 'Content & PR', tag: 'DRAFT READY', text: 'Draft: “I stopped learning AI. I started building systems.”', meta: '1 hr ago · awaiting approval' }
]

function App() {
  const [view, setView] = useState('dashboard')
  const [command, setCommand] = useState('')
  const [activity, setActivity] = useState(initialActivity)
  const [approvals, setApprovals] = useState(2)
  const [bridge, setBridge] = useState('Ready')

  const log = (text) => setActivity(a => [{ agent: 'Gurjot OS', tag: 'SYSTEM', text, meta: new Date().toLocaleTimeString() }, ...a])

  async function sendCommand(e) {
    e.preventDefault()
    const value = command.trim()
    if (!value) return
    setCommand('')
    log(`Command submitted: ${value}`)
    setBridge('Sending…')
    try {
      const response = await fetch(MAKE_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: value, source: 'gurjot-command-centre', timestamp: new Date().toISOString() }) })
      setBridge(response.ok ? 'Make received command' : `Make returned ${response.status}`)
      log(`Make bridge response: ${response.status}`)
    } catch {
      setBridge('Bridge needs server-side configuration')
      log('Browser could not reach the Make bridge.')
    }
  }

  const decide = (kind) => { setApprovals(n => Math.max(0, n - 1)); log(`${kind} by Gurjot.`) }

  return <div className="app">
    <aside className="side"><div className="brand">Gurjot <span>OS</span></div><nav>{[
      ['dashboard','⌂','Command'],['intelligence','◈','Intelligence'],['approvals','✓','Approvals'],['tasks','□','Tasks'],['agents','◉','Agents'],['activity','≡','Activity'],['settings','⚙','Settings']
    ].map(([id,icon,label]) => <button key={id} className={view===id?'active':''} onClick={()=>setView(id)}>{icon} &nbsp; {label}{id==='approvals' && approvals>0 && <b className="navBadge">{approvals}</b>}</button>)}</nav></aside>
    <main className="main">
      <header className="top"><div><div className="eyebrow">AI command centre</div><h1>Good afternoon, Gurjot.</h1><p>Command your AI team. Review decisions. Keep the human in the loop.</p></div><div className="status"><i/> System online</div></header>
      {view==='dashboard' && <Dashboard command={command} setCommand={setCommand} sendCommand={sendCommand} approvals={approvals} activity={activity} decide={decide} bridge={bridge}/>} 
      {view==='intelligence' && <Page title="Intelligence Inbox"><Card title="High-signal findings"><Item title="Agentic OS is becoming a control layer" text="Directly relevant to your AI-native operator positioning." tag="AI · HIGH"/><Item title="Voice reception → transcript → CoS is ready for V1" text="Next action: connect Bolna event webhook to the command centre." tag="BUILD · HIGH"/></Card></Page>}
      {view==='approvals' && <Page title="Approval Queue"><Card title="Human decisions"><p className="muted">External and public actions stay human-approved.</p><Decision title="Publish LinkedIn draft" sub="Content & PR Agent" decide={decide}/></Card></Page>}
      {view==='tasks' && <Page title="Tasks"><Card title="Execution backlog"><Item title="Wire Command Centre → CoS execution" text="Priority P0 · Owner: Chief of Staff"/><Item title="Connect Gmail + Google Tasks execution path" text="Priority P1 · Owner: Task Executor"/><Item title="Connect Bolna voice events" text="Priority P1 · Owner: Voice Agent"/></Card></Page>}
      {view==='agents' && <Page title="Agent Team"><div className="cards3"><Agent name="Chief of Staff" role="Supervisor · active"/><Agent name="Research" role="Signal sensing · ready"/><Agent name="Content & PR" role="Brand system · ready"/></div></Page>}
      {view==='activity' && <Page title="Activity Ledger"><Card title="Recent activity">{activity.map((x,i)=><Item key={i} title={x.agent} text={x.text} tag={x.tag}/>)}</Card></Page>}
      {view==='settings' && <Page title="System Settings"><Card title="Connections"><Item title="Make" text={bridge}/><Item title="Freebuff" text="Hosting/build workspace. No API keys are exposed in the browser."/><Item title="Runtime" text="Command UI is deployed separately from orchestration credentials."/></Card></Page>}
    </main>
  </div>
}

function Dashboard({command,setCommand,sendCommand,approvals,activity,decide,bridge}) { return <>
  <form className="composer" onSubmit={sendCommand}><input value={command} onChange={e=>setCommand(e.target.value)} placeholder="Tell your Chief of Staff what to do…"/><button>Send command</button></form>
  <div className="grid4"><Metric label="Open approvals" value={approvals}/><Metric label="New intelligence" value="7"/><Metric label="Active agents" value="3"/><Metric label="Tasks today" value="11"/></div>
  <div className="layout"><Card title="Executive activity">{activity.slice(0,5).map((x,i)=><Item key={i} title={x.agent} text={x.text} tag={x.tag} meta={x.meta}/>)}</Card><Card title="Needs your decision"><Decision title="Publish LinkedIn draft" sub="Content Agent · medium risk" decide={decide}/><Decision title="Create research task" sub="Research Agent · low risk" decide={decide}/></Card></div>
  <div className="bridge"><i/> Make bridge: {bridge}</div>
</> }
const Page=({title,children})=><section><div className="pageTitle">{title}</div>{children}</section>
const Card=({title,children})=><div className="card"><h2>{title}</h2>{children}</div>
const Metric=({label,value})=><div className="card metricCard"><span>{label}</span><strong>{value}</strong></div>
const Item=({title,text,tag,meta})=><div className="item"><div className="itemTop"><b>{title}</b>{tag&&<em>{tag}</em>}</div><div>{text}</div>{meta&&<small>{meta}</small>}</div>
function Decision({title,sub,decide}){return <div className="decision"><div><b>{title}</b><small>{sub}</small></div><div><button className="approve" onClick={()=>decide('Approved')}>Approve</button><button onClick={()=>decide('Rejected')}>Reject</button></div></div>}
const Agent=({name,role})=><div className="card"><div className="agent"><span>{name[0]}</span><div><b>{name}</b><small>{role}</small></div></div><div className="progress"><i/></div></div>

createRoot(document.getElementById('root')).render(<App />)
