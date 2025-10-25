interface Env {
 JHM5_4_KV: KVNamespace;
}
export async function handleMathGameAPI(request: Request, env: Env): Promise<Response> {
 const corsHeaders = {
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
 'Access-Control-Allow-Headers': 'Content-Type',
 };
 if (request.method === 'OPTIONS') {
 return new Response(null, { headers: corsHeaders });
 }
 try {
 const key = 'jhm5_4_mathgame_scores';
 if (request.method === 'GET') {
 const scores = await env.JHM5_4_KV.get(key);
 return new Response(scores || '[]', {
 headers: { ...corsHeaders, 'Content-Type': 'application/json' },
 });
 }
 if (request.method === 'POST') {
 const newScore = await request.json();
 const scoresData = await env.JHM5_4_KV.get(key);
 const scores = scoresData ? JSON.parse(scoresData) : [];
 scores.push({ ...newScore, timestamp: Date.now() });
 scores.sort((a: any, b: any) => b.score - a.score);
 const topScores = scores.slice(0, 100);
 await env.JHM5_4_KV.put(key, JSON.stringify(topScores));
 return new Response(JSON.stringify(topScores), {
 headers: { ...corsHeaders, 'Content-Type': 'application/json' },
 });
 }
 return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
 } catch (error) {
 return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
 status: 500,
 headers: { ...corsHeaders, 'Content-Type': 'application/json' },
 });
 }
}