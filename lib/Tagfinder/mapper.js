module.exports={
    'SKU':{
        tags:['a','span','label','b'],
        'pattern':'^[\\d\\w]{8,20}$'
    },
    'Title':{
        tags:['title','h1','h2','h3','h4','h5','b','span','label','a'],
        pattern:'^([\\w\\d"-]+[\\s|-|_]?){1,10}$'
    },
    'Price':{
        tags:['span','b','label','li','a','p'],
        pattern:'(([$£])\\s?([0-9]+.{0,1}[0-9]{0,2}))'
    },
    'Availability':{
        tags:['span','b','label','li','a','p'],
        pattern:null
    },
    'Quantity':{
        tags:['label','span','li','b','p'],
        pattern:'^\d+$'
    },
    'Specs':{
        'tags':['table','ul'],
        pattern:null
    },
    'Images':{
        tags:['img','href'],
        pattern:null
    },
    'Category':{
        'tags':['a','div','p'],
        pattern:null
    },
    'Warrenty':{
        'tags':['a','span','b','label','td','tr','th'],
        'pattern':'((\\d+)(\\s|_|-)?(days?|months?|years?))'
    }

}