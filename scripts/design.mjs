import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('design', { recursive: true });
const wrap = (w,h,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const rect = (x,y,w,h,fill='#F1F2EF',r=8,stroke='none') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const text = (x,y,label,size=16,fill='#35423A',weight=400) => `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${label}</text>`;
const circle = (x,y,r,fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const leaf = (x,y,rot=0) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="32" fill="#517C46" transform="rotate(${rot} ${x} ${y})"/>`;
for (const [i,name] of ['salad','bruschetta','pasta','fish','cake','lemonade'].entries()) {
  let body = rect(0,0,480,480,['#DCE4CF','#E9D7BF','#EBDFBD','#D4DFD9','#F0DFBB','#DCE6D1'][i],0);
  body += `<path d="M0 410L480 40M0 435L480 65" stroke="#FFFFFF" stroke-opacity=".2" stroke-width="16"/>`;
  body += circle(249,253,173,'#00000010') + circle(240,240,173,'#FAFAF3') + circle(240,240,144,'#EBEBDD');
  if (name === 'salad') {
    for(let k=0;k<19;k++){const a=k*2.4,r=30+(k%4)*24,x=240+Math.cos(a)*r,y=240+Math.sin(a)*r;body+=leaf(x,y,k*41);}
    for(let k=0;k<9;k++){const a=k*2.4,x=240+Math.cos(a)*95,y=240+Math.sin(a)*90;body+=circle(x,y,19,'#CD5941')+circle(x,y,12,'#E98561')+rect(x+16,y+17,24,22,'#FFFEED',3)+circle(x-23,y+20,9,'#333F32');}
  } else if(name === 'bruschetta') {
    for(let k=0;k<3;k++){const y=130+k*76;body+=`<g transform="rotate(-18 240 ${y})">${rect(140,y,200,65,'#A96C3D',27)}${rect(149,y+5,182,48,'#E3B778',23)}`;for(let j=0;j<5;j++)body+=rect(160+j*31,y+9+(j%2)*12,26,25,j%2?'#D4744B':'#B64D36',5)+leaf(172+j*31,y+26,j*40);body+='</g>';}
  } else if(name === 'pasta') {
    for(let k=0;k<16;k++)body+=`<path d="M${150+k*9} 160 C 370 ${160+k*5},100 ${270+k*3},${190+k*7} 330" stroke="${k%2?'#E9B84D':'#D99A35'}" stroke-width="9" fill="none"/>`;
    body+=leaf(210,200,40)+leaf(278,270,-35)+circle(320,165,32,'#F4CE14')+circle(320,165,24,'#FFF0A0');
  } else if(name === 'fish') {
    body+=`<ellipse cx="235" cy="237" rx="108" ry="60" transform="rotate(-25 235 237)" fill="#CC9D68"/>`;
    for(let k=0;k<5;k++)body+=`<path d="M${169+k*25} ${234-k*10}l25 37" stroke="#8A6549" stroke-width="5"/>`;
    body+=leaf(158,310,50)+leaf(180,326,80)+circle(315,164,37,'#F4CE14')+circle(315,164,28,'#FFF0A0');
  } else if(name === 'cake') {
    body+=`<path d="M145 222L317 171L311 306L145 305Z" fill="#D7A64D"/><path d="M145 222L235 142L317 171Z" fill="#FFF1AF"/><path d="M145 233L317 182L317 201L145 252Z" fill="#FFFCDE"/><path d="M145 277L313 242L313 260L145 294Z" fill="#FFF2BD"/>`+circle(266,177,26,'#F4CE14')+circle(266,177,19,'#FFF3A5')+leaf(226,167,65);
  } else {
    body+=`<path d="M175 130L305 130L290 350L190 350Z" fill="#F5CD45" stroke="#FFFFFF" stroke-width="7"/><path d="M190 147L285 147L275 320L202 320Z" fill="#F6DF7E"/><path d="M260 290L285 100L325 82" stroke="#495E57" stroke-width="9" fill="none"/>`+circle(196,152,42,'#F4CE14')+circle(196,152,32,'#FFF3A5')+leaf(221,250,-20)+leaf(253,220,50);
  }
  await writeFile(`design/${name}.svg`,wrap(480,480,body));
  await sharp(Buffer.from(wrap(480,480,body))).jpeg({quality:92}).toFile(`assets/${name}.jpg`);
}

// Editable vector wireframe: the same hierarchy used by the React Native screens.
let b=rect(0,0,1600,1200,'#F5F5F1',0)+text(60,67,'LITTLE LEMON',17,'#495E57',700)+text(60,119,'Mobile app / Wireframes',40,'#273B32',700)+text(60,157,'01  Onboarding  →  02  Home  ⇄  03  Profile',19);
const phone=(x,title,subtitle)=>rect(x,218,430,842,'#FFFFFF',28,'#AEB7B0')+text(x+25,199,title,22,'#273B32',700)+text(x+25,1094,subtitle,15)+text(x+25,255,'9:41',12)+text(x+337,255,'•••  ▰',12);
b+=phone(60,'01 / Onboarding','First launch → validate details → Next');
b+=phone(585,'02 / Home','Search + selected category filter together');
b+=phone(1110,'03 / Profile','Save persists on restart · Log out clears data');
function box(x,y,w,h,label){return rect(x,y,w,h,'#F0F1EE',8,'#C2C9C2')+text(x+14,y+27,label,15);}
function field(x,y,label,value=''){return text(x,y,label,13,'#657168',700)+rect(x,y+12,374,48,'#FFFFFF',7,'#B8C1B9')+text(x+14,y+42,value,14,'#829086');}
b+=text(157,296,'LITTLE LEMON',18,'#35423A',700)+box(88,322,374,160,'Welcome illustration')+text(88,520,'Welcome to Little Lemon.',26,'#35423A',700)+text(88,551,'Mediterranean favorites. A warm welcome.',15)+text(88,599,'Let’s get to know you',21,'#35423A',700)+field(88,635,'First name','Your first name')+field(88,730,'Email','you@example.com')+text(88,838,'Requires name + valid email.',14)+box(88,878,374,52,'Next → enabled only when valid')+text(88,986,'GOOD FOOD. GOOD COMPANY.',12);
b+=text(640,296,'LITTLE LEMON',18,'#35423A',700)+circle(961,290,21,'#D9DFD8')+text(951,295,'AB',12)+box(613,324,374,239,'HERO')+text(629,386,'Little Lemon / Chicago',24,'#35423A',700)+text(629,419,'Restaurant description',15)+text(629,445,'with a food illustration',15)+box(629,486,342,52,'⌕  Search for a dish…')+text(613,606,'Today’s menu',23,'#35423A',700);
for(const [i,c] of ['All','Starters','Mains','Desserts'].entries())b+=rect(613+i*94,630,86,38,i===0?'#77877C':'#E8ECE5',19)+text(627+i*94,655,c,13,i===0?'white':'#35423A',700);
for(let k=0;k<3;k++){const y=703+k*109;b+=text(613,y,['Greek Salad','Bruschetta','Lemon Pasta'][k],19,'#35423A',700)+text(613,y+25,'Brief description of the dish',13)+text(613,y+52,['$12.99','$7.99','$16.50'][k],15,'#35423A',700)+box(906,y-15,81,76,'Image');}
b+=text(1140,296,'←',23)+text(1230,296,'LITTLE LEMON',18,'#35423A',700)+text(1138,345,'Your profile',29,'#35423A',700)+circle(1174,399,30,'#D9DFD8')+text(1162,405,'AB',17)+text(1220,400,'Guest initials + name',17)+field(1138,465,'First name','Alex')+field(1138,555,'Last name','Brown')+field(1138,645,'Email','alex@example.com')+field(1138,735,'Phone number','Optional')+text(1138,832,'☑ Order updates     ☐ News and offers',14)+box(1138,854,374,48,'Save changes')+box(1138,915,178,48,'Discard changes')+box(1332,915,180,48,'Log out')+text(1138,1006,'Back returns to Home.',14);
b+=text(60,1163,'LAYOUT: HEADER → HERO / SEARCH → MENU CATEGORIES → FOOD LIST',16,'#495E57',700);
await writeFile('design/wireframe.svg',wrap(1600,1200,b));
await sharp(Buffer.from(wrap(1600,1200,b))).jpeg({quality:95}).toFile('design/wireframe.jpg');
console.log('Created 6 bundled illustrations and editable SVG + JPG wireframe.');
