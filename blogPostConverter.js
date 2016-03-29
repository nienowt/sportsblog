var bigStr = 'Pancetta bresaola meatball, bacon rump sausage pork chop pig short loin jerky. Boudin sirloin alcatra, t-bone rump chicken pork. Boudin drumstick shank beef turducken leberkas ribeye meatloaf short ribs "fatback cow pork" hamburger pig landjaeger. Doner rump cupim, meatloaf bresaola pork turducken porchetta ham hock strip steak salami tri-tip sausage frankfurter pig. T-bone landjaeger doner, pastrami sirloin andouille jowl ball tip cupim prosciutto ribeye porchetta beef ribs meatball brisket.more bacon and ish paraagraph 2 check one two Paragraph 2 please!'

var obj = {text: bigStr};

JSON.stringify(obj);

String.prototype.replaceAt=function(index, character) {
  return this.substr(0, index) + character + this.substr(index+character.length);
};

function convert(string) {
  for (var i = 0; i < string.length; i++) {
    if (string.charAt(i) === '"') {
      string = string.replaceAt(i, '\\"')
      console.log('we hit a quotation');
    }
  }
  console.log(string);
}

//http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
