function addEscape(str){
  if(str && str.includes('\'')){
    var indices = [];
    for(var i=0; i<str.length;i++) {
        if (str[i] === "\'") indices.push(i);
    }
    for(var i=0; i<indices.length;i++) {
      str = [str.slice(0, indices[i]), '\'', str.slice(indices[i])].join('');
      for(var j=i+1; j < indices.length; j++){
        indices[j]++;
      }
    }

  }
  return str;
}

module.exports = () =>{
  return{
    addEscape: addEscape.bind(null)
  }
}
