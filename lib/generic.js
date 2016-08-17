'use strict';
var mapper=require('./Tagfinder/mapper');
var custommap=require('./Tagfinder/customtags');
var parser=require('./Parsefunctions/reducers');
var cheerio   = require('cheerio'),
    // Our naming ids and tags, this should later be dynamic and adapt to correct
    // choices later on
    nameSelectors = ['#productTitle'],
    // Our "hierarchy" of importance
    hierarchy = ['h1','h2','h3','h4','h5','b','span','p','body','table','ul','tr','td','th','a','small'],
    // Mapping for currencies
    currencies = { '$': 'USD', '£': 'GBP' },
    // URL Regex
    ValidURLs = /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/;

// Parsing generic websites with a best guess approach
module.exports.parse = function(html, callback) {


  var $ = cheerio.load(html),
      product = {};

  // NAME
  // Find the name based off a set hierarchy we can use the title as a reference
  // to possibly find it easier
  var title = $('title').text();
  if (title !== null && title !== '') {
    // Strip the title of the domain name
    title = title.replace(ValidURLs,'');
    // Take everything up to the first comma
    title = title.substr(0, title.indexOf(','));
    // Check the body if there is a match if so set that
    if ($('body').html().indexOf(title) > -1) {
      product.name = title;
    }
  }
  // Only fall back on the hierarchy if the title did not work
  var defaultmap=JSON.parse(JSON.stringify(mapper));
  var mapperr=JSON.parse(JSON.stringify(mapper));
  // If all else fails return null
   var tagmatches={};
  if (product.name === undefined ) { product.name = null; }
  if (custommap) {
    for (var customattrib in custommap) {
      delete mapperr[customattrib];

      $(custommap[customattrib].tag).filter(function(index,element){
          var tagtext=$(this).text().replace(/[\n\f\t]/g,'').trim();
          var validate=new RegExp(custommap[customattrib].pattern || defaultmap[customattrib].pattern,'i');
          var valid=true;
          if(custommap[customattrib].validate){
            if(validate.test(tagtext)){
              var x = validate.exec(tagtext);
              tagtext = x[0];
              valid=true;
            }else{
              valid=false;
            }
           
          }
          if (Array.isArray(tagmatches[customattrib]) & valid) {
            
            tagmatches[customattrib].push({ node: element, text: tagtext });

          } else if(valid) {
            tagmatches[customattrib] = [{ node: element, text: tagtext }];
          }
      });
    }
    //if custom mappin is available delete generic mapping for which custom mapping is available;
  }

 

  // PRICE
  // Find price based on a set hierarchy and then just giving up and finding a $
  
  hierarchy.forEach(function(type, i){
    // match tags to attributes listed
    var t=type;
    $(type).filter(function(index, element){  
      for (var productattribute in mapperr){
          var pattern=mapperr[productattribute].pattern;
          var tagtext=$(this).text().replace(/[\n\f\t]/g,'').trim(); // if there is a regex / pattern
          if(pattern && mapperr[productattribute].tags.indexOf(type)!=-1 && (tagtext.match(new RegExp(pattern,'i')) || []).length > 0){
            if (Array.isArray(tagmatches[productattribute])){
              tagmatches[productattribute].push({node:element,text:tagtext});
            }else{
              tagmatches[productattribute]=[{node:element,text:tagtext}];
            }

          }
          if(!pattern && mapperr[productattribute].tags.indexOf(type)!=-1){ //if no regex is defined
            if (Array.isArray(tagmatches[productattribute])) {
              tagmatches[productattribute].push({ node: element, text: tagtext,html:$(element).html() });
            } else {
              tagmatches[productattribute] = [{ node: element, text: tagtext ,html:$(element).html()}];
            }
          }
      }
      
    });
   
  });
  
  for (var attrib in tagmatches){
      if(tagmatches[attrib] && tagmatches[attrib].length > 1){
        if (attrib=='SKU'){
          tagmatches[attrib]=tagmatches[attrib].filter(function(tagdata){
            var res =!parser.isDictionaryWord(tagdata.text.toLowerCase());
            return res;
          })
        }
      }
  }
  
  var final=parser.pipeline(tagmatches);
  
  if(final.Price && final.Price.Value && final.Title && final.Availability!=undefined && final.Availability !=null) {
    callback(null, final);
  }else{
    callback({message:"Not enough data to extract product or invalid product page",detail:"parsing not possible"})
  }
  
  // DESCRIPTION
  // TODO look for similar content based off of name

  

};
