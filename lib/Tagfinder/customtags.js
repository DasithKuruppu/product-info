module.exports={
    "Title":{
        tag:"#description-info h1"
    },
    "Price":{
        tag:"#description-info .redtext.dprice",
        validate:true
    },
    "Availability":{
        tag:"#description-info .bluetext.avail",
        conditions:[]
    },
    "Quantity":{
        tag:null
    },
    "Images":{
        tag:"#description-images-holder a img",
    },
    "Category":{
        tag:".breadcrumb p a"
    },
    "Warrenty":{
        tag:"#description-info p",
        validate:true
    }
}