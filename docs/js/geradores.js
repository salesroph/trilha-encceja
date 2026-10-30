// Geradores de questões de Matemática: cada chamada sorteia números novos e calcula o gabarito.
// Assim os exercícios de Matemática são infinitos e funcionam mesmo sem internet ou sem IA.
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=list=>list[Math.floor(Math.random()*list.length)];
const num=(n,dec=2)=>Number(n.toFixed(dec)).toLocaleString('pt-BR',{maximumFractionDigits:dec});
const money=n=>'R$ '+n.toLocaleString('pt-BR',{minimumFractionDigits:Number.isInteger(n)?0:2,maximumFractionDigits:2});

// Monta 4 alternativas: a correta e três erradas diferentes entre si (completa com vizinhos se faltar).
function makeOptions(correct,wrongs,format=String){
  const seen=new Set([format(correct)]),opts=[format(correct)];
  for(const w of wrongs){const f=format(w);if(Number.isFinite(w)&&w>=0&&!seen.has(f)){seen.add(f);opts.push(f)}if(opts.length===4)break}
  let step=1;while(opts.length<4){for(const w of [correct+step,correct-step]){const f=format(w);if(w>=0&&!seen.has(f)&&opts.length<4){seen.add(f);opts.push(f)}}step++}
  return {alternativas:opts,correta:0};
}
const q=(enunciado,options,explicacao,dificuldade)=>({enunciado,...options,explicacao,dificuldade});

const generators={
  mat(){ // porcentagem
    const kind=ri(0,2),p=pick([5,10,15,20,25,30,40,50]),v=pick([40,60,80,120,150,200,240,300,400,500,800,1200]);
    const part=v*p/100;
    if(kind===0)return q(`Quanto é ${p}% de ${money(v)}?`,makeOptions(part,[part*10,v-part,p,part/2],money),`${p}% = ${p}/100. ${v} × ${num(p/100)} = ${num(part)}.`,'fácil');
    if(kind===1)return q(`Um produto de ${money(v)} está com ${p}% de desconto. Qual é o preço final?`,makeOptions(v-part,[part,v+part,v-p],money),`Desconto: ${p}% de ${money(v)} = ${money(part)}. Preço final: ${money(v)} − ${money(part)} = ${money(v-part)}.`,'média');
    const novo=v+part;
    return q(`Um aluguel de ${money(v)} teve aumento de ${p}%. Qual é o novo valor?`,makeOptions(novo,[part,v-part,v+p],money),`Aumento: ${p}% de ${money(v)} = ${money(part)}. Novo valor: ${money(v)} + ${money(part)} = ${money(novo)}.`,'média');
  },
  'mat-fracoes'(){
    const kind=ri(0,2);
    if(kind===0){const d=pick([4,5,6,8,10,12]),a=ri(1,d-2),b=ri(1,d-a-1);return q(`Quanto é ${a}/${d} + ${b}/${d}?`,(o=>(o.alternativas[3]=`${a+b}/${d*2}`,o))(makeOptions(a+b,[a*b,a+b+1,a+b-1],n=>`${n}/${d}`)),`Com denominadores iguais, some os numeradores e mantenha o denominador: ${a} + ${b} = ${a+b}, então ${a+b}/${d}.`,'fácil')}
    if(kind===1){const [n,d]=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[1,8],[3,8],[7,10]]);const r=n/d;return q(`Qual número decimal equivale a ${n}/${d}?`,makeOptions(r,[d/n,n/10,r*10],x=>num(x,3)),`Divida o numerador pelo denominador: ${n} ÷ ${d} = ${num(r,3)}.`,'média')}
    const d=pick([3,4,5,6,8]),n=ri(1,d-1),total=d*ri(2,9),r=total/d*n;
    return q(`Uma turma tem ${total} alunos e ${n}/${d} deles usam ônibus. Quantos alunos usam ônibus?`,makeOptions(r,[total/d,total-r,r+d]),`Divida o total por ${d} (${total/d}) e multiplique por ${n}: ${total/d} × ${n} = ${r}.`,'média');
  },
  'mat-proporcao'(){
    const kind=ri(0,1);
    if(kind===0){const a=ri(2,6),pa=ri(2,9)*a,b=a*ri(2,4),r=pa/a*b;return q(`Uma receita para ${a} pessoas usa ${pa} colheres de açúcar. Mantendo a proporção, quantas colheres são necessárias para ${b} pessoas?`,makeOptions(r,[pa+b,pa*b/a+a,r/2]),`Por pessoa: ${pa} ÷ ${a} = ${pa/a}. Para ${b} pessoas: ${pa/a} × ${b} = ${r}.`,'média')}
    // Grandezas inversas: o número de dias sempre divide certinho.
    const w=ri(2,6),w2=ri(2,4),d=w2*ri(3,8),total=w*d,r=total/(w*w2);
    return q(`${w} pedreiros constroem um muro em ${d} dias. Quantos dias ${w*w2} pedreiros, no mesmo ritmo, levariam?`,makeOptions(r,[d*w2,d+w2,d-w2]),`São grandezas inversas: mais pedreiros, menos dias. Total de trabalho = ${w} × ${d} = ${total} pedreiro-dias. ${total} ÷ ${w*w2} = ${r} dias.`,'difícil');
  },
  'mat-equacoes'(){
    const kind=ri(0,1),x=ri(2,15);
    if(kind===0){const a=ri(2,9),b=ri(1,20),c=a*x+b;return q(`Qual é o valor de x em ${a}x + ${b} = ${c}?`,makeOptions(x,[(c+b)/a,c-b,x+a]),`Subtraia ${b}: ${a}x = ${c-b}. Divida por ${a}: x = ${x}.`,a>5?'média':'fácil')}
    const fixo=ri(3,12),km=pick([1.5,2,2.5,3,4]),d=ri(3,20),r=fixo+km*d;
    return q(`Um aplicativo cobra ${money(fixo)} fixos mais ${money(km)} por km. Quanto custa uma corrida de ${d} km?`,makeOptions(r,[km*d,(fixo+km)*d,fixo*d+km],money),`Preço = fixo + valor por km × distância = ${fixo} + ${num(km)} × ${d} = ${money(r)}.`,'média');
  },
  'mat-funcoes'(){
    const a=ri(2,6),b=ri(1,15),x=ri(2,10),r=a*x+b;
    if(ri(0,1))return q(`Na função f(x) = ${a}x + ${b}, quanto vale f(${x})?`,makeOptions(r,[a*(x+b),a+x+b,r-b]),`Substitua x por ${x}: ${a} × ${x} + ${b} = ${r}.`,'fácil');
    const fixo=ri(20,60),porMin=pick([0.5,1,1.5,2]),min=ri(10,60),total=fixo+porMin*min;
    return q(`Um plano de celular custa ${money(fixo)} por mês mais ${money(porMin)} por minuto extra. Qual função dá o valor V para m minutos extras?`,{alternativas:[`V = ${num(porMin)}m + ${fixo}`,`V = ${fixo}m + ${num(porMin)}`,`V = ${num(fixo+porMin)}m`,`V = ${fixo} − ${num(porMin)}m`],correta:0},`O valor fixo (${fixo}) é somado ao valor por minuto (${num(porMin)}) vezes m. Exemplo: com ${min} min, V = ${money(total)}.`,'média');
  },
  'mat-geometria'(){
    const c=ri(3,15),l=ri(2,12),h=ri(2,6),kind=ri(0,2);
    if(kind===0)return q(`Um terreno retangular mede ${c} m por ${l} m. Qual é a sua área?`,makeOptions(c*l,[2*(c+l),c+l,c*l*2],x=>x+' m²'),`Área do retângulo = comprimento × largura = ${c} × ${l} = ${c*l} m².`,'fácil');
    if(kind===1)return q(`Quantos metros de cerca são necessários para contornar um terreno retangular de ${c} m por ${l} m?`,makeOptions(2*(c+l),[c*l,c+l,4*c],x=>x+' m'),`Perímetro = soma dos 4 lados = ${c} + ${l} + ${c} + ${l} = ${2*(c+l)} m.`,'fácil');
    return q(`Uma caixa-d'água tem formato de bloco com ${c} m × ${l} m × ${h} m. Qual é o seu volume?`,makeOptions(c*l*h,[c*l,c+l+h,c*l*h*2,(c*l+l*h+c*h)*2],x=>x+' m³'),`Volume = comprimento × largura × altura = ${c} × ${l} × ${h} = ${c*l*h} m³.`,'média');
  },
  'mat-probabilidade'(){
    const kind=ri(0,1);
    if(kind===0){const n=ri(3,5),m=ri(10,30),vals=Array.from({length:n},()=>m+ri(-8,8));const s=vals.reduce((a,b)=>a+b,0);const adj=s%n;vals[0]-=adj;const total=s-adj,med=total/n;
      return q(`As notas de um aluno foram ${vals.join(', ')}. Qual é a média?`,makeOptions(med,[total,Math.max(...vals),med+2]),`Some (${total}) e divida pela quantidade (${n}): ${total} ÷ ${n} = ${med}.`,'média')}
    const az=ri(2,8),vm=ri(2,8);let br=ri(1,6);if(az===vm+br)br++;const t=az+vm+br;
    return q(`Uma urna tem ${az} bolas azuis, ${vm} vermelhas e ${br} brancas. Sorteando uma, qual a probabilidade de sair azul?`,{alternativas:[`${az}/${t}`,`${az}/${vm+br}`,`1/${t}`,`${vm+br}/${t}`],correta:0},`Casos favoráveis (azuis) ÷ total de bolas = ${az}/${t}.`,'média');
  },
  'mat-graficos-tabelas'(){
    const meses=['janeiro','fevereiro','março','abril'],vals=meses.map(()=>ri(8,40)*10);
    if(ri(0,1)){const i=ri(0,2),j=i+1,d=vals[j]-vals[i];return q(`Uma tabela mostra o consumo de energia (kWh) de uma casa: ${meses.map((m,k)=>`${m}: ${vals[k]}`).join('; ')}. Qual foi a variação de ${meses[i]} para ${meses[j]}?`,makeOptions(d,[vals[j]+vals[i],-d,vals[j]],x=>(x>0?'+':'')+x+' kWh'),`Variação = valor final − valor inicial = ${vals[j]} − ${vals[i]} = ${d>0?'+':''}${d} kWh.`,'média')}
    const mx=Math.max(...vals),i=vals.indexOf(mx);
    return q(`Vendas de uma loja (unidades): ${meses.map((m,k)=>`${m}: ${vals[k]}`).join('; ')}. Em que mês vendeu mais?`,{alternativas:[meses[i],...meses.filter((_,k)=>k!==i)],correta:0},`O maior valor da tabela é ${mx}, em ${meses[i]}.`,'fácil');
  },
  'mat-medidas'(){
    const kind=ri(0,2);
    if(kind===0){const l=ri(2,9)+pick([0,0.5]);return q(`Quantos mililitros há em ${num(l)} litros?`,makeOptions(l*1000,[l*100,l*10,l*10000],x=>num(x,0)+' mL'),`1 L = 1 000 mL. ${num(l)} × 1 000 = ${num(l*1000,0)} mL.`,'fácil')}
    if(kind===1){const km=ri(2,15)+pick([0,0.5]);return q(`${num(km)} km correspondem a quantos metros?`,makeOptions(km*1000,[km*100,km*10,km*10000],x=>num(x,0)+' m'),`1 km = 1 000 m. ${num(km)} × 1 000 = ${num(km*1000,0)} m.`,'fácil')}
    const esc=pick([100,1000,10000,50000]),cm=ri(2,9),real=cm*esc/100;
    return q(`Num mapa na escala 1:${esc.toLocaleString('pt-BR')}, uma distância de ${cm} cm corresponde a quantos metros na realidade?`,makeOptions(real,[real*10,real/10,cm*esc]),`${cm} cm × ${esc.toLocaleString('pt-BR')} = ${(cm*esc).toLocaleString('pt-BR')} cm = ${num(real,0)} m.`,'difícil');
  },
  'mat-juros'(){
    const c=pick([500,800,1000,1500,2000,3000]),i=pick([1,2,3,5]),t=ri(2,8);
    if(ri(0,1)){const j=c*i/100*t;return q(`Quanto rendem ${money(c)} a juros simples de ${i}% ao mês durante ${t} meses?`,makeOptions(j,[c*i/100,c+j,j*2],money),`Juros simples: ${money(c)} × ${i}% × ${t} = ${money(c*i/100)} × ${t} = ${money(j)}.`,'média')}
    const i2=pick([10,20]),m=c*(1+i2/100)**2,ms=c*(1+2*i2/100);
    return q(`${money(c)} aplicados a juros compostos de ${i2}% ao mês. Quanto haverá após 2 meses?`,makeOptions(m,[ms,c*(1+i2/100),c+i2*2],money),`Mês 1: ${money(c)} × ${num(1+i2/100)} = ${money(c*(1+i2/100))}. Mês 2: × ${num(1+i2/100)} = ${money(m)}. (Juros sobre juros.)`,'difícil');
  },
  'mat-potencias'(){
    const kind=ri(0,2);
    if(kind===0){const b=ri(2,6),e=ri(2,4),r=b**e;return q(`Quanto vale ${b}${'⁰¹²³⁴'[e]}?`,makeOptions(r,[b*e,b+e,r/b]),`${b}${'⁰¹²³⁴'[e]} = ${Array(e).fill(b).join(' × ')} = ${r}.`,'fácil')}
    if(kind===1){const n=ri(4,15);return q(`Qual é a raiz quadrada de ${n*n}?`,makeOptions(n,[n*2,n+1,n*n/2]),`${n} × ${n} = ${n*n}, então √${n*n} = ${n}.`,'fácil')}
    const m=ri(2,9),e=ri(3,8);const sup='⁰¹²³⁴⁵⁶⁷⁸⁹';
    return q(`Como se escreve ${(m*10**e).toLocaleString('pt-BR')} em notação científica?`,{alternativas:[`${m} × 10${sup[e]}`,`${m} × 10${sup[e-1]}`,`${m} × 10${sup[e+1]}`,`${m*10} × 10${sup[e]}`],correta:0},`A vírgula anda ${e} casas: ${m} × 10${sup[e]}.`,'média');
  },
  'mat-pitagoras'(){
    const [a,b,c]=pick([[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17],[12,16,20]]);
    if(ri(0,1))return q(`Um triângulo retângulo tem catetos de ${a} cm e ${b} cm. Quanto mede a hipotenusa?`,makeOptions(c,[a+b,c+1,b],x=>x+" cm"),`${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}. √${c*c} = ${c} cm.`,'média');
    return q(`Uma escada de ${c} m está apoiada em um muro, com o pé a ${a} m da parede. A que altura ela toca o muro?`,makeOptions(b,[c-a,c+a,c],x=>x+" m"),`${c}² = ${a}² + h² → ${c*c} = ${a*a} + h² → h² = ${b*b} → h = ${b} m.`,'difícil');
  },
  'mat-contagem'(){
    const a=ri(2,6),b=ri(2,5),kind=ri(0,2);
    if(kind===0)return q(`Uma lanchonete oferece ${a} tipos de pão e ${b} tipos de recheio. Quantos sanduíches diferentes (1 pão e 1 recheio) podem ser montados?`,makeOptions(a*b,[a+b,a*b*2,a*a]),`Princípio multiplicativo: ${a} × ${b} = ${a*b}.`,'fácil');
    if(kind===1){const n=ri(3,5),f=[1,1,2,6,24,120][n];return q(`De quantas maneiras ${n} pessoas podem se organizar em uma fila?`,makeOptions(f,[n*n,n*2,f/2]),`${Array.from({length:n},(_,i)=>n-i).join(' × ')} = ${f}.`,'média')}
    const d=ri(3,4),r=10*9*8*(d===4?7:1);
    return q(`Quantas senhas de ${d} dígitos diferentes (sem repetir) podem ser formadas com os algarismos de 0 a 9?`,makeOptions(r,[10**d,10*d,r/2]),`${d===4?'10 × 9 × 8 × 7':'10 × 9 × 8'} = ${r}.`,'difícil');
  },
};

// Gera uma questão nova para a aula (ou null se a aula não tem gerador).
function generateQuestion(lessonId){
  const g=generators[lessonId];if(!g)return null;
  const base=g();const right=base.alternativas[base.correta];
  const alternativas=[...base.alternativas].sort(()=>Math.random()-.5);
  return {...base,alternativas,correta:alternativas.indexOf(right),aula:lessonId,origem:'gerada'};
}
