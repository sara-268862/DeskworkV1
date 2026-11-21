/* Stockage : comptes, session et données de progression par utilisateur.
   Tout est local au navigateur (aucun serveur). Si localStorage est indisponible
   (navigation privée stricte), un repli en mémoire est utilisé pour la session. */
const LS=(()=>{const mem={};let ok=true;try{localStorage.setItem('dw-t','1');localStorage.removeItem('dw-t')}catch(e){ok=false}
return{ok,
get(k){try{return ok?localStorage.getItem(k):(k in mem?mem[k]:null)}catch(e){return null}},
set(k,v){try{if(ok)localStorage.setItem(k,v);else mem[k]=v;return true}catch(e){return false}},
del(k){try{if(ok)localStorage.removeItem(k);else delete mem[k]}catch(e){}},
keys(){try{return ok?Object.keys(localStorage):Object.keys(mem)}catch(e){return[]}}}})();
const SS=(()=>{const mem={};return{get(k){try{return sessionStorage.getItem(k)}catch(e){return k in mem?mem[k]:null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){mem[k]=v}},del(k){try{sessionStorage.removeItem(k)}catch(e){delete mem[k]}}}})();
const jget=(s,d)=>{try{const v=JSON.parse(s);return v==null?d:v}catch(e){return d}};

/* Données par défaut d'un utilisateur */
const newData=()=>({hist:[],xp:0,streak:0,bestStreak:0,lastDay:'',badges:{},errors:[],fixed:0,daily:{date:'',total:0},ver:2});
const ymd=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');

const DB={
users(){return jget(LS.get('dw-users'),{})},
saveUsers(u){return LS.set('dw-users',JSON.stringify(u))},
byEmail(e){const u=DB.users();return Object.values(u).find(x=>x.email===e)||null},
byId(id){return DB.users()[id]||null},
dataKey:id=>'dw-data:'+(id||'guest'),
loadData(id){const d=jget(LS.get(DB.dataKey(id)),null);return Object.assign(newData(),d||{})},
saveData(id,d){return LS.set(DB.dataKey(id),JSON.stringify(d))},
dropData(id){LS.del(DB.dataKey(id))}};

/* Utilisateur courant (U) et ses données (D). hist reste un alias de D.hist pour les anciennes vues. */
let U=null,D=newData(),hist=D.hist;
function useData(d){D=d;hist=D.hist}
function persist(){if(!DB.saveData(U?U.id:null,D))toast('Impossible d’enregistrer : stockage du navigateur indisponible.')}

/* Migration de l'ancien historique (version sans comptes) vers le profil invité */
(function migrate(){const old=jget(LS.get('dw-hist2'),null);if(old&&Array.isArray(old)&&!LS.get(DB.dataKey(null))){const d=newData();d.hist=old;DB.saveData(null,d)}})();

/* Niveaux, XP et titres */
const RANKS=['Stagiaire','Assistant','Analyste','Chargé de mission','Responsable','Directeur','Associé','Expert reconnu'];
const lvlOf=xp=>Math.floor(Math.sqrt(xp/50))+1;
const lvlStart=l=>50*(l-1)*(l-1);
const rankOf=l=>RANKS[Math.min(RANKS.length-1,Math.floor((l-1)/2))];
