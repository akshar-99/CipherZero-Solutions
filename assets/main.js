(function(){
'use strict';
var DATA={"q": [{"k": "mfa", "svc": "cybersecurity"}, {"k": "backup", "svc": "infrastructure"}, {"k": "patch", "svc": "consulting"}, {"k": "monitor", "svc": "cybersecurity"}, {"k": "train", "svc": "cybersecurity"}, {"k": "remote", "svc": "network"}, {"k": "cloud", "svc": "cloud"}, {"k": "licence", "svc": "procurement"}], "svc": {"cloud": "Cloud Solutions", "cybersecurity": "Cybersecurity", "consulting": "IT Consulting & Managed Services", "infrastructure": "IT Infrastructure", "network": "Network Services", "procurement": "Technology Procurement & Lifecycle"}, "qtext": {"mfa": "Multi-factor authentication is turned on for every user account.", "backup": "Backups run automatically, are stored off-site, and have been restore-tested recently.", "patch": "Every computer and server gets security updates automatically.", "monitor": "Someone watches your security alerts around the clock.", "train": "Staff have had phishing or security-awareness training in the past year.", "remote": "Remote staff and sites connect through a secure VPN or managed access.", "cloud": "Email and core business apps run on a supported, up-to-date platform.", "licence": "You know which software licences you pay for, and they are all in use."}};
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(pointer: fine)').matches;
var root=document.documentElement;

/* Theme toggle */
function isDark(){var t=root.dataset.theme;return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
$('#theme').addEventListener('click',function(){var t=isDark()?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('cz-theme',t)}catch(e){}});

/* Toast */
var toastT;function toast(msg){var t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show')},2200)}

/* Nav: solid on scroll, progress bar, active link, mobile menu */
var nav=$('.nav'),prog=$('.prog'),ticking=false;
function onScroll(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;nav.classList.toggle('solid',y>30);prog.style.setProperty('--p',h>0?y/h:0);updateSteps();ticking=false}
addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
var links=$$('.nav nav a'),secs=links.map(function(a){return $(a.getAttribute('href'))});
var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(function(s){s&&so.observe(s)});
var mb=$('.menu');
mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu')});
links.forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')})});

/* Reveal on scroll */
if('IntersectionObserver' in window&&!reduce){var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});$$('.rv').forEach(function(el){ro.observe(el)})}
else $$('.rv').forEach(function(el){el.classList.add('in')});

/* Hero headline "decrypt" reveal (runs on each slide as it appears) */
var G='#%&@$*+=<>/\\01ØXZ';
function decrypt(scope){$$('.cz',scope).forEach(function(el,li){var t=el.dataset.text;el.setAttribute('aria-label',t);if(reduce){el.textContent=t;return}
  var start=null,dur=900,delay=150+li*300,id=(el._dk=(el._dk||0)+1);
  function frame(ts){if(id!==el._dk)return;if(!start)start=ts;var p=Math.max(0,Math.min(1,(ts-start-delay)/dur)),n=Math.floor(p*t.length),out='';
    for(var i=0;i<t.length;i++){var ch=t[i];if(i<n||ch===' '||ch==='.'||ch===',')out+=ch;else out+='<span class="glyph">'+G[Math.floor(Math.random()*G.length)].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</span>'}
    el.innerHTML=out;if(p<1)requestAnimationFrame(frame);else el.textContent=t}
  requestAnimationFrame(frame)})}

/* Hero carousel: autoplay with progress, pause on hover/focus, keyboard + swipe */
(function(){var car=$('.carousel'),slides=$$('.slide',car),dots=$$('.car-dot',car),i=0,DUR=7000,timer=null,left=DUR,t0=0,held=false,user=reduce;
  if(reduce)car.classList.add('static');
  car.style.setProperty('--dur',DUR+'ms');
  function go(n){if(n===i)return;var prev=slides[i];i=(n+slides.length)%slides.length;
    prev.classList.remove('on');prev.setAttribute('aria-hidden','true');prev.inert=true;
    var s=slides[i];s.classList.add('on');s.removeAttribute('aria-hidden');s.inert=false;
    dots.forEach(function(d,k){d.classList.toggle('on',k===i);if(k===i)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')});
    decrypt(s);restart()}
  function restart(){clearTimeout(timer);left=DUR;run()}
  function run(){clearTimeout(timer);if(user||held)return;t0=Date.now();timer=setTimeout(function(){go(i+1)},left)}
  function hold(){if(held)return;held=true;clearTimeout(timer);left-=Date.now()-t0;car.classList.add('paused')}
  function release(){if(!held)return;held=false;if(!user){car.classList.remove('paused');run()}}
  dots.forEach(function(d,k){d.addEventListener('click',function(){go(k)})});
  $('#car-prev').addEventListener('click',function(){go(i-1)});$('#car-next').addEventListener('click',function(){go(i+1)});
  var pb=$('#car-pause');pb.addEventListener('click',function(){user=!user;car.classList.toggle('static',user);pb.setAttribute('aria-label',user?'Play slideshow':'Pause slideshow');if(!user){car.classList.remove('paused');restart()}else clearTimeout(timer)});
  car.addEventListener('mouseenter',hold);car.addEventListener('mouseleave',release);
  car.addEventListener('focusin',hold);car.addEventListener('focusout',function(e){if(!car.contains(e.relatedTarget))release()});
  car.addEventListener('keydown',function(e){if(e.key==='ArrowRight')go(i+1);if(e.key==='ArrowLeft')go(i-1)});
  var sx=null;car.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  car.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)go(dx<0?i+1:i-1);sx=null});
  document.addEventListener('visibilitychange',function(){document.hidden?hold():release()});
  decrypt(slides[0]);run();
})();

/* Hero network mesh: nodes drift, pointer lights up nearby links */
(function(){var c=$('#mesh'),x=c.getContext('2d'),hero=$('.hero'),W,H,pts=[],m={x:-9999,y:-9999},on=true,raf;
  function size(){var r=Math.min(devicePixelRatio||1,2);W=c.clientWidth;H=c.clientHeight;c.width=W*r;c.height=H*r;x.setTransform(r,0,0,r,0,0);
    var n=Math.min(120,Math.round(W*H/13000));pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3})}
  function draw(){x.clearRect(0,0,W,H);var L=125,M=170,i,j,p,q,dx,dy,d;
    for(i=0;i<pts.length;i++){p=pts[i];if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      dx=p.x-m.x;dy=p.y-m.y;d=Math.hypot(dx,dy);if(d<M&&d>0){p.x+=dx/d*.6;p.y+=dy/d*.6}}}
    for(i=0;i<pts.length;i++){p=pts[i];var pm=Math.hypot(p.x-m.x,p.y-m.y)<M+40;
      for(j=i+1;j<pts.length;j++){q=pts[j];dx=p.x-q.x;dy=p.y-q.y;d=dx*dx+dy*dy;if(d<L*L){d=Math.sqrt(d);var hot=pm&&Math.hypot(q.x-m.x,q.y-m.y)<M+40;
        x.strokeStyle=hot?'rgba(204,85,61,'+(1-d/L)*.9+')':'rgba(237,226,214,'+(1-d/L)*.16+')';x.lineWidth=hot?1.2:1;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}
      x.fillStyle=pm?'#CC553D':'rgba(237,226,214,.45)';x.beginPath();x.arc(p.x,p.y,pm?2.4:1.5,0,6.283);x.fill()}
    if(on&&!reduce)raf=requestAnimationFrame(draw)}
  size();draw();
  addEventListener('resize',function(){size();if(reduce)draw()});
  hero.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top;if(reduce)draw()});
  hero.addEventListener('pointerleave',function(){m.x=m.y=-9999;if(reduce)draw()});
  new IntersectionObserver(function(es){on=es[0].isIntersecting;cancelAnimationFrame(raf);if(on&&!reduce)raf=requestAnimationFrame(draw)}).observe(hero);
})();

/* Sample console: gauge, counters, rotating event feed */
(function(){var C=326.7;
  function count(el,to,suf){if(reduce){el.textContent=to+(suf||'');return}var s=null;function f(ts){if(!s)s=ts;var p=Math.min(1,(ts-s)/1600),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e)+(suf||'');if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
  setTimeout(function(){$('#g-val').style.strokeDashoffset=C*(1-.94);count($('#g-num'),94);$$('[data-count]').forEach(function(b){count(b,+b.dataset.count,b.dataset.suffix)})},400);
  var ev=[['Phishing email quarantined','Collaboration security',0],['Suspicious sign-in blocked','Identity & access',0],['Patches deployed to 12 devices','Endpoint security',1],['Nightly backup verified','Data protection',1],['Firewall policy updated','Network security',1],['Vulnerability scan completed','Vulnerability management',1],['New laptop enrolled in Intune','Configuration & deployment',1],['Unused licence reclaimed','Licence optimization',1],['Malware blocked on endpoint','Endpoint security',0]];
  var feed=$('#feed'),k=0;
  function ts(){var d=new Date();return[d.getHours(),d.getMinutes(),d.getSeconds()].map(function(n){return('0'+n).slice(-2)}).join(':')}
  function push(){var e=ev[k++%ev.length],li=document.createElement('li');li.innerHTML='<i class="dot'+(e[2]?' ok':'')+'"></i><span>'+e[0]+'<em>'+e[1]+'</em></span><small>'+ts()+'</small>';feed.insertBefore(li,feed.firstChild);while(feed.children.length>4)feed.removeChild(feed.lastChild)}
  for(var i=0;i<4;i++)push();
  if(!reduce)setInterval(function(){if(!document.hidden)push()},2800);
})();

/* Magnetic buttons */
if(fine&&!reduce)$$('.mag').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)'});b.addEventListener('pointerleave',function(){b.style.transform=''})});

/* Service cards: spotlight + tilt */
$$('.svc').forEach(function(card){
  card.addEventListener('pointermove',function(e){var r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;card.style.setProperty('--mx',px*100+'%');card.style.setProperty('--my',py*100+'%');
    if(fine&&!reduce){card.style.setProperty('--ry',(px-.5)*5+'deg');card.style.setProperty('--rx',(.5-py)*5+'deg')}});
  card.addEventListener('pointerleave',function(){card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')});
});

/* Service drawer */
var dr=$('#drawer'),order=Object.keys(DATA.svc),cur=null,opener=null;
function openSvc(slug,from){var t=$('#tpl-'+slug);if(!t)return;cur=slug;
  var head=$('#dr-head');head.className='dr-head '+t.dataset.combo;$('#dr-title').textContent=t.dataset.name;$('#dr-n').textContent=t.dataset.n+' / 0'+order.length;
  var body=$('#dr-body');body.innerHTML='';body.appendChild(t.content.cloneNode(true));body.scrollTop=0;
  var i=order.indexOf(slug),pv=order[(i-1+order.length)%order.length],nx=order[(i+1)%order.length];
  $('#dr-prev span').textContent=DATA.svc[pv];$('#dr-prev').dataset.go=pv;$('#dr-next span').textContent=DATA.svc[nx];$('#dr-next').dataset.go=nx;
  $('[data-talk]',body).addEventListener('click',function(){pickService([this.dataset.talk]);closeDr(true)});
  if(!dr.open){opener=from||document.activeElement;dr.showModal()}
  history.replaceState(null,'','#svc-'+slug)}
function closeDr(toContact){if(!dr.open)return;
  function done(){dr.classList.remove('closing');dr.close();history.replaceState(null,'',location.pathname+location.search);
    if(toContact){$('#contact').scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(function(){$('#f-name').focus({preventScroll:true})},500)}else if(opener)opener.focus()}
  if(reduce)done();else{dr.classList.add('closing');setTimeout(done,280)}}
document.addEventListener('click',function(e){var o=e.target.closest('[data-open]');if(o){e.preventDefault();openSvc(o.dataset.open,o)}});
$('#dr-close').addEventListener('click',function(){closeDr()});
dr.addEventListener('cancel',function(e){e.preventDefault();closeDr()});
dr.addEventListener('click',function(e){if(e.target===dr)closeDr()});
$('#dr-prev').addEventListener('click',function(){openSvc(this.dataset.go)});
$('#dr-next').addEventListener('click',function(){openSvc(this.dataset.go)});
var hm=location.hash.match(/^#svc-([\w-]+)/);if(hm)setTimeout(function(){openSvc(hm[1])},300);

/* Contact form helpers */
function pickService(names){$$('#cform input[name=service]').forEach(function(c){if(names.indexOf(c.value)>-1)c.checked=true})}

/* IT health check */
(function(){var C=326.7,quiz=$('#quiz'),ring=$('#r-val'),last=null;
  function state(){var a={};DATA.q.forEach(function(q){var v=$('input[name="q-'+q.k+'"]:checked');if(v)a[q.k]=+v.value});return a}
  function update(){var a=state(),keys=Object.keys(a),n=keys.length,tot=DATA.q.length;
    $$('.q').forEach(function(f,i){f.classList.toggle('done',DATA.q[i].k in a)});
    $('#r-prog').style.width=(n/tot*100)+'%';
    if(!n){$('#r-num').textContent='–';ring.style.strokeDashoffset=C;$('#r-h').textContent='Start answering';$('#r-p').textContent='Your readiness score and recommendations will appear here.';$('#r-list').innerHTML='<li class="res-p">Answer a few questions to see recommendations.</li>';$('#r-send').disabled=true;last=null;return}
    var sum=keys.reduce(function(s,k){return s+a[k]},0),score=Math.round(sum/(n*2)*100);
    $('#r-num').textContent=score;ring.style.strokeDashoffset=C*(1-score/100);
    ring.style.stroke=score>=85?'#EDE2D6':score>=60?'#E0A43B':'#CC553D';
    var h=score>=85?'In good shape':score>=60?'A few gaps to close':'Worth a closer look';
    $('#r-h').textContent=h;$('#r-p').textContent=n<tot?(tot-n)+' question'+(tot-n>1?'s':'')+' left for a complete picture.':'Based on all '+tot+' answers.';
    var w={};DATA.q.forEach(function(q){if(q.k in a&&a[q.k]<2)w[q.svc]=(w[q.svc]||0)+(2-a[q.k])});
    var recs=Object.keys(w).sort(function(x,y){return w[y]-w[x]});
    $('#r-list').innerHTML=recs.length?recs.map(function(s){return '<li><button class="chip-link" data-open="'+s+'">'+DATA.svc[s].replace(/&/g,'&amp;')+' <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></li>'}).join(''):'<li class="res-p">No gaps flagged so far. Nice work.</li>';
    $('#r-send').disabled=false;last={score:score,h:h,a:a,recs:recs}}
  quiz.addEventListener('change',update);
  $('#r-reset').addEventListener('click',function(){quiz.reset();update()});
  $('#r-send').addEventListener('click',function(){if(!last)return;var L=['No','Partly','Yes'];
    var lines=DATA.q.filter(function(q){return q.k in last.a}).map(function(q){return '- '+DATA.qtext[q.k]+' '+L[last.a[q.k]]});
    $('#f-msg').value='I took the IT health check on your site and scored '+last.score+'/100 ("'+last.h+'").\n\n'+lines.join('\n')+'\n\nI\'d like to talk about next steps.';
    pickService(last.recs.map(function(s){return DATA.svc[s]}));
    $('#contact').scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(function(){$('#f-name').focus({preventScroll:true})},600);toast('Results added to the contact form')});
})();

/* Approach timeline progress */
var stepsEl=$('#steps'),stepEls=$$('.step');
function updateSteps(){var r=stepsEl.getBoundingClientRect(),vh=innerHeight,line=vh*.62;
  stepsEl.style.setProperty('--p',Math.max(0,Math.min(1,(line-r.top)/r.height)));
  stepEls.forEach(function(s){s.classList.toggle('on',s.getBoundingClientRect().top<line)})}
onScroll();

/* Tabs: industries + what we believe */
function tabs(list){var ts=$$('[role=tab]',list);
  function sel(t,focus){ts.forEach(function(b){var on=b===t;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;$('#'+b.getAttribute('aria-controls')).hidden=!on});if(focus)t.focus()}
  ts.forEach(function(t,i){t.addEventListener('click',function(){sel(t)});t.addEventListener('keydown',function(e){var k=e.key,j=null;if(k==='ArrowRight'||k==='ArrowDown')j=(i+1)%ts.length;if(k==='ArrowLeft'||k==='ArrowUp')j=(i-1+ts.length)%ts.length;if(k==='Home')j=0;if(k==='End')j=ts.length-1;if(j!==null){e.preventDefault();sel(ts[j],true)}})})}
tabs($('.ind-tabs'));tabs($('.bel-tabs'));

/* Partner filter */
(function(){var btns=$$('.pfilter button'),lis=$$('#pgrid li'),note=$('#pcount');
  function pick(b){var c=b.dataset.cat,n=0;btns.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    lis.forEach(function(li){var on=c==='all'||li.dataset.cats.split(' ').indexOf(c)>-1;li.hidden=!on;if(on){n++;li.style.animation='none';li.offsetWidth;li.style.animation=''}});
    note.textContent=c==='all'?'':'Showing '+n+' partners for '+b.firstChild.textContent+'.'}
  btns.forEach(function(b){b.addEventListener('click',function(){pick(b)})});
})();

/* Stats count up when visible */
if('IntersectionObserver' in window&&!reduce){var st=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;st.unobserve(e.target);var el=e.target,to=+el.dataset.to,s0=null;
  function f(ts){if(!s0)s0=ts;var p=Math.min(1,(ts-s0)/1200);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)}el.textContent='0';requestAnimationFrame(f)})},{threshold:.6});
  $$('[data-to]').forEach(function(el){st.observe(el)})}

/* Copy to clipboard */
$$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){var v=b.dataset.copy;
  (navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(function(){toast('Copied '+v)},function(){toast(v)})})});

/* Contact form -> mailto */
var f=$('#cform');
f.addEventListener('submit',function(e){e.preventDefault();var ok=true;
  [['f-name',function(v){return v.trim()}],['f-email',function(v){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)}],['f-msg',function(v){return v.trim()}]].forEach(function(r){var el=$('#'+r[0]),good=!!r[1](el.value);el.parentNode.classList.toggle('invalid',!good);el.setAttribute('aria-invalid',!good);if(!good&&ok){el.focus();ok=false}});
  if(!ok)return;
  var d=new FormData(f),svcs=d.getAll('service'),svc=svcs.length?svcs.join(', '):'Not sure yet',
    body='Name: '+d.get('name')+'\nCompany: '+(d.get('company')||'-')+'\nEmail: '+d.get('email')+'\nPhone: '+(d.get('phone')||'-')+'\nService: '+svc+'\n\n'+d.get('message');
  location.href='mailto:info@cipherzerosolutions.com?subject='+encodeURIComponent('Website enquiry — '+svc)+'&body='+encodeURIComponent(body);
  $('#ok').style.display='block'});

$('#yr').textContent=new Date().getFullYear();
})();
