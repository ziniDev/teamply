export function divisionArray (arr, n) {        
    const len = arr.length;
    const cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
    let tmp = []; 
    for (var i = 0; i < cnt; i++) {
        tmp.push(arr.splice(0, n));
    }
    return tmp;
}