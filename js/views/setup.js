function setup(){const f=F[cur],o=S&&S.cfg&&!S.cfg.mode?S.cfg:{diff:'deb'},cfg={diff:o.diff};
app.innerHTML=`<div class="top"><div style="color:${f.col}">${scene(cur,f.col)}</div><div><h2>${f.n}</h2><p class="muted" style="margin:0 0 6px">${f.ro}</p><div class="panel memo"><small>Note de service</small><p style="margin:4px 0 0">${f.ctx}</p></div></div></div>
<div class="panel"><h3>Niveau de difficulté</h3><div class="seg" id="sd"><button data-v="deb" class="${o.diff=='deb'?'on':''}">Débutant</button><button data-v="int" class="${o.diff=='int'?'on':''}">Intermédiaire</button><button data-v="hard" class="${o.diff=='hard'?'on':''}">Difficile</button></div><p class="muted" id="ld" style="margin:12px 0 0"></p>

<p style="margin-top:22px"><button class="btn" id="st">Lancer la simulation</button></p></div>`;
$('#ld').textContent=LV[cfg.diff];$('#sd').onclick=e=>{const v=e.target.dataset.v;if(!v)return;cfg.diff=v;$('#ld').textContent=LV[v];[...$('#sd').children].forEach(b=>b.classList.toggle('on',b.dataset.v===v))};
$('#st').onclick=()=>{ctx();const rs=rounds(f,cfg.diff);S={cfg,v:f.m.map(x=>x[2]),i:0,n:rs.length,rs,sc:[0,0,0,0],log:[],r:null,streak:0,pts:0};nav('play')}}
