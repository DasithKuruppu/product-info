var scrapper=require("../index");
var shema =require('../lib/Schema/mobilephones');
    var HTML = '' +
        '<html>' +
        '  <head>' +
        '  </head>' +
        '  <body>' +
        '    <h1>Green Shirt</h1>' +
        '    <h1>Blue Shirt</h1>' +
        '  </body>' +
        '</html>';
var x=shema.product;
     
scrapper.parse('http://www.gsmarena.com/lenovo_vibe_c2-8193.php',shema.product,function(err,product){
    console.dir(product);
})