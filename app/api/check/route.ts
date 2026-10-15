function allowed(u: URL) {
 const h=u.hostname.toLowerCase();
 return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password&&(!u.port||['80','443'].includes(u.port))&&h.includes('.')&&!h.endsWith('.local')&&!h.endsWith('.internal')&&!h.endsWith('.localhost')&&!/^[\d.]+$/.test(h)&&!h.includes(':')&&h!=='localhost';
}
export async function POST(request: Request) {
 try {
 const body=await request.json() as {url?:unknown}; if(typeof body.url!=="string")return Response.json({error:"Укажите адрес сайта"},{status:400}); let u=new URL(body.url);
 if(!allowed(u))return Response.json({error:'Укажите публичный HTTP(S) адрес без нестандартного порта.'},{status:400});
 const started=performance.now(); let response:Response|undefined;
 for(let i=0;i<5;i++){
 response=await fetch(u,{method:'GET',redirect:'manual',signal:AbortSignal.timeout(10000),headers:{'User-Agent':'PulseMonitor/1.0'},cache:'no-store'});
 if(response.status>=300&&response.status<400&&response.headers.get('location')){const next=new URL(response.headers.get('location')!,u);await response.body?.cancel();if(!allowed(next))throw new Error('Недопустимое перенаправление');u=next;continue;}break;
 }
 const status=response?.status??0;await response?.body?.cancel();
 return Response.json({status,ms:Math.round(performance.now()-started),ok:status>=200&&status<400,at:Date.now()});
 } catch {return Response.json({status:0,ms:0,ok:false,at:Date.now(),error:'Сайт не ответил за 10 секунд или отклонил проверку.'});}
}
