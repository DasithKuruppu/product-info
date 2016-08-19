'use strict';


var schemamobile=require('./Schema/mobilephones.js');
var cheerio   = require('cheerio')
// Parsing generic websites with a best guess approach
module.exports.parse = function(html,schema, callback) {


  var $ = cheerio.load(html),
      product = {};

  // If all else fails return null
  var tagmatches={};
 var  custommap=schema;
  if (custommap) {
    for (var customattrib in custommap) {
    
      if(custommap[customattrib].tag){
        $(custommap[customattrib].tag).filter(function (index, element) {
          var tagtext = $(this).text().replace(/[\n\f\t]/g, '').trim();
          var validate = new RegExp(custommap[customattrib].pattern || '[\s\S]*', 'i');
          var valid = true;
          if (custommap[customattrib].validate) {
            if (validate.test(tagtext)) {
              var x = validate.exec(tagtext);
              tagtext = x[0];
              valid = true;
            } else {
              valid = false;
            }

          }
          if (Array.isArray(tagmatches[customattrib]) & valid) {

            tagmatches[customattrib].push({ node: element, text: tagtext, html: $(element).html() });

          } else if (valid) {
            tagmatches[customattrib] = [{ node: element, text: tagtext, html: $(element).html() }];
          }
        });
      }
     
    }
    //if custom mappin is available delete generic mapping for which custom mapping is available;
  }

  var product={}

  for (var attribute in tagmatches) {

    tagmatches[attribute].forEach(function (taginfo, index) {

      var extractfunc = schemamobile.extract[attribute]
      if (extractfunc) {
        var funcerror = null;
        var parsedata = null;
        extractfunc.pipeline.forEach(function (parsefunc, funindex) {
           var prevdata=parsedata;
           parsedata=parsefunc(funcerror, taginfo, parsedata);
           if(!parsedata){ // if null return err
             funcerror={
               message:"Returned null undefined value",
               detail:{
                 index:funindex,
                 data:prevdata
               }
             }
           }
           if(extractfunc.pipeline.length==funindex){
             product[attribute]=parsedata;
           }
        });
      }

    })
  }
  
  var genericerr=null;
  for(var attribute in product){
      if(custommap[attribute].required){
        if(!product[attribute]){
          if(!genericerr){
            genericerr = {
              message: "required attributes missing",
              detail: [{
                attribute: attribute
              }]
            }
          }else{
            genericerr.detail.push({attribute:attribute})
          }
         
        }
      }
  }
  
  

  if(!genericerr) {
    callback(null, product);
  }else{
    callback({message:"Not enough data to extract product or invalid product page",detail:genericerr})
  }
  
  // DESCRIPTION
  // TODO look for similar content based off of name

  

};
