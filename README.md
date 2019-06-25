## Utilities
Some utilities functions.

### Conversion
- `parseJSON(str)`
instead of `JSON.parse()`, this function will not throw an exception when the argument is not correct.
```
// as before
let ob;
try {
  ob = JSON.parse(someStr);
}
catch(e) {
  // do something.
}

// with parseJSON
let ob = parseJSON(someStr);
ob && doSomething(ob);

// examples:
parseJSON('{"name": "phusis"}'); // {name: "phusis"}
parseJSON('hello, world'); // null
```

- `camelToHyphenate(varName)`/`camelToUnderscore(varName)`/`hyphenateToCamel(varName)`/`hyphenateToUnderscore(varName)`/`underscoreToCamel(varName)`/`underscoreToHyphenate(varName)`
```
camelToHyphenate('itIsAVaribleName'); // it-is-a-varible-name
camelToUnderscore('itIsAVaribleName'); // it_is_a_varible_name
hyphenateToCamel('it-is-a-varible-name'); //itIsAVaribleName
hyphenateToUnderscore('it-is-a-varible-name'); // it_is_a_varible_name
underscoreToCamel('it_is_a_varible_name'); // itIsAVaribleName
underscoreToHyphenate('it_is_a_varible_name'); // it-is-a-varible-name
```

- `num2en(num)`/`num2cn(num, bool)`
```
num2en(11865438357); // eleven billion, eight hundred and sixty-five million, four hundred and thirty-eight thousand, three hundred and fifty-seven
num2cn(11865438357); // 一百一十八亿六千五百四十三万八千三百五十七
num2cn(11865438357, true) // 壹佰壹拾捌亿陆仟伍佰肆拾叁万捌仟叁佰伍拾柒

num2en(563.1113); // five hundred and sixty-three point one one one three
num2cn(563.1113); // 五百六十三点一一一三
num2cn(563.1113, true); // 伍佰陆拾叁点壹壹壹叁
```

- `list2Tree(list, opts)`
```
const menus = [
  { id: '101', name: 'system', parent_id: '' },
  { id: '102', name: 'shutdown', parent_id: '101' },
  { id: '103', name: 'logout', parent_id: '101' },
  { id: '104', name: 'register', parent_id: '101' },
  { id: '105', name: 'work', parent_id: null },
  { id: '106', name: 'calendar', parent_id: '105' },
  { id: '107', name: 'events', parent_id: '105' },
  { id: '108', name: 'conference', parent_id: '107' },
  { id: '109', name: 'meetings', parent_id: '107' },
  { id: '110', name: 'talk', parent_id: '107' },
  { id: '111', name: 'native', parent_id: '110' },
  { id: '112', name: 'onboard', parent_id: '110' },
  { id: '113', name: 'about' }
];
const tree = list2Tree(menus);
// [
//   {
//     "id": "113",
//     "name": "about",
//     "children": [],
//   },
//   {
//     "id": "105",
//     "name": "work",
//     "parent_id": null,
//     "children": [
//       {
//         "id": "107",
//         "name": "events",
//         "parent_id": "105",
//         "children": [
//           {
//             "id": "110",
//             "name": "talk",
//             "parent_id": "107",
//             "children": [
//               {
//                 "id": "112",
//                 "name": "onboard",
//                 "parent_id": "110",
//               },
//               {
//                 "id": "111",
//                 "name": "native",
//                 "parent_id": "110",
//               },
//             ],
//           },
//           {
//             "id": "109",
//             "name": "meetings",
//             "parent_id": "107",
//           },
//           {
//             "id": "108",
//             "name": "conference",
//             "parent_id": "107",
//           },
//         ],
//       },
//       {
//         "id": "106",
//         "name": "calendar",
//         "parent_id": "105",
//       },
//     ],
//   },
//   {
//     "children": [
//       {
//         "id": "104",
//         "name": "register",
//         "parent_id": "101",
//       },
//       {
//         "id": "103",
//         "name": "logout",
//         "parent_id": "101",
//       },
//       {
//         "id": "102",
//         "name": "shutdown",
//         "parent_id": "101",
//       },
//     ],
//     "id": "101",
//     "name": "system",
//     "parent_id": "",
//   },
// ]


// you can also customize the opts for specified field name in the list for convertion.
list2Tree(menu, {
  id: 'menu_id',
  parent: 'parent_menu_id',
  children: 'sub_menus',
});
// 
// it will result in:
[
  { menu_id: '101', name: 'system' },
  { menu_id: '102', name: 'shutdown', parent_menu_id: '101' }
]
// to 
[
  {
    menu_id: '101',
    name: 'system',
    sub_menus: [
      { 
        menu_id: '102', 
        name: 'shutdown', 
        parent_menu_id: '101',
      }
    ]
  }
]
```

### Crypto

### Factory

### Polyfill

### System
