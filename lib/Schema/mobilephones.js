var shortid = require('shortid');
var validator = require('validator');
var tabletojson = require('tabletojson');


var attributes = {
    id: {
        pattern: null,
        tag: null
    },
    Model: {
        pattern: null,
        tag: "body .main .specs-phone-name-title"
    },
    Brand: {
        pattern: null,
        tag: "body .main .specs-phone-name-title"
    },
    Name: {
        pattern: null,
        tag: "body .main .specs-phone-name-title"
    },
    Dimensions: {
        pattern: null,
        tag: null

    },
    Features: {
        pattern: null,
        tag: "body .main #specs-list table"

    },
    ReleaseDate: {
        pattern: null,
        tag: "specs-brief pattern specs-brief-accent"
    }
}



var extract = {
    id: {
        pipeline: [
            function (err, data) {
                if (!data.text || data.text.length == 0) {
                    return shortid.generate();
                }
            }
        ]
    },
    Brand: {
        pipeline: [
            function (err, data) {
                if (data.text || data.text.length > 0) {
                    return data.text.trim().split(" ")[0]; // First item of title
                }
            }
        ]
    },
    Model: {
        pipeline: [
            function (err, data) {
                if (data.text || data.text.length > 0) {
                    return data.text.trim().substring(data.text.trim().indexOf(" ")+1); // title after the first word i.e Brand
                }
            }
        ]
    },
    Name: {
        pipeline: [
            function (err, data) {
                if (data.text || data.text.length > 0) {
                    return data.text.trim();
                }
            }
        ]
    },
    Features: {
        pipeline: [
            function (err, data) {
                var jsontable = {}
                if (data.node) {

                    switch (data.node.name) {
                        case 'table':
                            return tabletojson.convert(data.html)
                    }
                }
            }
        ]
    },
    ReleaseDate: {
        pipeline: [
            function (err, data) {
                if (data.node) {
                    return validator.toDate(data.text.trim().substring(0, data.text.trim().indexOf(" ")));
                }
            }
        ]
    }

}

module.exports = {
    product: attributes,
    extract: extract
}