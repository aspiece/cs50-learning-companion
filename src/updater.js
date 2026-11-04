'use strict';
// Built-in updater for the unpublished GCI classroom pilot.
// Only downloads versioned VSIX packages from this repository's public GitHub releases.
const https=require('node:https');
const crypto=require('node:crypto');
const fs=require('node:fs/promises');
const path=require('node:path');
const {execFile}=require('node:child_process');

const REPO='aspiece/cs50-learning-companion';
const API='https://api.github.com/repos/'+REPO+'/releases?per_page=20';
const MAX_API=2*1024*1024;
const MAX_CHECKSUM=100*1024;
const MAX_VSIX=35*1024*1024;

function parseVersion(version){
 if(!/^\d+\.\d+\.\d+$/.test(String(version)))return null;
 return String(version).split('.').map(Number);
}
function compareVersions(a,b){
 const aa=parseVersion(a),bb=parseVersion(b);
 if(!aa||!bb)throw new Error('Invalid companion version.');
 for(let i=0;i<3;i++)if(aa[i]!==bb[i])return aa[i]>bb[i]?1:-1;
 return 0;
}
function expectedName(version){return 'cs50-learning-companion-'+version+'.vsix';}
function releaseAsset(release,name){
 return Array.isArray(release.assets)?release.assets.find(a=>a&&a.name===name&&typeof a.browser_download_url==='string'):null;
}
function trustedReleaseUrl(value,tag,name){
 // Do not install an arbitrary location supplied by a release response.
 const url=new URL(value);
 return url.protocol==='https:'&&url.hostname==='github.com'&&
  url.pathname==='/'+REPO+'/releases/download/'+tag+'/'+name&&
  !url.username&&!url.password&&!url.search&&!url.hash;
}
function findAvailableRelease(releases,currentVersion){
 if(!Array.isArray(releases))throw new Error('GitHub did not return a release list.');
 const candidates=[];
 for(const release of releases){
  if(!release||release.draft||typeof release.tag_name!=='string')continue;
  const tag=release.tag_name,match=/^v(\d+\.\d+\.\d+)$/.exec(tag);
  if(!match||compareVersions(match[1],currentVersion)<=0)continue;
  const version=match[1],name=expectedName(version);
  const vsix=releaseAsset(release,name);
  const sums=releaseAsset(release,'SHA256SUMS.txt');
  if(!vsix||!sums)continue;
  if(!trustedReleaseUrl(vsix.browser_download_url,tag,name)||
     !trustedReleaseUrl(sums.browser_download_url,tag,'SHA256SUMS.txt'))continue;
  candidates.push({version,tag,name,vsixUrl:vsix.browser_download_url,checksumUrl:sums.browser_download_url});
 }
 candidates.sort((a,b)=>compareVersions(b.version,a.version));
 return candidates[0]||null;
}
function allowedHost(host){
 return host==='api.github.com'||host==='github.com'||
  host==='objects.githubusercontent.com'||host.endsWith('.githubusercontent.com');
}
function fetchBuffer(url,maxBytes,redirects=0){
 return new Promise((resolve,reject)=>{
  const target=new URL(url);
  if(target.protocol!=='https:'||!allowedHost(target.hostname)||redirects>5)
   return reject(new Error('Untrusted update download URL.'));
  const request=https.get(target,{headers:{
   'User-Agent':'GCI-CS50-Learning-Companion',
   'Accept':'application/vnd.github+json'
  }},response=>{
   if([301,302,303,307,308].includes(response.statusCode)){
    const location=response.headers.location;
    response.resume();
    if(!location)return reject(new Error('GitHub sent a redirect without a destination.'));
    return fetchBuffer(new URL(location,target).toString(),maxBytes,redirects+1).then(resolve,reject);
   }
   if(response.statusCode!==200){
    response.resume();
    return reject(new Error('GitHub download failed (HTTP '+response.statusCode+').'));
   }
   let size=0,parts=[];
   response.on('data',chunk=>{
    size+=chunk.length;
    if(size>maxBytes){response.destroy(new Error('Update download exceeds its size limit.'));return;}
    parts.push(chunk);
   });
   response.on('end',()=>resolve(Buffer.concat(parts)));
   response.on('error',reject);
  });
  request.setTimeout(20000,()=>request.destroy(new Error('GitHub update request timed out.')));
  request.on('error',reject);
 });
}
async function checkForUpdate(currentVersion){
 const raw=await fetchBuffer(API,MAX_API);
 return findAvailableRelease(JSON.parse(raw.toString('utf8')),currentVersion);
}
function expectedChecksum(checksums,filename){
 for(const line of checksums.split(/\r?\n/)){
  const match=/^([0-9a-fA-F]{64})[ \t]+\*?(\S+)$/.exec(line.trim());
  if(match&&match[2]===filename)return match[1].toLowerCase();
 }
 throw new Error('The release has no SHA-256 checksum for '+filename+'.');
}
async function downloadVerified(update,directory){
 const filename=expectedName(update.version);
 if(update.name!==filename||!trustedReleaseUrl(update.vsixUrl,update.tag,filename)||
   !trustedReleaseUrl(update.checksumUrl,update.tag,'SHA256SUMS.txt'))
  throw new Error('Unexpected update package location.');
 const [checksums,vsix]=await Promise.all([
  fetchBuffer(update.checksumUrl,MAX_CHECKSUM),
  fetchBuffer(update.vsixUrl,MAX_VSIX)
 ]);
 const expected=expectedChecksum(checksums.toString('utf8'),filename);
 const actual=crypto.createHash('sha256').update(vsix).digest('hex');
 if(actual!==expected)throw new Error('The downloaded extension failed its SHA-256 check. Installation was cancelled.');
 if(vsix.length<100||vsix.subarray(0,2).toString('ascii')!=='PK')
  throw new Error('The downloaded extension is not a valid VSIX ZIP package.');
 await fs.mkdir(directory,{recursive:true});
 const destination=path.join(directory,filename);
 await fs.writeFile(destination,vsix,{mode:0o600});
 return destination;
}
async function installWithCodeCLI(filename){
 return new Promise((resolve,reject)=>{
  execFile('code',['--install-extension',filename,'--force'],{
   timeout:120000,maxBuffer:1024*1024
  },(error,stdout,stderr)=>{
   if(error)return reject(new Error((stderr||stdout||error.message).trim().slice(0,500)));
   resolve((stdout||'').trim());
  });
 });
}
module.exports={
 REPO,API,compareVersions,findAvailableRelease,trustedReleaseUrl,
 expectedChecksum,checkForUpdate,downloadVerified,installWithCodeCLI
};
