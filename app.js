'use strict';
const people = [
 ['quynh-quynh','Trần Thị Như Quỳnh'],['xuan-kien','Xuân Kiên'],['hai-my-2','Đinh cao khánh'],['nguyen-thi-bich-ngoc','Nguyễn Thị Bích Ngọc'],['mai-phuong','Phạm Nguyễn Mai Phương'],['lang-thi-thao-chi','Lang Thị Thảo Chi'],['tran-thi-thao-trang','Trần Thị Thảo Trang'],['le-hoa','Lê Thị Hòa'],['tran-thi-tra-my','Trần Thị Trà My'],['nguyen-thi-khanh-huyen','Nguyễn Thị Khánh Huyền'],['hang-nguyen','Nguyễn Thị Hằng'],['pham-thi-khanh-huyen','Phạm Thị Khánh Huyền'],['le-thi-thu-hang','Lê Thị Thu Hằng'],['truong-thi-mai','Trương Thị Mai'],['nguyen-thi-thuy-duong','Nguyễn Thị Thùy Dương'],['nguyen-thi-huyen-trang','Nguyễn Thị Huyền Trang'],['nguyen-thi-thuy-linh','Nguyễn Thị Thùy Linh'],['le-thi-loan','Lê Thị Loan'],['luu-thi-hoai-thu','Lưu Thị Hoài Thu'],['nguyen-thi-ngoc-1','Nguyễn Thị Ngọc'],['nguyen-thi-ngoc-2','Nguyễn Thị Ngọc'],['phan-nguyen-linh-nga','Phan Nguyễn Linh Nga'],['dao-thi-huyen-trang','Đào Thị Huyền Trang'],['tu-nguyen-khanh-linh','Từ Nguyễn Khánh Linh'],['nguyen-thi-luu','Nguyễn Thị Lưu'],['tue-quan','Tuệ Quân'],['hang-ho','Hằng Hồ']
].map(([id,name],index)=>({id,name,index,photo:`./assets/people/${id}.webp`}));
const $=id=>document.getElementById(id), normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();
const palette=[['rose','#95546d','#efb1c0'],['peach','#a96580','#f5c6cd'],['lilac','#984467','#eca6bf'],['cream','#a36380','#efb8cb']];
let stored={}; try{stored=JSON.parse(localStorage.getItem('bouquet-state')||'{}');}catch{}
const seen=new Set(Array.isArray(stored.seen)?stored.seen:[]); let motion=stored.motion!==false, active=null, previousFocus=null, matches=[],selected=-1;
function persist(){try{localStorage.setItem('bouquet-state',JSON.stringify({seen:[...seen],motion}));}catch{}}
let row=0;
people.forEach(p=>{
  const i=p.index; row=i<4?0:i<9?1:i<15?2:i<21?3:4;
  const starts=[0,4,9,15,21],lefts=[30.5,24,17.5,17.5,24], tops=[84,150,216,282,348];
  const [flower,ink,tint]=palette[i%4]; const button=document.createElement('button');
  button.type='button';button.className='flower'+(seen.has(p.id)?' is-seen':'');button.dataset.person=p.id;
  button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','wish-dialog');button.setAttribute('aria-label',`Mở bông hồng số ${i+1}`);
  button.style.cssText=`--left:${lefts[row]+13*(i-starts[row])}%;--top:${tops[row]/680*100}%;--size:${(120+i%3*2)/600*100}%;--turn:${(i*19)%48-24}deg;--layer:${row+3};--flower-ink:${ink};--flower-tint:${tint};--grow-delay:${i*.04}s`;
  button.innerHTML=`<span class="flower-head"><img class="flower-petals" src="./assets/flowers/${flower}.svg" alt="" width="160" height="160" decoding="async"><span class="flower-glint" aria-hidden="true">✧</span><span class="flower-seen" aria-hidden="true">✓</span></span>`;
  button.addEventListener('click',()=>openWish(p));p.button=button;$('flower-grid').append(button);
});
const themes=['Những ngày thêm tự tin','Một khoảng trời bình yên','Niềm vui trong những điều nhỏ','Dành cho những ước mơ','Luôn được yêu thương','Rực rỡ theo cách riêng'];
const openings=[
 'Bông hồng này gửi bạn một chút vững lòng trước những điều mới. Mong mỗi lựa chọn đều được lắng nghe, mỗi ý tưởng đều có cơ hội và mỗi cố gắng đều được tôn trọng.',
 'Nhân ngày 20/10, gửi bạn một bông hồng và thật nhiều lời chúc ấm áp. Mong bạn luôn có đủ tự tin để làm điều mình yêu thích, đủ bình yên để tận hưởng từng ngày.',
 'Một bông hoa nhỏ, mang theo lời chúc thật lòng: mong bạn luôn khỏe mạnh, vui vẻ và được trân trọng. Chúc hành trình phía trước có nhiều niềm vui và những người đồng hành tử tế.',
 'Chúc bạn giữ được nụ cười và sự dịu dàng dành cho chính mình giữa những ngày bận rộn. Mong điều bạn đang cố gắng sẽ từng chút một nở hoa, theo nhịp riêng của bạn.',
 'Gửi bạn một ngày đầy nắng ấm và những điều dễ thương. Mong mỗi buổi sáng đều có một lý do để mỉm cười, mỗi buổi tối đều có một khoảng nghỉ thật yên.',
 'Chúc bạn luôn được là chính mình, tự tin với lựa chọn và rạng rỡ theo cách riêng. Mong những dự định đang ấp ủ sẽ gặp đúng cơ hội và những nỗ lực được ghi nhận.'
];
const middles=[
 'Xin chúc những phút nghỉ ngơi của bạn thật dễ chịu, với một góc nhỏ yên và món uống vừa ý.',
 'Mong bên cạnh công việc, bạn luôn có thời gian cho những sở thích, những cuộc hẹn và những người thân thương.',
 'Chúc những ngày sắp tới có thêm nhiều tin vui, những cuộc trò chuyện ấm lòng và những khoảnh khắc khiến bạn thấy mình được yêu thương.',
 'Mong bạn có sức khỏe, có niềm vui và có thật nhiều điều đáng mong chờ, từ những thành công lớn đến những hạnh phúc giản dị.'
];
const endings=[
 'Mong những đóng góp của bạn được trân trọng trong cả kết quả lớn lẫn những việc nhỏ hằng ngày. Chúc thế giới riêng của bạn có nhiều trang sách hay, món ăn mới và những trải nghiệm vui. Mong sự trân trọng tìm đến bạn cả trong lời nói lẫn những việc làm cụ thể.',
 'Cảm ơn bạn vì đã cùng tạo nên một tập thể ấm áp. Chúc bạn luôn tìm thấy niềm vui trong công việc, tự hào về những gì đã làm được và dành cho bản thân sự quan tâm xứng đáng.',
 'Mong những điều tốt đẹp tìm đến bạn trong cả ngày lễ lẫn ngày thường. Chúc bạn đủ vững vàng để bước tiếp, đủ thảnh thơi để ngắm nhìn và đủ yêu thương để thấy mỗi ngày đều đáng quý.',
 'Chúc những ước mơ của bạn có thêm một bước tiến, những lo lắng nhẹ đi một chút và những niềm vui ở lại lâu hơn. Mong bạn luôn được lắng nghe, được tôn trọng và được tiếp sức trên hành trình của mình.'
];
const closings=['Mong bạn có một ngày 20/10 nhiều màu hoa đẹp và nhiều cảm giác bình yên!','Chúc bạn ngày 20/10 thật vui, thật ấm áp và luôn được trân trọng!','Gửi bạn một ngày thật đẹp, cùng thật nhiều yêu thương!','Chúc bạn luôn rạng rỡ, theo cách riêng của mình!'];
let greetingNumber=Math.floor(Math.random()*96);const lastGreetings=new Map();
function makeGreeting(p){let n;do{n=greetingNumber++%96;}while(n===lastGreetings.get(p.id));lastGreetings.set(p.id,n);return {theme:themes[n%6],paragraphs:[openings[n%6]+' '+middles[Math.floor(n/6)%4],endings[Math.floor(n/24)%4]],closing:closings[n%4]};}
function burst(){if(!motion||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const box=document.createElement('div');box.className='celebration';box.setAttribute('aria-hidden','true');for(let i=0;i<22;i++){const petal=document.createElement('i');petal.className='falling-petal'+(i%5===0?' spark':'');petal.style.cssText=`--x:${Math.random()*100}%;--size:${6+Math.random()*9}px;--petal:${['#edb4c4','#f3d4d1','#d7dec6'][i%3]};--duration:${3+Math.random()*2}s;--delay:${Math.random()*.8}s;--rotate:${Math.random()*180}deg`;box.append(petal);}$('wish-dialog').append(box);setTimeout(()=>box.remove(),6000);}
function openWish(p,changeUrl=true){active=p;previousFocus=document.activeElement;const wish=makeGreeting(p);p.greeting=wish;$('wish-photo').src=p.photo;$('wish-photo').alt=`Ảnh của ${p.name}`;$('photo-name').textContent=p.name;$('wish-dedication').textContent='GỬI BẠN '+p.name.toLocaleUpperCase('vi');$('wish-theme').textContent=wish.theme;$('wish-words').replaceChildren(...wish.paragraphs.map(text=>{const el=document.createElement('p');el.textContent=text;return el;}));$('wish-closing').textContent=wish.closing;$('wish-dialog').style.setProperty('--card-accent',palette[p.index%4][1]);$('wish-toast').hidden=true;$('share-fallback').hidden=true;$('name-results').hidden=true;$('name-search').setAttribute('aria-expanded','false');seen.add(p.id);p.button.classList.add('is-seen');persist();if(changeUrl){const url=new URL(location.href);url.searchParams.set('hoa',p.id);history.pushState({bouquetModal:true},'',url);}if(!$('wish-dialog').open)$('wish-dialog').showModal();$('wish-dialog').scrollTop=0;document.body.style.overflow='hidden';burst();}
function closeWish(changeUrl=true){if($('wish-dialog').open)$('wish-dialog').close();document.body.style.overflow='';if(changeUrl){if(history.state?.bouquetModal){history.back();}else{const url=new URL(location.href);url.searchParams.delete('hoa');history.replaceState(null,'',url);}}if(previousFocus?.isConnected)previousFocus.focus();}
$('close-wish').addEventListener('click',()=>closeWish());$('back-garden').addEventListener('click',()=>closeWish());$('wish-dialog').addEventListener('cancel',event=>{event.preventDefault();closeWish();});$('wish-dialog').addEventListener('click',event=>{if(event.target===$('wish-dialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeWish();}});
function search(){const q=normalize($('name-search').value);matches=q?people.filter(p=>q.split(/\s+/).every(word=>normalize(p.name).includes(word))):[];selected=-1;const hasQuery=Boolean(q);$('clear-search').hidden=!hasQuery;$('reset-garden').hidden=!hasQuery;$('empty-garden').hidden=!hasQuery||matches.length>0;$('bouquet-art').classList.toggle('is-searching',hasQuery);people.forEach(p=>{p.button.classList.toggle('is-match',hasQuery&&matches.includes(p));p.button.classList.toggle('is-muted',hasQuery&&!matches.includes(p));});$('result-status').textContent=!hasQuery?'Mỗi lần mở hoa, một lời chúc mới dành cho bạn.':matches.length?`Có ${matches.length} bông hoa khớp tên. Bạn chọn theo ảnh hoặc nhập thêm họ tên nhé.`:'Chưa tìm thấy bông hoa này. Bạn thử tìm lại nhé.';$('name-results').replaceChildren();matches.forEach((p,i)=>{const option=document.createElement('button');option.type='button';option.className='name-result';option.id='result-'+i;option.setAttribute('role','option');option.setAttribute('aria-selected','false');option.innerHTML=`<img src="${p.photo}" alt="Ảnh của ${p.name}"><span><b>Bông hồng số ${p.index+1}</b><small>Chọn theo ảnh để mở lời chúc</small></span><i aria-hidden="true">↗</i>`;option.addEventListener('click',()=>openWish(p));$('name-results').append(option);});$('name-results').hidden=!hasQuery||!matches.length;$('name-search').setAttribute('aria-expanded',String(hasQuery&&matches.length>0));$('name-search').removeAttribute('aria-activedescendant');}
function resetSearch(){$('name-search').value='';search();$('name-search').focus();}
$('name-search').addEventListener('input',search);for(const id of ['clear-search','reset-garden','empty-reset'])$(id).addEventListener('click',resetSearch);
$('name-search').addEventListener('keydown',event=>{if(event.key==='Escape'){$('name-results').hidden=true;$('name-search').setAttribute('aria-expanded','false');}else if((event.key==='ArrowDown'||event.key==='ArrowUp')&&matches.length){event.preventDefault();selected=selected===-1?(event.key==='ArrowDown'?0:matches.length-1):(selected+(event.key==='ArrowDown'?1:-1)+matches.length)%matches.length;$('name-results').hidden=false;$('name-search').setAttribute('aria-expanded','true');Array.from($('name-results').children).forEach((el,i)=>el.setAttribute('aria-selected',String(i===selected)));$('name-search').setAttribute('aria-activedescendant','result-'+selected);$('result-'+selected).scrollIntoView({block:'nearest'});}else if(event.key==='Enter'&&matches.length){event.preventDefault();openWish(matches[Math.max(0,selected)]);}});
document.addEventListener('click',event=>{if(!event.target.closest('.search-panel')){$('name-results').hidden=true;$('name-search').setAttribute('aria-expanded','false');}});$('name-search').addEventListener('focus',()=>{if($('name-search').value)search();});
let toastTimeout;function toast(message,inside=false){const el=$(inside?'wish-toast':'page-toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.hidden=true,4500);}
async function copyLink(person){const url=new URL(location.href);url.search='';if(person)url.searchParams.set('hoa',person.id);try{await navigator.clipboard.writeText(url.href);toast('Đã sao chép đường dẫn. Bạn gửi tặng người thương nhé!',Boolean(person));}catch{$('share-fallback').hidden=false;$('share-url').value=url.href;if(!person){window.prompt('Bạn sao chép đường dẫn bó hoa nhé',url.href);}else{$('share-url').focus();$('share-url').select();}}}
$('share-garden').addEventListener('click',()=>copyLink(null));$('copy-wish').addEventListener('click',()=>copyLink(active));
function updateMotion(){document.body.classList.toggle('no-motion',!motion);$('motion-toggle').setAttribute('aria-pressed',String(motion));$('motion-toggle').innerHTML=`<span aria-hidden="true">✧</span> Hiệu ứng đang ${motion?'bật':'tắt'}`;}
$('motion-toggle').addEventListener('click',()=>{motion=!motion;updateMotion();persist();});updateMotion();
async function saveCard() {
  if (!active) return;
  const button = $('save-wish');
  button.disabled = true;
  try {
    await document.fonts.ready;
    const p = active;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    let ctx = canvas.getContext('2d');
    const blocks = p.greeting.paragraphs.map(text => ({text, font:'25px "Garden Serif", Georgia', color:'#75816a'}));
    blocks.push({text:p.greeting.closing, font:'italic 25px "Garden Serif", Georgia', color:'#9c7f83'});
    let textY = 980;
    const lines = [];
    for (const block of blocks) {
      ctx.font = block.font;
      let line = '';
      for (const word of block.text.split(' ')) {
        const next = line ? line + ' ' + word : word;
        if (ctx.measureText(next).width > 1040 && line) {
          lines.push({...block,text:line,y:textY}); textY += 43; line = word;
        } else line = next;
      }
      if (line) { lines.push({...block,text:line,y:textY}); textY += 43; }
      textY += 20;
    }
    const signY = Math.max(1635, textY + 45);
    canvas.height = signY + 80;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fffaf2'; ctx.fillRect(0,0,1200,canvas.height);
    const img = new Image(); img.src = p.photo; await img.decode();
    ctx.fillStyle = '#e6e8dc'; ctx.fillRect(0,0,1200,620);
    const scale = Math.min(1200/img.naturalWidth,620/img.naturalHeight);
    const width = img.naturalWidth*scale, height = img.naturalHeight*scale;
    ctx.drawImage(img,(1200-width)/2,(620-height)/2,width,height);
    ctx.fillStyle = '#a5807f'; ctx.font = '28px "Garden Serif", Georgia';
    ctx.fillText('20.10 · HAPPY WOMEN’S DAY',80,690);
    ctx.fillStyle = '#526d56'; ctx.font = '36px "Garden Serif", Georgia'; ctx.fillText(p.name,80,755);
    ctx.font = '46px "Garden Serif", Georgia'; ctx.fillText('Một ngày thật đẹp,',80,840);
    ctx.fillStyle = palette[p.index%4][1]; ctx.font = 'italic 46px "Garden Serif", Georgia'; ctx.fillText('dành riêng cho bạn.',80,905);
    for (const line of lines) { ctx.font = line.font; ctx.fillStyle = line.color; ctx.fillText(line.text,80,line.y); }
    ctx.fillStyle = '#7f9276'; ctx.font = 'italic 25px "Garden Serif", Georgia';
    ctx.fillText('Thân mến, từ những người đồng nghiệp.',80,signY);
    const blob = await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    if (!blob) throw new Error('Không thể lưu ảnh');
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href=url; a.download=`loi-chuc-20-10-${p.id}.png`; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),10000);
    toast('Tấm thiệp đã sẵn sàng để lưu.',true);
  } catch { toast('Chưa lưu được thiệp. Bạn thử lại nhé.',true); }
  finally { button.disabled=false; }
}

$('save-wish').addEventListener('click',saveCard);window.addEventListener('popstate',()=>{const p=people.find(p=>p.id===new URL(location.href).searchParams.get('hoa'));if(p)openWish(p,false);else closeWish(false);});
const linked=people.find(p=>p.id===new URL(location.href).searchParams.get('hoa'));if(linked)openWish(linked,false);
