module.exports={
    "Title":{
        tag:"#description-info h1",
        required:true
    },
    "Price":{
        tag:"#description-info .redtext.dprice",
        validate:true,
        required:true
    },
    "Availability":{
        tag:"#description-info .bluetext.avail",
        required:true,
    },
    "Quantity":{
        tag:null
    },
    "Images":{
        tag:"#description-images-holder a img",
        required:true,
    },
    "Category":{
        tag:".breadcrumb p a",
        required:true
    },
    "Warrenty":{
        tag:"#description-info p",
        validate:true
    }
}