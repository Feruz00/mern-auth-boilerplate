
const token = ()=>{
    const s = "qwertyuiopasdfghklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890[]{}()+-";
    let tk = "";
    for(let i=0;i<50;i++) tk += s[ Math.floor( Math.random() * s.length ) ];
    return tk;
}

module.exports = token