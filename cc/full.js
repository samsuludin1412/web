let my={}
function init(){let version='0.82'
let h=300
my.opts={name:'user',f0:''}
my.decN=200
my.toggles={rad:false,space:false}
my.keys=["7","8","9","\u00d7","\u00f7","4","5","6","+","\u2212","1","2","3","(",")","0",".","^","\u2190","C"];my.keysn=my.keys.length
my.fnkeys=["!","e","pi","&nbsp;"];let s=''
docInsert(s)
Decimal.set({precision:1000,toExpNeg:-1000,toExpPos:1000})
my.radToDeg=new Decimal(180).div(my.pi)
my.degToRad=new Decimal(my.pi).div(180)
my.hists=[]
my.lastHist='?'
my.lastHistTime=0
my.parser=new Parser()
my.uDiv=document.getElementById('u')
my.uDiv.value=optGet('f0')
document.getElementById('decN').value=my.decN
decNChg(my.decN)}
function qClear(){document.getElementById('u').value=''
document.getElementById('ans').innerHTML='&nbsp;'}
function tests(){let exs=['-1.667×-1.667','5!','10!/5!','3-1.1e3/1e2 - e + e^2- 2.3 -45','1E4','3-1e-4','-2.2e-4-3','3*sqrt(2)','pi/2','2pi','e^2','2e','27','$3,600.5/2','1+2-3','3(7+3)','1/sqrt(2)','sqrt(-1)','12+2*3','abs(-3.2)','floor(-3.2)','ceil(-3.2)','sign(-3.2)','round(-3.2)','sinh(-1.1)','2.e2','2^0.5','2^-0.5','2^-.5','3.1*-3','3.1*-3.1','-3.1*-3.1','1e-4','1e4 - 1e-4','1e4 + 1e-4','1/sqrt(2)','exp(1)','1.2345*1e14','pi*1e11','pi*1e15','pi*1e-12'];rpLog('test stt')
for(let i=0;i<exs.length;i++){let ex=exs[i]
my.parser.newParse(ex)
let s=my.parser.getVal().toPrecision(my.decN)
let num=fmtNum(s)
num=fmtSpace(num)
console.log('ex:',ex,'==>',my.parser.rootNode.walkFmt(),'==>',num)}
rpLog('test end')}
function toggle(name,offStr='',onStr=''){my.toggles[name]=!my.toggles[name]
console.log('toggle',my.toggles)
let div=document.getElementById(name+'Btn')
if(my.toggles[name]){div.classList.add('hi')
div.classList.remove('lo')
if(onStr.length>0)div.innerHTML=onStr}else{div.classList.add('lo')
div.classList.remove('hi')
if(offStr.length>0)div.innerHTML=offStr}
doCalc(false)}
function getKeyHTML(){let lineStt='<div style="text-align:center;">'
let lineEnd='</div>'
let s=''
for(let i=0;i<my.keys.length;i++){let key=my.keys[i]
if(i%5==0){if(i>0)s+=lineEnd
s+=lineStt}
let clr=keyClr(i,'out')+';'
s+='<button id="key'+i+'" style="width:57px; margin:-1px; font: 30px Consolas,monaco,monospace; background: #111;" type="button" onclick="doKey('+i+')" onmouseover="keyOver('+i+')"  onmouseout="keyOut('+i+')" >'+key+'</button>'}
s+=lineEnd
return s}
function getfKeyHTML(){let lineStt='<div style="text-align:center;">'
let lineEnd='</div>'
let s=''
for(let i=0;i<my.fnkeys.length;i++){let key=my.fnkeys[i]
if(i%4==0){if(i>0)s+=lineEnd
s+=lineStt}
let n=i+my.keysn
let clr=keyClr(n,'out')+';'
s+='<button id="key'+n+'" style="width:71px; height:38px; margin:-1px; font: 21px Consolas,monaco,monospace; background: '+clr+';" type="button" onclick="doKey('+n+')" onmouseover="keyOver('+n+')"  onmouseout="keyOut('+n+')" >'+key+'</button>'}
s+=lineEnd
return s}
function doKey(i){let key=''
if(i<my.keysn){key=my.keys[i]}else{key=my.fnkeys[i-my.keysn]}
let simples=['1','2','3','4','5','6','7','8','9','0','(',')','+','\u00d7','\u00f7','\u2212','.','^','i']
if(simples.indexOf(key)>=0){pushU(key)}else{switch(key){case '=':doCalc(true)
break
case 'C':my.uDiv.value=''
document.getElementById('ans').innerHTML='&nbsp;'
break
case '1/x':aroundU('(1/(','))')
break
case '\u00B1':aroundU('(-(','))')
break
case 'sin':aroundU('sin(',')')
break
case 'cos':aroundU('cos(',')')
break
case 'tan':aroundU('tan(',')')
break
case 'sin<sup>-1</sup>':aroundU('asin(',')')
break
case 'cos<sup>-1</sup>':aroundU('acos(',')')
break
case 'tan<sup>-1</sup>':aroundU('atan(',')')
break
case 'e<sup>x</sup>':aroundU('exp(',')')
break
case 'ln':aroundU('ln(',')')
break
case '\u221a':aroundU('sqrt(',')')
break
case 'x\u00b2':aroundU('(',')^2')
break
case 'x\u00b3':aroundU('(',')^3')
break
case 'rad':toggleRad(i)
break
case '!':pushU('!')
break
case 'e':pushU('e')
break
case 'pi':pushU('pi')
break
case '\u2190':let s=my.uDiv.value
s=s.substring(0,s.length-1)
my.uDiv.value=s
break
default:}}}
function pushU(s){if(my.uDiv.selectionStart==0&&my.uDiv.selectionEnd==0){let txt=my.uDiv.value
my.uDiv.setSelectionRange(txt.length,txt.length)}
let txt=my.uDiv.value
my.uDiv.value=txt.substring(0,my.uDiv.selectionStart)+s+txt.substring(my.uDiv.selectionEnd)
my.uDiv.setSelectionRange(my.uDiv.selectionStart+s.length,my.uDiv.selectionStart+s.length)
doCalc(false)}
function aroundU(s1,s2){let s=my.uDiv.value
let ops=['+','-','\u2212','*','\u00d7','/','\u00f7','^']
let skipi=false
let i=0
for(i=s.length-1;i>=0;i--){let c=s.charAt(i)
if(c=='i')skipi=true
if(skipi&&(c=='-'||c=='+')){skipi=false}else{if(ops.indexOf(c)>-1)break}}
let sNew=''
if(i==0){sNew=s1+s+s2}else{i++
sNew=s.substr(0,i)+s1+s.substr(i)+s2
console.log('aroundU',s,i,sNew)}
my.uDiv.value=sNew
doCalc(false)}
function userKey(e){let kt=keyType(e.keyCode,e.shiftKey)
let f=my.uDiv.value
switch(kt){case '=':f=f.substr(0,f.length-1)
my.uDiv.value=f
doCalc(true)
break
case '+':case '*':case '/':case '^':console.log('userKey',kt)
if(f.length==1){my.uDiv.value=my.hists[0][0]+f}
doCalc(false)
break
default:doCalc(false)
break}}
function keyType(k,shift){if(k==13)return '='
if(k==61&&shift)return '+'
if(k==61&&!shift)return '='
if(k==187&&shift)return '+'
if(k==187&&!shift)return '='
if(k==173&&!shift)return '-'
if(k==189&&!shift)return '-'
if(k==191&&!shift)return '/'
if(k==56&&shift)return '*'
if(k==106)return '*'
if(k==107)return '+'
if(k==109)return '-'
if(k==111)return '/'
return '?'}
function decNChg(v){my.decN=parseInt(v)
if(isNaN(my.decN)){my.decN=1}
if(my.decN<1){my.decN=1
document.getElementById('decN').value=my.decN}
if(my.decN>10000){my.decN=10000
document.getElementById('decN').value=my.decN}
console.log('my.decN',my.decN)
let nExtra=my.decN+10
Decimal.set({precision:nExtra,toExpNeg:-1000,toExpPos:1000,})
doCalc(false)}
function doCalc(updateUQ){let f=my.uDiv.value
optSet('f0',f)
my.parser.radiansQ=my.toggles.rad
my.parser.newParse(f)
let s=my.parser.getVal().toPrecision(my.decN)
let num=fmtNum(s)
if(my.parser.errMsg.length>0){document.getElementById('ans').innerHTML='&nbsp;'}else{if(updateUQ){my.uDiv.value=''}
let str=num
if(my.toggles.space)str=fmtSpace(str)
document.getElementById('ans').innerHTML=str
addHist(f,str)}
return num}
function fmtSpace(s){if(!my.toggles.space)return s
let decPos=s.indexOf('.')
if(decPos<0){return s.replace(/\B(?=(\d{3})+(?!\d))/g,' ')}else{let lhs=s.substring(0,decPos)
let rhs=s.substring(decPos+1)
lhs=lhs.replace(/\B(?=(\d{3})+(?!\d))/g,' ')
rhs=rhs.replace(/(\d{3})/g,'$1 ')
return lhs+'.'+rhs}}
function fmtNum(s){let hasMinusQ=s.indexOf('-')==0
if(hasMinusQ)s=s.substr(1)
if(s.indexOf('.')>0&&s.indexOf('e')<0){s=s.replace(/0+$/,'')}
if(s.charAt(s.length-1)=='.'){s=s.substr(0,s.length-1)}
if(false){let eSttN=40
let dotCol=s.indexOf('.')
if(dotCol>eSttN){s=s.substr(0,1)+'.'+s.substr(1).replace('.','')+'e'+(dotCol-1)}
if(dotCol<0){if(s.length>eSttN){let nonZeroCol=0
for(let i=s.length-1;i>0;i--){if(s.charAt(i)!='0'){nonZeroCol=i
break}}
s=s.substr(0,1)+'.'+s.substr(1,nonZeroCol)+'e'+(s.length-1)}}
eSttN=7
if(s.indexOf('0.0')==0){let nonZeroCol=0
for(let i=2;i<s.length;i++){if(s.charAt(i)!='0'){nonZeroCol=i
break}}
if(nonZeroCol>eSttN){s=s.substr(nonZeroCol).replace(/0+$/,'')
if(s.length==1){s+='e-'+(nonZeroCol-1)}else{s=s.substr(0,1)+'.'+s.substr(1)+'e-'+(nonZeroCol-1)}}}}
if(hasMinusQ)s='-'+s
return s}
function addHist(q,a){if(q!=a.toString()){let hist=q+' = '+a
if(hist!=my.lastHist){if(my.lastHistTime+2000>Date.now()){my.hists[0]=[q,a]}else{my.hists.unshift([q,a])}
my.lastHist=hist
my.lastHistTime=Date.now()
let h=''
for(let i=0;i<Math.min(8,my.hists.length-1);i++){h+=my.hists[i][0]+' = '+my.hists[i][1]+'\n'}
document.getElementById('hist').value=h}}}
function keyOver(n){let div=document.getElementById('key'+n)
div.style.background=keyClr(n,'over')}
function keyOut(n){let div=document.getElementById('key'+n)
div.style.background=keyClr(n,'out')}
function keyClr(n,state){let clr='blue;'
switch(state){case 'out':clr='linear-gradient(to right, #333 0%, #333 100%)'
if(n%5>=3)clr='linear-gradient(to right, #333 0%, #333 100%)'
if(n>=my.keysn)clr='linear-gradient(to right, #333 0%, #333 100%)'
break
case 'over':clr='linear-gradient(to right, #333 0%, #333 100%)'
if(n%5>=3)clr='linear-gradient(to right, #333 0%, #333 100%)'
if(n>=my.keysn)clr='linear-gradient(to right, #333 0%, #333 100%)'
break
default:}
return clr}
function getHist(){let s=''
my.lastHistTime=0
for(let i=0;i<my.hists.length;i++){s+=my.hists[i]+'\n'}
return s}
class Parser{constructor(){this.operators='+-*(/),^.'
this.rootNode=null
this.tempNode=[]
this.variable='???'
this.errMsg=''
this.radiansQ=true
this.vals=[]
for(let i=0;i<26;i++){this.vals[i]=0}
this.reset()}
setVarVal(varName,newVal){switch(varName){case 'x':this.vals[23]=newVal
break
case 'y':this.vals[24]=newVal
break
case 'z':this.vals[25]=newVal
break
default:if(varName.length==1){this.vals[varName.charCodeAt(0)-'a'.charCodeAt(0)]=newVal}}}
getVal(){return this.rootNode.walk(this.vals)}
getSlope(dx){let x=this.vals[23]
this.vals[23]=x-dx/2
let yLt=this.rootNode.walk(this.vals)
this.vals[23]=x+dx/2
let yRt=this.rootNode.walk(this.vals)
return(yRt-yLt)/dx}
newParse(s){this.reset()
s=s.split(',').join('.')
s=s.replace(/[^\w/\.\(\)\[\]\+\-\^\%\&\;\*\!\u2212\u00F7\u00D7\u00B2\u00B3\u221a]/gi,'')
s=s.split('exp').join('eksp')
s=s.split('x').join('*')
s=s.split('[').join('(')
s=s.split(']').join(')')
s=s.split('&nbsp;').join('')
s=s.split('&mult;').join('*')
s=s.split('&divide;').join('/')
s=s.split('&minus;').join('-')
s=s.replace(/\u2212/g,'-')
s=s.replace(/\u00F7/g,'/')
s=s.replace(/\u00D7/g,'*')
s=s.replace(/\u00B2/g,'^2')
s=s.replace(/\u00B3/g,'^3')
s=s.replace(/\u221a([0-9\.]+)/g,'sqrt($1)')
s=s.replace(/\u221a\(/g,'sqrt(')
s=this.fixPercent(s)
s=this.fixENotation(s)
s=this.fixParentheses(s)
s=this.fixUnaryMinus(s)
s=this.fixFactorial(s)
s=this.fixImplicitMultply(s)
this.rootNode=this.parse(s)}
fixPercent(s){if(!s.match(/%/)){return s}
let myRe=/[0-9]*\.?[0-9]+[%]/g
let bits=[]
let stt=0
let arr
while((arr=myRe.exec(s))!==null){bits.push(s.substr(stt,arr.index-stt))
let str=arr[0]
str='('+str.replace(/%/,'/100')+')'
bits.push(str)
stt=arr.index+arr[0].length}
bits.push(s.substr(stt))
s=bits.join('')
return s}
fixFactorial(s){if(s.indexOf('!')<0)return s
let currPos=1
let chgQ=false
do{chgQ=false
let fPos=s.indexOf('!',currPos)
if(fPos>0){let numEnd=fPos-1
let numStt=numEnd
let cnum=s.charAt(numStt)
if(cnum=='n'){}else{do{cnum=s.charAt(numStt)
numStt--}while(cnum>='0'&&cnum<='9')
numStt+=2}
if(numStt<=numEnd){let numStr=s.substr(numStt,numEnd-numStt+1)
numStr='fact('+numStr+')'
s=s.substr(0,numStt)+numStr+s.substr(numEnd+2)
currPos=fPos+numStr.length
chgQ=true}}}while(chgQ)
return s}
fixENotation(s){if(!s.match(/e/i)){return s}
let myRe=/[0-9]*\.?[0-9]+[eE]{1}[-+]?[0-9]+/g
let bits=[]
let stt=0
let arr
while((arr=myRe.exec(s))!==null){bits.push(s.substr(stt,arr.index-stt))
let eStr=arr[0]
eStr='('+eStr.replace(/e/gi,'*10^(')+'))'
bits.push(eStr)
stt=arr.index+arr[0].length}
bits.push(s.substr(stt))
s=bits.join('')
return s}
fixParentheses(s){let sttParCount=0
let endParCount=0
for(let i=0;i<s.length;i++){if(s.charAt(i)=='(')sttParCount++
if(s.charAt(i)==')')endParCount++}
while(sttParCount<endParCount){s='('+s
sttParCount++}
while(endParCount<sttParCount){s+=')'
endParCount++}
return s}
fixUnaryMinus(s){let x=s+'\n'
let y=''
let OpenQ=false
let prevType='('
let thisType=''
for(let i=0;i<s.length;i++){let c=s.charAt(i)
if((c>='0'&&c<='9')||c=='.'){thisType='N'}else{if(this.operators.indexOf(c)>=0){if(c=='-'){thisType='-'}else{thisType='O'}}else{if(c=='.'||c==this.variable){thisType='N'}else{thisType='C'}}
if(c=='('){thisType='('}
if(c==')'){thisType=')'}}
x+=thisType
if(prevType=='('&&thisType=='-'){y+='0'}
if(OpenQ){switch(thisType){case 'N':break
default:y+=')'
OpenQ=false}}
if(prevType=='O'&&thisType=='-'){y+='(0'
OpenQ=true}
y+=c
prevType=thisType}
if(OpenQ){y+=')'
OpenQ=false}
return y}
fixImplicitMultply(s){let x=s+'\n'
let y=''
let prevType='?'
let prevName=''
let thisType='?'
let thisName=''
for(let i=0;i<s.length;i++){let c=s.charAt(i)
if(c>='0'&&c<='9'){thisType='N'}else{if(this.operators.indexOf(c)>=0){thisType='O'
thisName=''}else{thisType='C'
thisName+=c}
if(c=='('){thisType='('}
if(c==')'){thisType=')'}}
x+=thisType
if(prevType=='N'&&thisType=='C'){y+='*'
thisName=''}
if(prevType=='N'&&thisType=='('){y+='*'}
if(prevType==')'&&thisType=='('){y+='*'}
if(prevType==')'&&thisType=='N'){y+='*'}
if(thisType=='('){switch(prevName){case 'i':case 'pi':case 'e':case 'a':case this.variable:y+='*'
break}}
y+=c
prevType=thisType
prevName=thisName}
return y}
reset(){this.tempNode=[]
this.errMsg=''}
parse(s){if(s==''){this.errMsg+='Missing Value\n'
return new MathNode('real','0',this.radiansQ)}
if(isNumeric(s)){return new MathNode('real',s,this.radiansQ)}
if(s.charAt(0)=='$'){if(isNumeric(s.substr(1))){return this.tempNode[Number(s.substr(1))]}}
let sLo=s.toLowerCase()
if(sLo.length==1){if(sLo>='a'&&sLo<='z'){return new MathNode('var',sLo,this.radiansQ)}}
switch(sLo){case 'pi':return new MathNode('var',sLo,this.radiansQ)}
let bracStt=s.lastIndexOf('(')
if(bracStt>-1){let bracEnd=s.indexOf(')',bracStt)
if(bracEnd<0){this.errMsg+="Missing ')'\n"
return new MathNode('real','0',this.radiansQ)}
let isParam=false
if(bracStt==0){isParam=false}else{let prefix=s.substr(bracStt-1,1)
isParam=this.operators.indexOf(prefix)<=-1}
if(!isParam){this.tempNode.push(this.parse(s.substr(bracStt+1,bracEnd-bracStt-1)))
return this.parse(s.substr(0,bracStt)+'$'+(this.tempNode.length-1).toString()+s.substr(bracEnd+1,s.length-bracEnd-1))}else{let startM=-1
for(let u=bracStt-1;u>-1;u--){let found=this.operators.indexOf(s.substr(u,1))
if(found>-1){startM=u
break}}
let nnew=new MathNode('func',s.substr(startM+1,bracStt-1-startM),this.radiansQ)
nnew.addchild(this.parse(s.substr(bracStt+1,bracEnd-bracStt-1)))
this.tempNode.push(nnew)
return this.parse(s.substr(0,startM+1)+'$'+(this.tempNode.length-1).toString()+s.substr(bracEnd+1,s.length-bracEnd-1))}}
let k
let k1=s.lastIndexOf('+')
let k2=s.lastIndexOf('-')
if(k1>-1||k2>-1){if(k1>k2){k=k1
let nnew=new MathNode('op','add',this.radiansQ)
nnew.addchild(this.parse(s.substr(0,k)))
nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)))
return nnew}else{k=k2
let nnew=new MathNode('op','sub',this.radiansQ)
nnew.addchild(this.parse(s.substr(0,k)))
nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)))
return nnew}}
k1=s.lastIndexOf('*')
k2=s.lastIndexOf('/')
if(k1>-1||k2>-1){if(k1>k2){k=k1
let nnew=new MathNode('op','mult',this.radiansQ)
nnew.addchild(this.parse(s.substr(0,k)))
nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)))
return nnew}else{k=k2
let nnew=new MathNode('op','div',this.radiansQ)
nnew.addchild(this.parse(s.substr(0,k)))
nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)))
return nnew}}
k=s.indexOf('^')
if(k>-1){let nnew=new MathNode('op','pow',this.radiansQ)
nnew.addchild(this.parse(s.substr(0,k)))
nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)))
return nnew}
if(isNumeric(s)){return new MathNode('real',s,this.radiansQ)}else{if(s.length==0){return new MathNode('real','0',this.radiansQ)}else{this.errMsg+="'"+s+"' is not a number.\n"
return new MathNode('real','0',this.radiansQ)}}}}
class MathNode{constructor(typ,val,radQ){this.tREAL=0
this.tVAR=1
this.tOP=2
this.tFUNC=3
this.radiansQ=radQ
this.setNew(typ,val,radQ)}
setNew(typ,val,radQ=true){this.radiansQ=radQ
this.clear()
switch(typ){case 'real':this.typ=this.tREAL
this.r=new Decimal(val)
break
case 'var':this.typ=this.tVAR
this.v=val
break
case 'op':this.typ=this.tOP
this.op=val
break
case 'func':this.typ=this.tFUNC
this.op=val
break}
return this}
clear(){this.r=1
this.v=''
this.op=''
this.child=[]
this.childCount=0}
addchild(n){this.child.push(n)
this.childCount++
return this.child[this.child.length-1]}
getLevelsHigh(){let lvl=0
for(let i=0;i<this.childCount;i++){lvl=Math.max(lvl,this.child[i].getLevelsHigh())}
return lvl+1}
isLeaf(){return this.childCount==0}
getLastBranch(){if(this.isLeaf()){return null}
for(let i=0;i<this.childCount;i++){if(!this.child[i].isLeaf()){return this.child[i].getLastBranch()}}
return this}
fmt(htmlQ){htmlQ=typeof htmlQ!=='undefined'?htmlQ:true
let s=''
if(this.typ==this.tOP){switch(this.op.toLowerCase()){case 'add':s='+'
break
case 'sub':s=htmlQ?'\u2212':'-'
break
case 'mult':s=htmlQ?'\u00d7':'x'
break
case 'div':s=htmlQ?'\u00f7':'/'
break
case 'pow':s='^'
break
default:s=this.op}}
if(this.typ==this.tREAL){s=this.r.toString()}
if(this.typ==this.tVAR){if(this.r==1){s=this.v}else{if(this.r!=0){s=this.r+this.v}}}
if(this.typ==this.tFUNC){s=this.op}
return s}
walkFmt(){let s=this.walkFmta(true,'')
s=s.replace('Infinity','Undefined')
return s}
walkFmta(noparq,prevop){let s=''
if(this.childCount>0){let parq=false
if(this.op=='add')parq=true
if(this.op=='sub')parq=true
if(prevop=='div')parq=true
if(noparq)parq=false
if(this.typ==this.tFUNC)parq=true
if(this.typ==this.tOP){}else{s+=this.fmt(true)}
if(parq)s+='('
for(let i=0;i<this.childCount;i++){if(this.typ==this.tOP&&i>0)s+=this.fmt()
s+=this.child[i].walkFmta(false,this.op)
if(this.typ==this.tFUNC||(parq&&i>0)){s+=')'}}}else{s+=this.fmt()
if(prevop=='sin'||prevop=='cos'||prevop=='tan'){if(this.radiansQ){s+=' rad'}else{s+='\u00b0'}}}
return s}
walkNodesFmt(level){let s=''
for(let i=0;i<level;i++){s+='|   '}
s+=this.fmt()
s+=','+this.typ
s+=','+this.op
s+=','+this.v
s+=','+this.r.toFixed()
s+='\n'
for(let i=0;i<this.childCount;i++){s+=this.child[i].walkNodesFmt(level+1)}
return s}
walk(vals){let val
if(this.typ==this.tREAL){return this.r}
if(this.typ==this.tVAR){switch(this.v){case 'x':return vals[23]
case 'y':return vals[24]
case 'z':return vals[25]
case 'pi':return new Decimal(my.pi)
case 'e':return new Decimal(my.e)
case 'a':return vals[0]
case 'n':return vals[13]
default:return new Decimal('0')}}
if(this.typ==this.tOP){for(let i=0;i<this.childCount;i++){let val2=new Decimal('0')
if(this.child[i]!=null)val2=this.child[i].walk(vals)
if(i==0){val=val2}else{switch(this.op){case 'add':val=val.add(val2)
break
case 'sub':val=val.sub(val2)
break
case 'mult':val=val.mul(val2)
break
case 'div':val=val.div(val2,100)
break
case 'pow':val=val.pow(val2)
break
default:}}}
return val}
if(this.typ==this.tFUNC){let lhs=this.child[0].walk(vals)
switch(this.op){case 'sqrt':return lhs.sqrt()
case 'sin':return this.radiansQ?lhs.sin():degRound(lhs.mul(my.degToRad).sin())
case 'cos':return this.radiansQ?lhs.cos():degRound(lhs.mul(my.degToRad).cos())
case 'tan':return this.radiansQ?lhs.tan():degRound(lhs.mul(my.degToRad).tan())
case 'asin':return this.radiansQ?lhs.asin():lhs.asin().mul(my.radToDeg)
case 'acos':return this.radiansQ?lhs.acos():lhs.acos().mul(my.radToDeg)
case 'atan':return this.radiansQ?lhs.atan():lhs.atan().mul(my.radToDeg)
case 'sinh':return lhs.sinh()
case 'cosh':return lhs.cosh()
case 'tanh':return lhs.tanh()
case 'eksp':return lhs.exp()
case 'ln':return lhs.ln()
case 'abs':return lhs.abs()
case 'sign':if(lhs.isNegative())return new Decimal('-1')
if(lhs.isZero())return new Decimal('0')
return new Decimal('1')
case 'round':return lhs.round()
case 'floor':return lhs.floor()
case 'ceil':return lhs.ceil()
case 'fact':return factorial(lhs)}}
return NaN}}
function factorial(n){if(n<0)return NaN
if(n<2)return new Decimal(1)
n=n<<0
let i=n
let f=new Decimal(n)
while(i-->2){f=f.mul(i)}
return f}
function degRound(num){if(num.abs().lt('1e-'+(my.decN+2)))return new Decimal('0')
return num}
function isNumeric(n){return!isNaN(parseFloat(n))&&isFinite(n)}
function optGet(name){let val=localStorage.getItem(`calc.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`calc.${name}`,val)
my.opts[name]=val}
function rpLog(id){let now=performance.now()
if(my.timeStt==undefined){my.timeStt=performance.now()
my.timePrev=performance.now()}
console.log(''+id+': '+parseInt(now-my.timeStt)+'ms => '+parseInt(now-my.timePrev)+'ms')
my.timePrev=now}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
s+={btn:()=>{if(cls.length==0)cls='btn'
return '<button onclick="'+fn+'"'},can:()=>'<canvas',div:()=>'<div',inp:()=>{if(cls.length==0)cls='input'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<input value="'+txt+'"'
s+=fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''
return s},rad:()=>{if(cls.length==0)cls='radio'
return '<form'+(fn.length>0)?(s+=' onclick="'+fn+'"'):''},sel:()=>{if(cls.length==0)cls='select'
return '<select onchange="'+fn+'"'+(lbl.length>0)?'<label class="label">'+lbl+' ':''},sld:()=>'<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"',}[tag]()||''
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
s+={btn:()=>'>'+txt+'</button>',can:()=>'></canvas>',div:()=>' >'+txt+'</div>',inp:()=>'>'+(lbl.length>0?'</label>':''),rad:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let chk=''
if(i==0)chk='checked'
s+='<input type="radio" id="r'+i+'" name="typ" style="cursor:pointer;" value="'+opts[i][0]+'" '+chk+' />\n'
s+='<label for="r'+i+'" style="cursor:pointer;">'+opts[i][1]+'</label><br/>\n'}
s+='</form>'
return s},sel:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let opt=opts[i]
let idStr=id+i
let chkStr=i==99?' checked ':''
s+='<option id="'+idStr+'" value="'+opt.name+'"'+chkStr+'>'+opt.descr+'</option>\n'}
s+='</select>'
if(lbl.length>0)s+='</label>'
return s},sld:()=>'>',}[tag]()||''
s+='\n'
return s.trim()}
my.pi='3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789'
my.e='2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274274663919320030599218174135966290435729003342952605956307381323286279434907632338298807531952510190115738341879307021540891499348841675092447614606680822648001684774118537423454424371075390777449920695517027618386062613313845830007520449338265602976067371132007093287091274437470472306969772093101416928368190255151086574637721112523897844250569536967707854499699679468644549059879316368892300987931277361782154249992295763514822082698951936680331825288693984964651058209392398294887933203625094431173012381970684161403970198376793206832823764648042953118023287825098194558153017567173613320698112509961818815930416903515988885193458072738667385894228792284998920868058257492796104841984443634632449684875602336248270419786232090021609902353043699418491463140934317381436405462531520961836908887070167683964243781405927145635490613031072085103837505101157477041718986106873969655212671546889570350354'
init()