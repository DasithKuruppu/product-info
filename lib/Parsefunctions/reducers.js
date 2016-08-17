var checkword=require('check-word');
var defaultmapper=JSON.parse(JSON.stringify(require('../Tagfinder/mapper')));
var words=checkword('en');
var tabletojson=require('tabletojson')



module.exports={
    isDictionaryWord:function(word){
        return words.check(word)
    },
    pipeline:function(attributenodelist){
        var finalproduct={
            Price:{
                Text:null,
                Value:null,
                Currency:null
            },
            Specs:[]
        };
        for (var attribute in attributenodelist){
            var currentnodedata=attributenodelist[attribute];
            switch (attribute){
                case 'SKU':
                    if(currentnodedata.length>=1){
                        var filteredsku=currentnodedata.filter(function(sku){
                            return words.check(sku.text.toLowerCase().trim())
                        })
                        if(filteredlist.length > 0){
                            finalproduct.SKU=filteredlist[0].text;

                        }else{
                            finalproduct.SKU=null;
                        }

                    }

                  
                    break;
                case 'Title': 
                    if(currentnodedata.length==1){
                        finalproduct.Title=currentnodedata[0].text;
                    }
                    if(currentnodedata.length>1){
                        finalproduct.Title=currentnodedata[0].text;
                    }
                    if(!currentnodedata){
                        finalproduct.Title=null;
                    }
                    break;
                
                case 'Price':
                    if (currentnodedata.length >= 1) {
                        var validatorcurrency=new RegExp(defaultmapper.Price.pattern,'i');
                        validatorcurrency=validatorcurrency.exec(currentnodedata[0].text);
                        if(validatorcurrency){
                            finalproduct.Price.Text = validatorcurrency[0].trim();
                            finalproduct.Price.Value = validatorcurrency[3];
                            finalproduct.Price.Currency = validatorcurrency[2];
                        }
                       
                        
                        
                    }
                  
                    if (!currentnodedata) {
                        finalproduct.Price = null
                    }
                    break;
                
                 case 'Images':
                    if (currentnodedata.length >= 1) {
           
                        finalproduct.Images = currentnodedata.map(function(rootnode){
                            return {url:rootnode.node.attribs.src,description:rootnode.node.attribs.alt}
                        });
                    }
              
                    if (!currentnodedata) {
                        finalproduct.Images = null
                    }
                    break;
                case 'Category':
                    if (currentnodedata.length>=1){
                        finalproduct.Category=currentnodedata.map(function(breadcrumb,Index){
                           return {
                                Index:Index,
                                Name:breadcrumb.text
                            }
                        });
                    }
                    break;
                case 'Warrenty':
                    if (currentnodedata.length==1){
                        finalproduct.Warrenty=currentnodedata.text;
                    }
                    if (currentnodedata.length>1){
                         var validatorwarrenty=new RegExp(defaultmapper.Warrenty.pattern,'i');
                        finalproduct.Warrenty=currentnodedata.filter(function(Warrenty,index){
                             var validwarrenty =validatorwarrenty.exec(Warrenty.text);
                             if (validwarrenty){
                                 var warrentytext = validwarrenty[2] + ' ' + validwarrenty[4];
                                 return ["3 months", "6 months","12 months", "1 year", "2 years","3 years","4 years","5 years","10 years"].indexOf(warrentytext)!=-1
                                     
                                  
                             }
                           
                        })
                    }
                    break;
                case 'Availability':
                    if (currentnodedata.length==1){
                        availability=currentnodedata[0].node.children.filter(function(child){
                            return child.name=='img' && child.type=='tag';
                        }).map(function(nodedata){
                            var url =nodedata.attribs.src.trim().replace(/[\n\t\f]/g,'');
                            if(url=="http://www.gadgetsonline.co.nz/images/tick-icon.png"){
                                return true
                            }
                        })

                        if(availability && availability[0]){
                            finalproduct.Availability=true
                        }
                        
                    }
                   
                break;
                case "Specs":
                    if(currentnodedata.length>=1){
                        var filteredlist=currentnodedata.filter(function(componentinfo){
                            var ismatch= (componentinfo.text.match(/specs|specifications?|descriptions?|features?|info/ig) || []).length>0

                            if(ismatch){
                               if(finalproduct.Specs && Array.isArray(finalproduct.Specs) && componentinfo.node.name =="table"){
                                   var table=tabletojson.convert("<table>"+componentinfo.html+"</table>");
                                   finalproduct.Specs.push(table[0]);
                               }
                            }
                        });
                   
                        
                    }

            }
        }

        return finalproduct;
    }
}