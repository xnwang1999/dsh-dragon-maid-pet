const React = require('react');
const h = React.createElement;
const NS = 'dragonMaidPet';
const EN = {
  title:'Dragon Maid', title_claude:'Claude Maid', title_deepseek:'DeepSeek Maid', character:'Character', characterAuto:'Automatic by model', characterDragon:'Dragon Maid', characterClaude:'Claude Maid', characterDeepseek:'DeepSeek Maid', characterHelp:'Automatic shows the Claude maid for claude models, the DeepSeek maid for deepseek models, and the dragon maid otherwise.', collapse:'Collapse pet', summon:'Summon dragon maid',
  drag:'Drag the figure to move; arrow keys also move', following:'Following', waiting:'Waiting for a session',
  default:'Default effort', otherModel:'Resting · not a followed model', preview:'Preview',
  low:'Sleepy hatchling', medium:'Apprentice maid', high:'Graceful maid', xhigh:'Starlight maid', max:'Divine dragon maid',
  follow:'Follow the current model', size:'Pet width', previewHelp:'Pick a form to show it permanently, or follow the reasoning effort of the current session.',
  tip:'Change the reasoning effort in the model menu to evolve me.', greeting:'Mmm… I am here with you.',
  artError:'Character image could not load',
  maidName:'Maid name', maidNamePlaceholder:'Leave empty for the default name', appearance:'Displayed form',
  followModels:'Followed models', followModelsHelp:'Wildcard patterns separated by commas, e.g. gpt*, o3*, claude-*, provider/model. The maid evolves only while one of these models is selected.',
  illustrations:'Custom illustrations',
  illustrationsHelp:'Replace the artwork of each form with an uploaded image or an image URL. Transparent PNG/WebP works best.',
  upload:'Upload', resetArt:'Reset', urlPlaceholder:'Image URL', uploaded:'Uploaded image',
  uploadLimit:'Images are scaled down to at most 1024 px and about 1 MB; GIF, PNG, JPEG and WebP are accepted.',
  badImage:'That is not a usable image.',
  visible:'Show the maid in the conversation', showCaption:'Show the name and form caption', divineGlow:'Divine radiance animation on the max form',
  settingsSummary:'Appearance and behaviour of the dragon maid. Changes apply to this profile after saving.',
  loading:'Loading settings…', retry:'Retry', save:'Save', saving:'Saving…', saved:'Saved.', saveFailed:'Could not save:', reload:'Discard changes',
  positionHelp:'Position: drag the figure itself in the conversation; the − button below it collapses the maid into a small capsule.',
};
const ZH = {
  title:'龙女仆', title_claude:'Claude 女仆', title_deepseek:'DeepSeek 女仆', character:'形象', characterAuto:'按模型自动', characterDragon:'龙女仆', characterClaude:'Claude 女仆', characterDeepseek:'DeepSeek 女仆', characterHelp:'自动：claude 模型显示 Claude 女仆，deepseek 模型显示 DeepSeek 女仆，其余显示龙女仆。', collapse:'收起桌宠', summon:'召唤龙女仆',
  drag:'拖动形象移动，也可用方向键调整位置', following:'跟随模型', waiting:'等待会话',
  default:'默认档位', otherModel:'待机 · 非跟随模型', preview:'预览',
  low:'迷糊幼龙', medium:'见习女仆', high:'优雅女仆', xhigh:'星辉女仆', max:'神辉龙姬',
  follow:'跟随当前模型', size:'桌宠宽度', previewHelp:'选择一个形态可固定显示，或跟随当前会话的推理档位。',
  tip:'在模型菜单切换推理档位，我就会变化。', greeting:'唔……我会陪着你。',
  artError:'角色图像加载失败',
  maidName:'女仆名字', maidNamePlaceholder:'留空使用默认名字', appearance:'显示形态',
  followModels:'跟随模型', followModelsHelp:'用逗号分隔的通配规则，如 gpt*、o3*、claude-*、供应商/模型。仅在当前选择了这些模型时才会随档位进化。',
  illustrations:'自定义插画',
  illustrationsHelp:'可用上传的图片或图片链接替换每个形态的立绘，推荐透明背景的 PNG/WebP。',
  upload:'上传', resetArt:'还原', urlPlaceholder:'图片链接', uploaded:'已上传图片',
  uploadLimit:'图片会自动缩小到最长边 1024 px、约 1 MB 以内；支持 GIF、PNG、JPEG、WebP。',
  badImage:'该文件不是可用的图片。',
  visible:'在对话中显示龙女仆', showCaption:'显示名字与形态说明', divineGlow:'最高档神性光辉动画',
  settingsSummary:'龙女仆的外观与行为设置，保存后对当前配置档生效。',
  loading:'正在加载设置…', retry:'重试', save:'保存', saving:'保存中…', saved:'已保存。', saveFailed:'保存失败：', reload:'放弃修改',
  positionHelp:'位置：在对话中直接拖动形象；形象下方的 − 按钮可收起为小胶囊。',
};const CSS = `
.dragon-maid-root{position:fixed;z-index:35;width:var(--maid-width,220px);pointer-events:auto;color:var(--dsw-alias-label-primary);font:inherit;user-select:none;isolation:isolate}
.dragon-maid-root button,.dragon-maid-root input[type=text],.dragon-maid-root textarea{font:inherit;color:inherit}
.dragon-maid-root button{cursor:pointer;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:8px;padding:4px 8px;font-size:12px;line-height:20px}
.dragon-maid-root button:hover{background:var(--dsw-alias-bg-layer-2)}
.dragon-maid-root button:focus-visible,.dragon-maid-root input:focus-visible,.dragon-maid-root textarea:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:3px}
.dragon-maid-root button[aria-pressed=true]{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}
.dragon-maid-root .dragon-maid-art-button{width:100%;padding:0;border:0;background:transparent;display:block;position:relative;cursor:grab;touch-action:none;border-radius:12px}
.dragon-maid-root .dragon-maid-art-button:hover{background:transparent}
.dragon-maid-root .dragon-maid-art-button:active{cursor:grabbing}
.dragon-maid-art{display:block;width:100%;height:auto;max-height:calc(var(--maid-width,220px)*1.25);object-fit:contain;object-position:center bottom;pointer-events:none;-webkit-user-drag:none;image-rendering:auto;filter:drop-shadow(0 6px 10px #66508122);animation:dragon-maid-arrive .4s ease both}
.dragon-maid-float{display:block;animation:dragon-maid-breathe 4.5s ease-in-out infinite;transform-origin:bottom center}
.dragon-maid-root[data-running=true] .dragon-maid-float{animation-duration:2.5s}
.dragon-maid-root[data-divine=true] .dragon-maid-float{animation:dragon-maid-breathe 4.5s ease-in-out infinite,dragon-maid-divine 3.4s ease-in-out infinite}
.dragon-maid-caption{width:max-content;max-width:100%;margin:1px auto 0;padding:5px 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);font-size:11px;text-align:center;line-height:17px;box-sizing:border-box}
.dragon-maid-stage{font-size:12px;font-weight:600;display:block}.dragon-maid-mode{display:block;color:var(--dsw-alias-label-secondary)}
.dragon-maid-stars{display:block;letter-spacing:3px;color:var(--dsw-alias-brand-primary);font-size:10px;line-height:13px}
.dragon-maid-actions{display:flex;justify-content:center;gap:6px;margin-top:5px}
.dragon-maid-root .dragon-maid-control{padding:2px 9px;min-width:30px;line-height:18px}
.dragon-maid-panel{position:absolute;width:300px;max-width:calc(100vw - 16px);overflow:auto;box-sizing:border-box;padding:12px;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-overlay);font-size:12px;line-height:19px;box-shadow:0 8px 30px #00000024;user-select:text;cursor:default}
.dragon-maid-panel-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-weight:600}
.dragon-maid-section{margin-top:12px;padding-top:10px;border-top:1px solid var(--dsw-alias-border-l1)}
.dragon-maid-section>b{display:block;font-weight:600;margin-bottom:4px}
.dragon-maid-choices{display:flex;gap:5px;flex-wrap:wrap;margin:8px 0 0}
.dragon-maid-panel p{color:var(--dsw-alias-label-secondary);margin:6px 0 0;font-size:11px;line-height:16px}
.dragon-maid-panel input[type=text],.dragon-maid-panel textarea{width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:8px;padding:4px 8px;font-size:12px;line-height:20px;resize:vertical}
.dragon-maid-size{display:flex;align-items:center;gap:10px}.dragon-maid-size input{flex:1;min-width:0;accent-color:var(--dsw-alias-brand-primary)}
.dragon-maid-check{display:flex;align-items:center;gap:8px;margin-top:10px}.dragon-maid-check input{accent-color:var(--dsw-alias-brand-primary)}
.dragon-maid-row{display:flex;gap:6px;margin-top:6px;align-items:center}
.dragon-maid-art-row{display:grid;grid-template-columns:34px 1fr auto auto;gap:6px;align-items:center;margin-top:7px}
.dragon-maid-art-row img{width:34px;height:34px;object-fit:contain;border-radius:6px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1)}
.dragon-maid-art-row[data-custom=true] img{border-color:var(--dsw-alias-brand-primary)}
.dragon-maid-art-row label{position:relative}
.dragon-maid-notice{color:var(--dsw-alias-brand-primary);font-size:11px;margin-top:6px}
.dragon-maid-speech{position:absolute;bottom:100%;right:0;width:max-content;max-width:210px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:12px;padding:9px 12px;font-size:12px;line-height:18px;box-sizing:border-box;pointer-events:none}
.dragon-maid-collapsed{width:max-content!important;max-width:190px;display:flex;gap:5px;align-items:center}
.dragon-maid-root .dragon-maid-summon{cursor:grab;touch-action:none}
.dragon-maid-error{display:block;padding:25px 10px;color:var(--dsw-alias-label-secondary);font-size:12px}
@keyframes dragon-maid-breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes dragon-maid-divine{0%,100%{filter:drop-shadow(0 0 7px #ffd98055) drop-shadow(0 0 18px #ffe9b033) brightness(1)}50%{filter:drop-shadow(0 0 13px #ffd980aa) drop-shadow(0 0 30px #ffe9b066) brightness(1.06)}}
@keyframes dragon-maid-arrive{from{opacity:0;transform:translateY(7px) scale(.97)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.dragon-maid-art,.dragon-maid-float{animation:none!important}}
`;
const KEY = 'dragon-maid-pet.view.v1';
const MAX_UPLOAD_SIDE = 1024;
const MAX_ILLUSTRATION_CHARS = 1100000;
// Only the pet's position and collapsed state live in this browser; everything else is Host Config.
function readView() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { right:Number.isFinite(value.right)?value.right:24,
      bottom:Number.isFinite(value.bottom)?value.bottom:174, collapsed:value.collapsed===true };
  } catch { return {right:24,bottom:174,collapsed:false}; }
}
function petWidth(width) { return window.innerWidth < 720 ? Math.min(width,170) : width; }
function clampView(value,configuredWidth=220,edges) {
  // The visible outline (not the transparent canvas) may touch the left/right screen edges but never leave them.
  const width = value.collapsed ? 120 : petWidth(configuredWidth);
  const height = value.collapsed ? 42 : width+90;
  const left = value.collapsed||!edges ? 0 : edges.left*width, right = value.collapsed||!edges ? 0 : edges.right*width;
  return {...value,
    right:Math.max(-right,Math.min(value.right,window.innerWidth-width+left)),
    bottom:Math.max(0,Math.min(value.bottom,window.innerHeight-height*0.85))};
}
// Fractions of the image width that are transparent on the left/right of the opaque figure.
const edgeCache = new Map();
function measureEdges(src) {
  if (edgeCache.has(src)) return edgeCache.get(src);
  const task = new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      try {
        const side = 256, canvas = document.createElement('canvas');
        canvas.width = side; canvas.height = Math.max(1,Math.round(side*image.naturalHeight/image.naturalWidth));
        const context = canvas.getContext('2d', {willReadFrequently:true});
        context.drawImage(image,0,0,canvas.width,canvas.height);
        const data = context.getImageData(0,0,canvas.width,canvas.height).data;
        let min = canvas.width, max = -1;
        for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
          if (data[(y*canvas.width+x)*4+3] > 140) { if (x < min) min = x; if (x > max) max = x; }
        }
        resolve(max < 0 ? {left:0,right:0} : {left:min/canvas.width,right:(canvas.width-1-max)/canvas.width});
      } catch { resolve({left:0,right:0}); }
    };
    image.onerror = () => resolve({left:0,right:0});
    image.src = src;
  });
  edgeCache.set(src,task);
  return task;
}// Downscale uploads so the Host profile stays small; keeps transparency (WebP, PNG fallback).
async function fileToIllustration(file) {
  if (!file || !/^image\//i.test(file.type) || file.size > 25*1024*1024) throw new Error('bad-image');
  let bitmap;
  try { bitmap = await createImageBitmap(file); } catch { throw new Error('bad-image'); }
  try {
    let side = Math.min(MAX_UPLOAD_SIDE, Math.max(bitmap.width,bitmap.height));
    for (let attempt = 0; attempt < 5; attempt++, side = Math.round(side*0.8)) {
      const scale = Math.min(1, side/Math.max(bitmap.width,bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1,Math.round(bitmap.width*scale)); canvas.height = Math.max(1,Math.round(bitmap.height*scale));
      const context = canvas.getContext('2d');
      context.imageSmoothingQuality = 'high';
      context.drawImage(bitmap,0,0,canvas.width,canvas.height);
      for (const quality of [0.92,0.8,0.65]) {
        const url = canvas.toDataURL('image/webp',quality);
        if (url.startsWith('data:image/webp') && url.length <= MAX_ILLUSTRATION_CHARS) return url;
      }
      const png = canvas.toDataURL('image/png');
      if (png.length <= MAX_ILLUSTRATION_CHARS) return png;
    }
    throw new Error('too-large');
  } finally { bitmap.close?.(); }
}const emptySource = {getSnapshot:()=>undefined, subscribe:()=>()=>{}};
function useSource(source) {
  const subscribe=React.useCallback(fn=>source.subscribe(fn),[source]);
  const snapshot=React.useCallback(()=>source.getSnapshot(),[source]);
  return React.useSyncExternalStore(subscribe,snapshot,snapshot);
}
function useTranslate(locale) {
  useSource(locale);
  return locale.bind(NS);
}
// Read-only diagnostics: writes happen only in this plugin's committed React lifecycle.
// Inspect queries return a detached JSON snapshot and never run UI actions.
const PET_DIAGNOSTIC_HISTORY_LIMIT = 40;
function createPetDiagnostics() {
  let owner = null;
  let disposed = false;
  let state = {
    mounted:false, sessionId:null, model:null, effort:null, mode:null, stage:null,
    selection:null,selectionSource:'unavailable',expectedStage:null,followingStage:null,renderedStage:null,imageStage:null,
    collapsed:false, imageLoaded:false, imageError:false, imageKind:null,imageMime:null,
    naturalWidth:0, naturalHeight:0, rect:null, imageRect:null,
    inViewport:false, pageVisible:false, observedAt:null, mountedAt:null,
  };
  const stageHistory = [];
  let historyOmitted = 0;
  return {
    mount(token) {
      if (disposed) return;
      owner = token;
      state = {...state,mounted:true,mountedAt:new Date().toISOString()};
    },
    record(token, observation) {
      if (disposed || owner !== token) return;
      state = {...state,...observation,mounted:true};
      // This is image-load + own-layout evidence, not an occlusion/screenshot claim.
      if (!state.collapsed && state.imageLoaded && state.inViewport && state.pageVisible && state.renderedStage===state.stage && state.imageStage===state.stage) {
        const previous = stageHistory[stageHistory.length-1];
        const entry = {
          sessionId:state.sessionId,model:state.model,effort:state.effort,
          mode:state.mode,stage:state.stage,imageKind:state.imageKind,imageMime:state.imageMime,
          naturalWidth:state.naturalWidth,naturalHeight:state.naturalHeight,shownAt:state.observedAt,
        };
        if (!previous || ['sessionId','model','effort','mode','stage','imageKind','imageMime'].some(key=>previous[key]!==entry[key])) {
          stageHistory.push(entry);
          if (stageHistory.length > PET_DIAGNOSTIC_HISTORY_LIMIT) { stageHistory.shift(); historyOmitted += 1; }
        }
      }
    },
    unmount(token) {
      if (owner !== token) return;
      owner = null;
      state = {...state,mounted:false,imageLoaded:false,naturalWidth:0,naturalHeight:0,rect:null,imageRect:null,inViewport:false,observedAt:new Date().toISOString()};
    },
    readState() {
      return JSON.parse(JSON.stringify({...state,stageHistory,historyOmitted,
        evidence:'Committed component state, own image load and own layout only; not a screenshot or occlusion check.'}));
    },
    dispose() { disposed = true; owner = null; state = {...state,mounted:false,imageLoaded:false,rect:null,imageRect:null}; },
  };
}
function petOwnRect(element) {
  if (!element || !element.isConnected) return null;
  const box = element.getBoundingClientRect();
  const result = {};
  for (const key of ['x','y','top','right','bottom','left','width','height']) result[key] = Number.isFinite(box[key]) ? Math.round(box[key]*100)/100 : null;
  return result;
}
function observePet(diagnostics,token,details,root,image) {
  const rect = petOwnRect(root);
  const imageRect = petOwnRect(image);
  const imageLoaded = !details.collapsed && !details.imageError && image?.isConnected === true && image.complete === true && image.naturalWidth > 0 && image.naturalHeight > 0;
  diagnostics.record(token,{...details,rect,imageRect,imageLoaded,
    renderedStage:root?.dataset.stage??null,imageStage:image?.dataset.stage??null,
    imageMime:/^data:([^;,]+)(?:;|,)/i.exec(image?.currentSrc||image?.src||'')?.[1]??null,
    naturalWidth:imageLoaded?image.naturalWidth:0,naturalHeight:imageLoaded?image.naturalHeight:0,
    inViewport:!!rect && rect.width>0 && rect.height>0 && rect.bottom>0 && rect.right>0 && rect.top<window.innerHeight && rect.left<window.innerWidth,
    pageVisible:document.visibilityState==='visible',observedAt:new Date().toISOString(),
  });
}
function petInspectProvider(diagnostics) {
  return {
    manifest:{
      id:'DragonMaidPet',
      description:'Read-only diagnostics for this page’s dragon-maid companion: committed mount state, current session/effort, own image loading and layout, and bounded displayed-stage history.',
      methods:[{
        name:'readState',
        description:'Read the actual committed dragon-maid state and the last 40 image-loaded, in-viewport stage transitions. Does not change the model, preview, position or any runtime setting; does not establish pixel-level appearance or occlusion.',
        inputSchema:{type:'object',properties:{},additionalProperties:false},
        outputSchema:{type:'object',description:'Page-local mount/session/model/effort/mode/stage, imageLoaded and natural dimensions, own bounding rectangles observed at observedAt, and bounded stageHistory with historyOmitted.'},
      }],
    },
    query(method,input) {
      if (method!=='readState') throw new Error(`Unknown DragonMaidPet inspect method: ${method}`);
      if (input!==undefined && input!==null && (typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==0)) throw new Error('DragonMaidPet.readState accepts only an empty input object.');
      return Promise.resolve(diagnostics.readState());
    },
  };
}
// Native Plugin Manager form. Uses the Host settings entry point, not browser-only config.
function createSettingsStore(ctx) {
  let snapshot={settings:normalizeSettings(),ns:null,revision:null,error:null,loaded:false};
  let alive=true, pending=null;
  const listeners=new Set();
  const publish=patch=>{if(!alive)return;snapshot={...snapshot,...patch};for(const fn of listeners)fn();};
  const accept=row=>publish({settings:normalizeSettings(row.value),ns:row.ns,revision:row.revision,error:null,loaded:true});
  return {
    status:()=>({loaded:snapshot.loaded,ns:snapshot.ns,revision:snapshot.revision,error:snapshot.error}),
    getSnapshot:()=>snapshot,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},
    refresh() {
      if(pending)return pending;
      pending=(async()=>{
        try {
          const result=await ctx.remote.settings.describe();
          if(!result.ok)throw new Error(result.error.message||result.error.code);
          const row=result.value.namespaces.find(row=>row.ns==='include:dragon-maid-pet'||row.ns==='dragon-maid-pet'||String(row.ns).split(':').pop()==='dragon-maid-pet');
          if(!row)throw new Error('Dragon Maid settings namespace is not mounted.');
          accept(row);
        } catch(error) {publish({error:String(error.message||error),loaded:true});}
        finally {pending=null;}
      })();
      return pending;
    },
    async save(values, expectedRevision) {
      if(!snapshot.ns)throw new Error('Settings are unavailable.');
      const result=await ctx.remote.settings.update(snapshot.ns,values,expectedRevision);
      if(!result.ok)throw new Error(result.error.message||result.error.code);
      accept(result.value);
    },
    dispose(){alive=false;listeners.clear();},
  };
}
function SettingsForm({ctx,store,view}) {
  const t=useTranslate(ctx.locale), state=useSource(store);
  const [draft,setDraft]=React.useState(null),[revision,setRevision]=React.useState(null);
  const [models,setModels]=React.useState(''),[busy,setBusy]=React.useState(false),[notice,setNotice]=React.useState(''),[failed,setFailed]=React.useState(false);
  const alive=React.useRef(true), uploadSeq=React.useRef({});
  React.useEffect(()=>{alive.current=true;store.refresh();return()=>{alive.current=false;};},[store]);
  React.useEffect(()=>{
    if(!draft&&state.ns){setDraft(state.settings);setRevision(state.revision);setModels(state.settings.followModels.join(', '));}
  },[draft,state.ns,state.settings,state.revision]);
  if(view==='summary')return t('settingsSummary');
  const patch=value=>{setDraft(current=>({...current,...value}));setNotice('');};
  const setArt=(stage,value)=>setDraft(current=>({...current,illustrations:{...current.illustrations,[stage]:value}}));
  const upload=async(stage,file)=>{
    if(!file)return;
    const seq=(uploadSeq.current[stage]||0)+1;uploadSeq.current[stage]=seq;
    try {
      const data=await fileToIllustration(file);
      if(alive.current&&uploadSeq.current[stage]===seq){setArt(stage,data);setNotice('');setFailed(false);}
    }catch(error){if(alive.current){setNotice(error.message==='too-large'?t('uploadLimit'):error.message==='bad-image'?t('badImage'):String(error.message||error));setFailed(true);}}
  };
  const save=async e=>{
    e.preventDefault();if(!draft||busy)return;
    setBusy(true);setNotice('');setFailed(false);
    try {
      for(const stage of STAGES)if(draft.illustrations[stage]?.trim()&&!safeIllustration(draft.illustrations[stage]))throw new Error(`${stage}: ${t('badImage')}`);
      const values=normalizeSettings({...draft,followModels:splitPatterns(models)});
      await store.save(values,revision);
      if(alive.current){setDraft(values);setRevision(store.getSnapshot().revision);setNotice(t('saved'));}
    }catch(error){if(alive.current){setFailed(true);setNotice(`${t('saveFailed')} ${error.message||error}`);}}
    finally{if(alive.current)setBusy(false);}
  };
  const row=(label,control,help)=>h('label',{className:'dragon-maid-setting-row'},h('span',{className:'dragon-maid-setting-label'},label),control,help?h('small',null,help):null);
  const check=key=>row(t(key),h('input',{type:'checkbox',checked:draft[key],disabled:busy,onChange:e=>patch({[key]:e.target.checked})}));
  if(!draft)return h('div',{className:'dragon-maid-settings'},h('style',null,SETTINGS_CSS),h('p',{role:state.error?'alert':'status'},state.error||t('loading')),h('button',{type:'button',onClick:()=>store.refresh()},t('retry')));
  return h('form',{className:'dragon-maid-settings',onSubmit:save},h('style',null,SETTINGS_CSS),
    h('p',null,t('settingsSummary')),
    row(t('maidName'),h('input',{type:'text',maxLength:80,value:draft.name,placeholder:t('maidNamePlaceholder'),disabled:busy,onChange:e=>patch({name:e.target.value})})),
    row(t('followModels'),h('textarea',{rows:3,value:models,spellCheck:false,disabled:busy,onChange:e=>{setModels(e.target.value);setNotice('');}}),t('followModelsHelp')),
    row(t('character'),h('select',{value:draft.character,disabled:busy,onChange:e=>patch({character:e.target.value})},h('option',{value:'auto'},t('characterAuto')),h('option',{value:'dragon'},t('characterDragon')),h('option',{value:'claude'},t('characterClaude')),h('option',{value:'deepseek'},t('characterDeepseek'))),t('characterHelp')),
    row(t('appearance'),h('select',{value:draft.stage,disabled:busy,onChange:e=>patch({stage:e.target.value})},h('option',{value:'auto'},t('follow')),...STAGES.map(stage=>h('option',{key:stage,value:stage},`${stage} · ${t(stage)}`))),t('previewHelp')),
    row(`${t('size')} · ${draft.width}px`,h('input',{type:'range',min:140,max:420,step:10,value:draft.width,disabled:busy,onChange:e=>patch({width:Number(e.target.value)})})),
    check('visible'),check('showCaption'),check('divineGlow'),
    h('fieldset',null,h('legend',null,t('illustrations')),h('p',null,t('illustrationsHelp')),
      ...STAGES.map(stage=>{const uri=draft.illustrations[stage]||'';return h('div',{className:'dragon-maid-image-setting',key:stage},
        h('strong',null,`${stage} · ${t(stage)}`),
        h('img',{src:safeIllustration(uri)||EMBEDDED_IMAGES[draft.character==="auto"?"dragon":draft.character]?.[stage],alt:t(stage),draggable:false}),
        h('input',{'aria-label':`${stage} ${t('urlPlaceholder')}`,type:'text',value:uri.startsWith('data:')?'':uri,placeholder:uri.startsWith('data:')?t('uploaded'):t('urlPlaceholder'),disabled:busy,onChange:e=>{uploadSeq.current[stage]=(uploadSeq.current[stage]||0)+1;setArt(stage,e.target.value);}}),
        h('label',{className:'dragon-maid-upload'},t('upload'),h('input',{type:'file',accept:'image/png,image/jpeg,image/webp,image/gif',disabled:busy,onChange:e=>{const file=e.target.files?.[0];e.target.value='';upload(stage,file);}})),
        h('button',{type:'button',disabled:busy||!uri,onClick:()=>{uploadSeq.current[stage]=(uploadSeq.current[stage]||0)+1;setArt(stage,'');}},t('resetArt')));}),
      h('small',null,t('uploadLimit'))),
    h('div',{className:'dragon-maid-save-row'},h('button',{type:'submit',disabled:busy},t(busy?'saving':'save')),
      h('button',{type:'button',disabled:busy,onClick:async()=>{setDraft(null);await store.refresh();}},t('reload'))),
    notice?h('p',{role:failed?'alert':'status','data-error':failed},notice):null,
    h('small',null,t('positionHelp')));
}
const SETTINGS_CSS=`
.dragon-maid-settings{max-width:720px;color:var(--dsw-alias-label-primary);font:inherit;font-size:14px;line-height:1.6}
.dragon-maid-settings p,.dragon-maid-settings small{color:var(--dsw-alias-label-secondary)}
.dragon-maid-setting-row{display:grid;grid-template-columns:minmax(130px,1fr) minmax(140px,2fr);align-items:center;gap:8px 20px;padding:16px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dragon-maid-setting-row small{grid-column:1/-1}.dragon-maid-setting-label{font-weight:500}
.dragon-maid-settings input,.dragon-maid-settings textarea,.dragon-maid-settings select,.dragon-maid-settings button{font:inherit;color:inherit;accent-color:var(--dsw-alias-brand-primary)}
.dragon-maid-settings input[type=text],.dragon-maid-settings textarea,.dragon-maid-settings select{box-sizing:border-box;min-width:0;width:100%;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px 10px}
.dragon-maid-settings input[type=checkbox]{justify-self:start;width:18px;height:18px}
.dragon-maid-settings button{padding:7px 14px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;cursor:pointer}
.dragon-maid-settings button:hover{background:var(--dsw-alias-bg-layer-2)}.dragon-maid-settings button:disabled{opacity:.5;cursor:default}
.dragon-maid-settings :focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dragon-maid-settings fieldset{margin:24px 0 16px;padding:0;border:0}.dragon-maid-settings legend{font-size:16px;font-weight:600}
.dragon-maid-image-setting{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:8px 12px;padding:16px 0;border-bottom:1px solid var(--dsw-alias-border-l1);align-items:center}
.dragon-maid-image-setting strong{grid-column:1/-1}.dragon-maid-image-setting img{width:64px;height:74px;object-fit:contain;grid-row:span 2;background:var(--dsw-alias-bg-layer-2);border-radius:8px}
.dragon-maid-upload{grid-column:2;display:flex;flex-wrap:wrap;gap:8px;font-size:12px}.dragon-maid-upload input{max-width:210px}
.dragon-maid-save-row{display:flex;gap:10px;margin:20px 0}.dragon-maid-settings [data-error=true]{color:var(--dsw-alias-state-error-primary)}
@media(max-width:540px){.dragon-maid-setting-row{grid-template-columns:1fr}.dragon-maid-image-setting{grid-template-columns:54px minmax(0,1fr)}.dragon-maid-image-setting>button{grid-column:2}}
`;

function Pet({ctx,sessionId,binding,diagnostics,store}) {
  const t=useTranslate(ctx.locale);
  const source=React.useMemo(()=>binding?.session.projections.faceOf('modelSelection') ?? emptySource,[binding]);
  const projection=useSource(source);
  const session=useSource(binding?.session ?? emptySource);
  const settings=useSource(store).settings;
  const preview=settings.stage==='auto'?null:settings.stage;
  const [catalog,setCatalog]=React.useState(null);
  const [edges,setEdges]=React.useState({left:0,right:0});
  const edgesRef=React.useRef(edges);edgesRef.current=edges;
  const [view,setView]=React.useState(()=>clampView(readView(),settings.width));
  const [speech,setSpeech]=React.useState(false);
  const [imageError,setImageError]=React.useState(false);
  const drag=React.useRef(null);
  const justDragged=React.useRef(false);
  const rootRef=React.useRef(null);
  const imageRef=React.useRef(null);
  const diagnosticsToken=React.useRef({});
  const width=petWidth(settings.width);
  React.useLayoutEffect(()=>{
    const token=diagnosticsToken.current;
    diagnostics.mount(token);
    return()=>diagnostics.unmount(token);
  },[diagnostics]);
  const selection=projection?.next;
  React.useEffect(()=>{
    let alive=true;
    ctx.remote.session.modelCatalog().then(result=>{
      if(alive && result.ok)setCatalog(result.value);
      else if(alive && !result.ok)console.error('Model catalog unavailable',result.error.code);
    }).catch(error=>{if(alive)console.error('Model catalog unavailable',String(error));});
    return()=>{alive=false;};
  },[ctx,selection?.provider,selection?.model]);
  React.useEffect(()=>{
    const id=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(view));}catch{}},200);
    return()=>clearTimeout(id);
  },[view]);
  React.useEffect(()=>{
    const resize=()=>setView(v=>clampView(v,settings.width,edgesRef.current));
    resize();
    window.addEventListener('resize',resize);
    return()=>window.removeEventListener('resize',resize);
  },[settings.width,edges]);
  React.useEffect(()=>{if(!speech)return;const timer=setTimeout(()=>setSpeech(false),3500);return()=>clearTimeout(timer);},[speech]);
  const appearance=resolveAppearance(projection,catalog,preview,settings);
  const custom=settings.illustrations[appearance.stage]||'';
  const imageSrc=custom||EMBEDDED_IMAGES[appearance.character]?.[appearance.stage]||`data:image/svg+xml;charset=utf-8,${encodeURIComponent(dragonMaidSvg(appearance.stage))}`;
  React.useEffect(()=>setImageError(false),[appearance.stage,custom]);
  React.useEffect(()=>{
    let alive=true;
    measureEdges(imageSrc).then(value=>{if(alive)setEdges(current=>current.left===value.left&&current.right===value.right?current:value);});
    return()=>{alive=false;};
  },[imageSrc]);
  const name=settings.name||t(appearance.character==='dragon'?'title':'title_'+appearance.character);
  const captureDiagnostics=React.useCallback(()=>observePet(diagnostics,diagnosticsToken.current,{
    sessionId,model:appearance.model||null,effort:appearance.effort??null,
    selection:selection?{provider:selection.provider??null,model:selection.model??null,reasoningEffort:selection.reasoningEffort??null}:catalog?.default?{provider:catalog.default.provider??null,model:catalog.default.model??null,reasoningEffort:catalog.default.reasoningEffort??null}:null,
    selectionSource:selection?'session-projection':catalog?.default?'catalog-default':'unavailable',
    expectedStage:appearance.stage,followingStage:resolveAppearance(projection,catalog,null,settings).stage,
    mode:appearance.mode,stage:appearance.stage,collapsed:view.collapsed,imageError,
    imageKind:custom?'custom-illustration':EMBEDDED_IMAGES[appearance.character]?.[appearance.stage]?'illustration':'original-vector',
    settings:store.status(),
  },rootRef.current,imageRef.current),[diagnostics,store,sessionId,selection,catalog,projection,settings,custom,appearance.model,appearance.effort,appearance.mode,appearance.stage,view.collapsed,view.right,view.bottom,width,imageError]);
  React.useLayoutEffect(captureDiagnostics,[captureDiagnostics]);
  React.useEffect(()=>{
    window.addEventListener('resize',captureDiagnostics);
    document.addEventListener('visibilitychange',captureDiagnostics);
    return()=>{window.removeEventListener('resize',captureDiagnostics);document.removeEventListener('visibilitychange',captureDiagnostics);};
  },[captureDiagnostics]);
  const effort=appearance.preview?appearance.stage:appearance.effort;
  const mode=appearance.mode==='following'?`${t('following')} · ${effort}`:appearance.mode==='preview'?`${t('preview')} · ${effort}`:t(appearance.mode);
  const update=patch=>setView(v=>clampView({...v,...patch},settings.width,edgesRef.current));
  const title=`${name} · ${t(appearance.stage)}`;
  // Dragging the figure itself moves the pet. A press without movement stays a click.
  const dragProps=onActivate=>({
    onPointerDown:e=>{if(e.button!==0)return;e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,right:view.right,bottom:view.bottom,moved:false};},
    onPointerMove:e=>{
      const d=drag.current;if(!d)return;
      const dx=e.clientX-d.x,dy=e.clientY-d.y;
      if(!d.moved&&Math.hypot(dx,dy)<4)return;
      d.moved=true;
      update({right:d.right-dx,bottom:d.bottom-dy});
    },
    onPointerUp:e=>{
      const d=drag.current;drag.current=null;
      if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
      if(d?.moved){justDragged.current=true;setTimeout(()=>{justDragged.current=false;},80);}
    },
    onPointerCancel:()=>{drag.current=null;},
    onClick:()=>{if(justDragged.current)return;onActivate();},
    onKeyDown:e=>{const change={ArrowLeft:{right:view.right+12},ArrowRight:{right:view.right-12},ArrowUp:{bottom:view.bottom+12},ArrowDown:{bottom:view.bottom-12}}[e.key];if(change){e.preventDefault();update(change);}},
  });
  if(!settings.visible)return null;
  return h('section',{
    ref:rootRef,className:'dragon-maid-root','aria-label':title,'data-stage':appearance.stage,'data-mode':appearance.mode,
    'data-running':session?.running===true,'data-divine':appearance.stage==='max'&&settings.divineGlow,
    style:{right:view.right,bottom:view.bottom,'--maid-width':`${width}px`},
    onKeyDown:e=>{if(e.key==='Escape')setSpeech(false);},
  },h('style',null,CSS),view.collapsed?
    h('div',{className:'dragon-maid-collapsed'},
      h('button',{...dragProps(()=>update({collapsed:false})),className:'dragon-maid-summon',title:`${t('summon')} · ${t('drag')}`,'aria-label':t('summon')},`${appearance.character==='dragon'?'\uD83D\uDC09':'\u2726'} ${settings.name||effort||name}`)):
    h(React.Fragment,null,
      h('button',{...dragProps(()=>setSpeech(v=>!v)),className:'dragon-maid-art-button',title:t('drag'),'aria-label':`${title} · ${t('drag')}`},
        h('span',{className:'dragon-maid-float'},
          imageError?h('span',{className:'dragon-maid-error',role:'status'},t('artError')):
          h('img',{ref:imageRef,className:'dragon-maid-art','data-stage':appearance.stage,key:`${appearance.stage}:${custom.length}`,src:imageSrc,alt:title,draggable:false,decoding:'async',onLoad:captureDiagnostics,onError:()=>setImageError(true)}))),
      settings.showCaption?h('div',{className:'dragon-maid-caption','aria-live':'polite','aria-atomic':true},
        h('span',{className:'dragon-maid-stage'},settings.name?`${name} · ${t(appearance.stage)}`:t(appearance.stage)),
        h('span',{className:'dragon-maid-stars','aria-hidden':true},'✦'.repeat(STAGES.indexOf(appearance.stage)+1)+'·'.repeat(4-STAGES.indexOf(appearance.stage))),
        h('span',{className:'dragon-maid-mode'},mode)):null,
      h('div',{className:'dragon-maid-actions'},
        h('button',{className:'dragon-maid-control',onClick:()=>update({collapsed:true}),title:t('collapse'),'aria-label':t('collapse')},'−')),
      speech?h('div',{className:'dragon-maid-speech',role:'status'},t(appearance.mode==='following'?'greeting':'tip')):null));
}
return {
  inject:['slots','locale','sessions','remote','remote.session','remote.settings'],
  apply(ctx) {
    const diagnostics=createPetDiagnostics();
    ctx.effect(()=>()=>diagnostics.dispose(),'dragon-maid-pet: diagnostics state');
    const store=createSettingsStore(ctx);
    ctx.effect(()=>()=>store.dispose(),'dragon-maid-pet: settings store');
    // Built-in reasoning-effort editor (Settings → Models). Optional: needs the configForms service and never blocks the pet.
    ctx.inject(['configForms'],effortCtx=>{
      try{installReasoningEffort(effortCtx,{autoFillEnabled:()=>true});}
      catch(error){console.error('dragon-maid-pet: reasoning-effort editor unavailable',error);}
    });
    ctx.inject(['cordisInspect'],inspectCtx=>{
      const registry=inspectCtx.get('cordisInspect');
      if (!registry || typeof registry.register!=='function') return;
      inspectCtx.effect(()=>registry.register(petInspectProvider(diagnostics)),'dragon-maid-pet: read-only inspect provider');
    });
    for(const [locale,dict] of [['en',EN],['zh',ZH],['zh-CN',ZH]])ctx.effect(()=>ctx.locale.register(NS,locale,dict));
    store.refresh();
    ctx.effect(()=>{
      const off=typeof ctx.remote.$on==='function'?ctx.remote.$on('settings/document-updated',()=>store.refresh()):undefined;
      return typeof off==='function'?off:()=>{};
    },'dragon-maid-pet: settings change listener');
    function Overlay(props) {
      const sessionId=props.useSessions(state=>Object.values(state.byId).find(row=>(row.retainedBy.mainView??0)>0)?.id);
      const inConversation=props.usePanelInfo(info=>info.activePanelId===null);
      if(!inConversation||!sessionId)return null;
      const binding=ctx.sessions.binding(sessionId);
      return h(Pet,{key:sessionId,ctx,sessionId,binding,diagnostics,store});
    }
    ctx.slots.inject('shell.overlay',()=>ctx.slots.register({name:'shell.overlay',id:'dragon-maid-companion',order:40,label:()=>ctx.locale.bind(NS)('title')},Overlay));
    // Native Plugins page: both the bundle page and its row's configuration page show the form.
    const Settings=props=>h(SettingsForm,{ctx,store,view:props?.view});
    for(const [name,key] of [['plugins.row.config','dsh-dragon-maid-pet#dragon-maid-pet'],['plugins.bundle.config','dsh-dragon-maid-pet']])
      ctx.slots.inject(name,()=>ctx.slots.register({name,key},Settings));
  },
};
