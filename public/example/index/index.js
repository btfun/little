
// const foo = Object.freeze({});
// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
// foo.prop = 123;

//将对象彻底冻结的函数
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, value) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};

//解构赋值
var [a, b, c] = [1, 2, 3];
console.log(a, b, c)
let [foo, [[bar], baz]] = [1, [[2], 3]];
console.log(foo, bar, baz)
let [head, ...tail] = [1, 2, 3, 4];
console.log(head, tail)
let [x, y, z] = new Set(["a", "b", "c"]);
console.log(x, y, z)
let se = new Set(["a", "b", "c"]);
console.log(se)
//对象的解构赋值
var { foo1, bar1 } = { foo1: "aaa", bar1: "bbb" };
console.log(foo1, bar1)

console.log("\u{20BB7}","\u20BB7")
for (let codePoint of 'fo4526o') {
  console.log(codePoint)
}
//repeat方法返回一个新字符串，表示将原字符串重复n次。参数如果是小数，会被取整。 参数是负数或者Infinity，会报错。
'x'.repeat(3)
//反引号拼接 模板字符串中嵌入变量，需要将变量名写在${}之中。
var second=1231231231;
var str=`dsa
<ul>
<li>first</li>
<li>${second} </li>
</ul>
  `.trim();

console.log(str)

//模板字符串甚至还能嵌套。
const tmpl = addrs => `
  <table>
  ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
  </table>
`;
const data = [
    { first: '<Jane>', last: 'Bond' },
    { first: 'Lars', last: '<Croft>' },
];

console.log(tmpl(data));
console.log(2**3);
//为对象添加属性
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}
//为对象添加方法
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
   
  },
  anotherMethod() {

  }
});

// 等同于下面的写法
SomeClass.prototype.someMethod = function (arg1, arg2) {

};
SomeClass.prototype.anotherMethod = function () {

};
