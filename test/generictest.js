scrapper=require("../index");
    var HTML = '' +
        '<html>' +
        '  <head>' +
        '  </head>' +
        '  <body>' +
        '    <h1>Green Shirt</h1>' +
        '    <h1>Blue Shirt</h1>' +
        '  </body>' +
        '</html>';
     
scrapper.parse('http://www.gadgetsonline.co.nz/gadget2680-Samsung%20Galaxy%20Note%204%20SM-N910%2032GB%20Black.html',function(err,product){
    console.dir(product);
})