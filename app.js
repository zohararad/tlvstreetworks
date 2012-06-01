var express = require('express')
    , jsdom = require('jsdom')
    , app = express.createServer()
;

var raw_reports = [];

var address_seperator = /מ|עד/;
jsdom.env(
    "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js",
    ['http://code.jquery.com/jquery-1.5.min.js'],
    function(errors, window) {
        $("tr", ".ms-listviewtable").each(function(index, Element) {
            if (index == 0) return;
            var tds = Element.find("td");
            var address_parts = tds.eq(2).text().split(address_seperator);
            var obj ={
                road:tds.eq(0).text(),
                cause:tds.eq(1).text(),
                from:address_parts[1],
                to:address_parts[2],
                time_frame:tds.eq(3).text(),
                from_date:tds.eq(4).text(),
                to_date:tds.eq(5).text()
            }
        });
    }
);


app.get('api/', function(request) {
    response.writeHead(200, {'content-type': 'text/json'});
    response.write(JSON.stringify(raw_reports));
    response.end('\n');
});


app.listen(80);