!function(e){"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?e(require("knockout"),exports):"function"==typeof define&&define.amd?define(["knockout","exports"],e):e(ko,ko.mapping={})}(function(e,t){function i(e,t){for(var i={},n=e.length-1;n>=0;--n)i[e[n]]=e[n];for(var n=t.length-1;n>=0;--n)i[t[n]]=t[n];var o=[];for(var a in i)o.push(i[a]);return o}function n(e,o){var a;for(var r in o)if(o.hasOwnProperty(r)&&o[r])if(a=t.getType(e[r]),r&&e[r]&&"array"!==a&&"string"!==a)n(e[r],o[r]);else{var s="array"===t.getType(e[r])&&"array"===t.getType(o[r]);e[r]=s?i(e[r],o[r]):o[r]}}function o(e,t){var i={};return n(i,e),n(i,t),i}function a(e,t){for(var i=o({},e),n=k.length-1;n>=0;n--){var a=k[n];i[a]&&(i[""]instanceof Object||(i[""]={}),i[""][a]=i[a],delete i[a])}return t&&(i.ignore=r(t.ignore,i.ignore),i.include=r(t.include,i.include),i.copy=r(t.copy,i.copy),i.observe=r(t.observe,i.observe)),i.ignore=r(i.ignore,T.ignore),i.include=r(i.include,T.include),i.copy=r(i.copy,T.copy),i.observe=r(i.observe,T.observe),i.mappedProperties=i.mappedProperties||{},i.copiedProperties=i.copiedProperties||{},i}function r(i,n){return"array"!==t.getType(i)&&(i="undefined"===t.getType(i)?[]:[i]),"array"!==t.getType(n)&&(n="undefined"===t.getType(n)?[]:[n]),e.utils.arrayGetDistinctValues(i.concat(n))}function s(t,i){var n=e.dependentObservable;e.dependentObservable=function(i,n,o){o=o||{},i&&"object"==typeof i&&(o=i);var a=o.deferEvaluation,r=!1,s=function(i){var n=e.dependentObservable;e.dependentObservable=x;var o=e.isWriteableObservable(i);e.dependentObservable=n;var a=x({read:function(){return r||(e.utils.arrayRemoveItem(t,i),r=!0),i.apply(i,arguments)},write:o&&function(e){return i(e)},deferEvaluation:!0});return w&&(a._wrapper=!0),a.__DO=i,a};o.deferEvaluation=!0;var l=new x(i,n,o);return a||(l=s(l),t.push(l)),l},e.dependentObservable.fn=x.fn,e.computed=e.dependentObservable;var o=i();return e.dependentObservable=n,e.computed=e.dependentObservable,o}function l(i,n,a,r,u,g,m){var v="array"===t.getType(e.utils.unwrapObservable(n));if(g=g||"",t.isMapped(i)){var w=e.utils.unwrapObservable(i)[A];a=o(w,a)}var x={data:n,parent:m||u},C=function(){return a[r]&&a[r].create instanceof Function},k=function(t){return s(y,function(){return e.utils.unwrapObservable(u)instanceof Array?a[r].create({data:t||x.data,parent:x.parent,skip:E}):a[r].create({data:t||x.data,parent:x.parent})})},S=function(){return a[r]&&a[r].update instanceof Function},T=function(t,i){var n={data:i||x.data,parent:x.parent,target:e.utils.unwrapObservable(t)};return e.isWriteableObservable(t)&&(n.observable=t),a[r].update(n)},j=b.get(n);if(j)return j;if(r=r||"",v){var _=[],I=!1,F=function(e){return e};a[r]&&a[r].key&&(F=a[r].key,I=!0),e.isObservable(i)||(i=e.observableArray([]),i.mappedRemove=function(e){var t="function"==typeof e?e:function(t){return t===F(e)};return i.remove(function(e){return t(F(e))})},i.mappedRemoveAll=function(t){var n=p(t,F);return i.remove(function(t){return-1!=e.utils.arrayIndexOf(n,F(t))})},i.mappedDestroy=function(e){var t="function"==typeof e?e:function(t){return t===F(e)};return i.destroy(function(e){return t(F(e))})},i.mappedDestroyAll=function(t){var n=p(t,F);return i.destroy(function(t){return-1!=e.utils.arrayIndexOf(n,F(t))})},i.mappedIndexOf=function(t){var n=p(i(),F),o=F(t);return e.utils.arrayIndexOf(n,o)},i.mappedGet=function(e){return i()[i.mappedIndexOf(e)]},i.mappedCreate=function(t){if(-1!==i.mappedIndexOf(t))throw new Error("There already is an object with the key that you specified.");var n=C()?k(t):t;if(S()){var o=T(n,t);e.isWriteableObservable(n)?n(o):n=o}return i.push(n),n});var L=p(e.utils.unwrapObservable(i),F).sort(),$=p(n,F);I&&$.sort();var P,M,R=e.utils.compareArrays(L,$),B={},O=e.utils.unwrapObservable(n),D={},N=!0;for(P=0,M=O.length;M>P;P++){var Q=F(O[P]);if(void 0===Q||Q instanceof Object){N=!1;break}D[Q]=O[P]}var H=[],U=0;for(P=0,M=R.length;M>P;P++){var W,Q=R[P],q=g+"["+P+"]";switch(Q.status){case"added":var G=N?D[Q.value]:d(e.utils.unwrapObservable(n),Q.value,F);W=l(void 0,G,a,r,i,q,u),C()||(W=e.utils.unwrapObservable(W));var z=c(e.utils.unwrapObservable(n),G,B);W===E?U++:H[z-U]=W,B[z]=!0;break;case"retained":var G=N?D[Q.value]:d(e.utils.unwrapObservable(n),Q.value,F);W=d(i,Q.value,F),l(W,G,a,r,i,q,u);var z=c(e.utils.unwrapObservable(n),G,B);H[z]=W,B[z]=!0;break;case"deleted":W=d(i,Q.value,F)}_.push({event:Q.status,item:W})}i(H),a[r]&&a[r].arrayChanged&&e.utils.arrayForEach(_,function(e){a[r].arrayChanged(e.event,e.item)})}else if(f(n)){if(i=e.utils.unwrapObservable(i),!i){if(C()){var Y=k();return S()&&(Y=T(Y)),Y}if(S())return T(Y);i={}}if(S()&&(i=T(i)),b.save(n,i),S())return i;h(n,function(t){var o=g.length?g+"."+t:t;if(-1==e.utils.arrayIndexOf(a.ignore,o)){if(-1!=e.utils.arrayIndexOf(a.copy,o))return i[t]=n[t],void 0;if("object"!=typeof n[t]&&"array"!=typeof n[t]&&a.observe.length>0&&-1==e.utils.arrayIndexOf(a.observe,o))return i[t]=n[t],a.copiedProperties[o]=!0,void 0;var r=b.get(n[t]),s=l(i[t],n[t],a,t,i,o,i),c=r||s;if(a.observe.length>0&&-1==e.utils.arrayIndexOf(a.observe,o))return i[t]=c(),a.copiedProperties[o]=!0,void 0;e.isWriteableObservable(i[t])?(c=e.utils.unwrapObservable(c),i[t]()!==c&&i[t](c)):(c=void 0===i[t]?c:e.utils.unwrapObservable(c),i[t]=c),a.mappedProperties[o]=!0}})}else switch(t.getType(n)){case"function":S()?e.isWriteableObservable(n)?(n(T(n)),i=n):i=T(n):i=n;break;default:if(e.isWriteableObservable(i)){if(S()){var V=T(i);return i(V),V}var V=e.utils.unwrapObservable(n);return i(V),V}var J=C()||S();if(i=C()?k():e.observable(e.utils.unwrapObservable(n)),S()&&i(T(i)),J)return i}return i}function c(e,t,i){for(var n=0,o=e.length;o>n;n++)if(i[n]!==!0&&e[n]===t)return n;return null}function u(i,n){var o;return n&&(o=n(i)),"undefined"===t.getType(o)&&(o=i),e.utils.unwrapObservable(o)}function d(t,i,n){t=e.utils.unwrapObservable(t);for(var o=0,a=t.length;a>o;o++){var r=t[o];if(u(r,n)===i)return r}throw new Error("When calling ko.update*, the key '"+i+"' was not found!")}function p(t,i){return e.utils.arrayMap(e.utils.unwrapObservable(t),function(e){return i?u(e,i):e})}function h(e,i){if("array"===t.getType(e))for(var n=0;n<e.length;n++)i(n);else for(var o in e)i(o)}function f(e){var i=t.getType(e);return("object"===i||"array"===i)&&null!==e}function g(e,i,n){var o=e||"";return"array"===t.getType(i)?e&&(o+="["+n+"]"):(e&&(o+="."),o+=n),o}function m(){var t=[],i=[];this.save=function(n,o){var a=e.utils.arrayIndexOf(t,n);a>=0?i[a]=o:(t.push(n),i.push(o))},this.get=function(n){var o=e.utils.arrayIndexOf(t,n),a=o>=0?i[o]:void 0;return a}}function v(){var e={},t=function(t){var i;try{i=t}catch(n){i="$$$"}var o=e[i];return void 0===o&&(o=new m,e[i]=o),o};this.save=function(e,i){t(e).save(e,i)},this.get=function(e){return t(e).get(e)}}var y,b,w=!0,A="__ko_mapping__",x=e.dependentObservable,C=0,k=["create","update","key","arrayChanged"],E={},S={include:["_destroy"],ignore:[],copy:[],observe:[]},T=S;t.isMapped=function(t){var i=e.utils.unwrapObservable(t);return i&&i[A]},t.fromJS=function(e){if(0==arguments.length)throw new Error("When calling ko.fromJS, pass the object you want to convert.");try{C++||(y=[],b=new v);var t,i;2==arguments.length&&(arguments[1][A]?i=arguments[1]:t=arguments[1]),3==arguments.length&&(t=arguments[1],i=arguments[2]),i&&(t=o(t,i[A])),t=a(t);var n=l(i,e,t);if(i&&(n=i),!--C)for(;y.length;){var r=y.pop();r&&(r(),r.__DO.throttleEvaluation=r.throttleEvaluation)}return n[A]=o(n[A],t),n}catch(s){throw C=0,s}},t.fromJSON=function(i){var n=e.utils.parseJson(i);return arguments[0]=n,t.fromJS.apply(this,arguments)},t.updateFromJS=function(){throw new Error("ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!")},t.updateFromJSON=function(){throw new Error("ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!")},t.toJS=function(i,n){if(T||t.resetDefaultOptions(),0==arguments.length)throw new Error("When calling ko.mapping.toJS, pass the object you want to convert.");if("array"!==t.getType(T.ignore))throw new Error("ko.mapping.defaultOptions().ignore should be an array.");if("array"!==t.getType(T.include))throw new Error("ko.mapping.defaultOptions().include should be an array.");if("array"!==t.getType(T.copy))throw new Error("ko.mapping.defaultOptions().copy should be an array.");return n=a(n,i[A]),t.visitModel(i,function(t){return e.utils.unwrapObservable(t)},n)},t.toJSON=function(i,n){var o=t.toJS(i,n);return e.utils.stringifyJson(o)},t.defaultOptions=function(){return arguments.length>0?(T=arguments[0],void 0):T},t.resetDefaultOptions=function(){T={include:S.include.slice(0),ignore:S.ignore.slice(0),copy:S.copy.slice(0)}},t.getType=function(e){if(e&&"object"==typeof e){if(e.constructor===Date)return"date";if(e.constructor===Array)return"array"}return typeof e},t.visitModel=function(i,n,o){o=o||{},o.visitedObjects=o.visitedObjects||new v;var r,s=e.utils.unwrapObservable(i);if(!f(s))return n(i,o.parentName);o=a(o,s[A]),n(i,o.parentName),r="array"===t.getType(s)?[]:{},o.visitedObjects.save(i,r);var l=o.parentName;return h(s,function(i){if(!o.ignore||-1==e.utils.arrayIndexOf(o.ignore,i)){var a=s[i];if(o.parentName=g(l,s,i),-1!==e.utils.arrayIndexOf(o.copy,i)||-1!==e.utils.arrayIndexOf(o.include,i)||!s[A]||!s[A].mappedProperties||s[A].mappedProperties[i]||!s[A].copiedProperties||s[A].copiedProperties[i]||"array"===t.getType(s))switch(t.getType(e.utils.unwrapObservable(a))){case"object":case"array":case"undefined":var c=o.visitedObjects.get(a);r[i]="undefined"!==t.getType(c)?c:t.visitModel(a,n,o);break;default:r[i]=n(a,o.parentName)}}}),r}});