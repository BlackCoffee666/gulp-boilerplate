export default class Main {
  constructor() {
    let color, elements = $('h1');

    setInterval(() => {
      color = this.getRandomHexColor();
      elements.css({ color });
    }, 1000);
  }
  getRandomHexColor() {
    return '#' + (function co(lor){   return (lor +=
    [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
    && (lor.length == 6) ?  lor : co(lor); })('');
  }
}

