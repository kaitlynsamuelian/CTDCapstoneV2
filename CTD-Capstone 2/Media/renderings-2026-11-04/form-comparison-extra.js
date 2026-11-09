const IMGS = ['leaf','tree','forest'];
const STATE = N>=6 ? 2 : N>=3 ? 1 : 0;
function texOf(c){ const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t; }
const darkFrame = new THREE.MeshStandardMaterial({color:'#18181b', roughness:0.6});

if(FORM==='prism'){
  const cols=20, w=DW/cols, r=w/Math.sqrt(3); // side length = w
  const texs = IMGS.map(k=>texOf(drawImage(k)));
  const back = new THREE.Mesh(new THREE.BoxGeometry(DW+0.14, DH+0.14, 0.06), darkFrame);
  back.position.set(0,DY,-0.27); scene.add(back);
  for(let i=0;i<cols;i++){
    const g = new THREE.Group();
    for(let f=0;f<3;f++){
      const pg = new THREE.PlaneGeometry(w*0.985, DH);
      const uv=pg.attributes.uv; for(let j=0;j<uv.count;j++) uv.setX(j,(i+uv.getX(j))/cols);
      const m = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({map:texs[f], roughness:0.5}));
      const a = f*2*Math.PI/3; const ap = w/(2*Math.sqrt(3)); // apothem
      m.position.set(Math.sin(a)*ap, 0, Math.cos(a)*ap); m.rotation.y = a; m.castShadow=true; g.add(m);
    }
    g.rotation.y = -STATE*2*Math.PI/3;
    g.position.set(-DW/2 + w*(i+0.5), DY, -0.17); scene.add(g);
  }
  [DH/2+0.05, -DH/2-0.05].forEach(y=>{const b=new THREE.Mesh(new THREE.BoxGeometry(DW+0.14,0.08,0.22),darkFrame); b.position.set(0,DY+y,-0.17); b.castShadow=true; scene.add(b);});
}
if(FORM==='scroll'){
  const t = texOf(drawImage(IMGS[STATE]));
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(DW, DH), new THREE.MeshStandardMaterial({map:t, roughness:0.85}));
  banner.position.set(0,DY,-0.18); banner.receiveShadow=true; scene.add(banner);
  const rollMat = new THREE.MeshStandardMaterial({color:'#e8dfcc', roughness:0.8});
  [DH/2+0.08, -DH/2-0.08].forEach(y=>{
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,DW,32), rollMat);
    roll.rotation.z = Math.PI/2; roll.position.set(0,DY+y,-0.18); roll.castShadow=true; scene.add(roll);
    [-1,1].forEach(s=>{const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,0.06,32), darkFrame); cap.rotation.z=Math.PI/2; cap.position.set(s*(DW/2+0.03),DY+y,-0.18); scene.add(cap);});
  });
  const motor = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,0.14), darkFrame); motor.position.set(DW/2+0.12, DY+DH/2+0.08, -0.18); scene.add(motor);
}
if(FORM==='tiles'){
  const cols=40, rows=25, tw=DW/cols, th=DH/rows;
  const c = drawImage(IMGS[STATE], cols, rows); const d=c.getContext('2d').getImageData(0,0,cols,rows).data;
  const frame = new THREE.Mesh(new THREE.BoxGeometry(DW+0.16, DH+0.16, 0.08), new THREE.MeshStandardMaterial({color:'#5a4330', roughness:0.8}));
  frame.position.set(0,DY,-0.27); scene.add(frame);
  const wood = new THREE.MeshStandardMaterial({color:'#d7b98d', roughness:0.75});
  const geo = new THREE.BoxGeometry(tw*0.92, th*0.92, 0.012);
  for(let r=0;r<rows;r++) for(let q=0;q<cols;q++){
    const k=(r*cols+q)*4; const lum=(0.3*d[k]+0.59*d[k+1]+0.11*d[k+2])/255;
    const m = new THREE.Mesh(geo, wood);
    m.position.set(-DW/2+tw*(q+0.5), DY+DH/2-th*(r+0.5), -0.2);
    m.rotation.x = -0.35 + (1-lum)*2.2;  // bright tiles face the light above, dark tiles tilt away
    m.castShadow=true; m.receiveShadow=true; scene.add(m);
  }
  const top = new THREE.DirectionalLight('#fff3e0', 3.2); top.position.set(0.3,6,1.2); top.target.position.set(0,DY,0); scene.add(top, top.target);
}
if(FORM==='shadow'){
  // drawn silhouettes on a glowing paper screen, as cast by cutouts lit from behind
  const c = drawImage(IMGS[STATE]); const g=c.getContext('2d'); const id=g.getImageData(0,0,c.width,c.height); const p=id.data;
  for(let i=0;i<p.length;i+=4){ const bg = Math.abs(p[i]-239)<6 && Math.abs(p[i+1]-230)<6; const gr = Math.abs(p[i]-217)<6&&Math.abs(p[i+1]-201)<6;
    if(bg){p[i]=246;p[i+1]=214;p[i+2]=160;} else if(gr){p[i]=120;p[i+1]=80;p[i+2]=50;} else {p[i]=48;p[i+1]=32;p[i+2]=24;} }
  g.putImageData(id,0,0);
  const depth=0.45, t=0.07, wood=new THREE.MeshStandardMaterial({color:'#2b211b', roughness:0.8});
  [[0,DH/2+t/2,DW+2*t,t],[0,-DH/2-t/2,DW+2*t,t],[-DW/2-t/2,0,t,DH],[DW/2+t/2,0,t,DH]].forEach(([x,y,w,h])=>{
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,depth),wood); b.position.set(x,DY+y,-0.3+depth/2); b.castShadow=true; scene.add(b);});
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(DW,DH), new THREE.MeshBasicMaterial({map:texOf(c)}));
  screen.position.set(0,DY,-0.3+depth-0.02); scene.add(screen);
  const glow=new THREE.PointLight('#ffb86b', 6, 4); glow.position.set(0,DY,0.8); scene.add(glow);
}
