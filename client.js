
function remoteSend(contents,level)
{
  let cache = [];
  let args = JSON.stringify(contents,function(key,value){
    if (typeof value === 'object' && value !== null){
      let typeName = Object.getPrototypeOf(value).constructor.name;
      if (!['Object','Array'].includes(typeName)){
//        console.log(typeName);
        let keys = Object.keys(Object.getPrototypeOf(value));
        let newValue = JSON.parse(JSON.stringify(value));
        keys.map(key => {
          newValue[key] = value[key];
        });
        return newValue;
      }
      let index = cache.indexOf(value);
      if (index !== -1){
        // Circular reference found, discard key
        return '[cycle]'+index;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });

  $.ajax({
    method: 'POST',
    url: debugLogConfig.url+debugLogConfig.route,
    data: {
      data: args,
      level: level
    },
    success: (res) => {
    }
  })

}

function remoteLog(){
  remoteSend(Array.from(arguments),'log');
}

function remoteError(){
  remoteSend(Array.from(arguments),'error');
}

