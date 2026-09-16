(() => {
  const stage = document.querySelector('.project-stage');
  if (stage) {
    const projects = [
      {title:'Wriothesley',category:'独立设计与开发',type:'DESKTOP APPLICATION',image:'./images/previews/Wriothesley.webp',alt:'Wriothesley桌面助手真实界面',href:'./pages/about4.html',description:'Electron / AI任务指令 / 原生OCR / 云同步'},
      {title:'AI素材工作台',category:'部门产品与运营团队使用',type:'PRODUCT WORKFLOW',image:null,href:'./pages/about4.html#asset-workbench',description:'独立开发 / AI素材编辑与导出 / 制作效率提升2—5倍'},
      {title:'城市交通数据研究',category:'千万级数据分析与可视化',type:'DATA RESEARCH',image:'./images/previews/data1.webp',alt:'城市交通数据研究可视化作品',href:'./pages/about3.html',description:'Python / SQL / 用户行为分析 / 空间数据'}
    ];
    const image = document.getElementById('stage-image');
    stage.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
      const project = projects[Number(button.dataset.project)];
      stage.querySelectorAll('[data-project]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
      for (const field of ['title','category','type','description']) document.getElementById('stage-'+field).textContent=project[field];
      document.getElementById('stage-link').href=project.href;
      image.hidden=!project.image;document.getElementById('stage-summary').hidden=!!project.image;
      if(project.image){image.src=project.image;image.alt=project.alt;}
    }));
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    stage.addEventListener('pointermove',event=>{
      if(motion.matches || event.pointerType!=='mouse')return;
      const rect=stage.getBoundingClientRect();
      stage.style.setProperty('--ry',((event.clientX-rect.left)/rect.width-.5)*7+'deg');
      stage.style.setProperty('--rx',-((event.clientY-rect.top)/rect.height-.5)*5+'deg');
    });
    stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--rx','0deg');stage.style.setProperty('--ry','0deg');});
  }
  const header=document.querySelector('.content .page-header');
  const headings=[...document.querySelectorAll('.content .section-title')];
  if(header && headings.length>2){
    const nav=document.createElement('nav');nav.className='section-index';nav.setAttribute('aria-label','本页目录');
    headings.forEach((heading,index)=>{
      const section=heading.closest('section');if(!section)return;
      if(!section.id)section.id='section-'+(index+1);
      const link=document.createElement('a');link.href='#'+section.id;
      link.textContent=heading.textContent.trim().replace('（Wriothesley）','').replace('城市公共交通智能出行系统（Mobility Agents）','智能出行系统');
      nav.append(link);
    });header.after(nav);
  }
})();
