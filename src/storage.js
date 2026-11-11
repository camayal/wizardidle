// Wizard Idle v2 - persistence helpers, unchanged from v1 for now.
// Every value is stored in localStorage with its key and value encoded by thx() (base-36 char codes).
// Phase 2 replaces all of this with a single plain-JSON save object.

import { roundNumbertoLetter } from './utils.js';

export function thx(str){
    str = str.toString();
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hx = Number(str.charCodeAt(n)).toString(36);
		arr1.push(hx);
	 }
	return arr1.join('');
   }

export function hx(str1){
	var hx  = str1;
	var str = '';
	for (var n = 0; n < hx.length; n += 2) {
		str += String.fromCharCode(parseInt(hx.substr(n, 2), 36));
	}
	return str;
 }

export function getLocal(str){
    return hx(localStorage[thx(str)]);
 }

export function setLocal(str,value){
    return localStorage[thx(str)] = thx(value);
 }

export function idx(idx, number = 1){
    if(!localStorage[thx("idx_" + idx)]){
        setLocal("idx_" + idx, number);
    }else{
        setLocal("idx_" + idx, Number(getLocal("idx_" + idx)) + number);
    }
    return getLocal("idx_" + idx);
}

export function check(variable){
    //return eval(variable) ? roundNumbertoLetter(eval(variable)) : 0;
    return localStorage.getItem(thx(variable)) ? roundNumbertoLetter(Number(hx(localStorage.getItem(thx(variable))))) : 0;
}
