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
     
scrapper.parse('http://www.gadgetsonline.co.nz/gadget3657-Motorola%20Moto%20G4%20Plus%2016GB%20Dual%20Sim%20-%20Black.html',function(err,product){
    console.dir(product);
})