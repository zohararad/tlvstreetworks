var express = require('express')
    , Resource = require('express-resource')
    , util = require('util')
    , api = require('../api')
    , resources = require('../mongoose_resource')
    , cache = require('../cache')
    , app = express.createServer()
    , jsdom = require('jsdom')
;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/api_db');

// create mongoose model
var Report = mongoose.model('user', new Schema({
    road:String,
    cause:String,
    from:String,
    to:String,
    time_frame:Number,
    from_date:Number,
    to_date:Number
}));

// create api with path
var rest_api = new api.Api('/api/', app);


var MemoryCache = function () {
    this.mem = {};
};
util.inherits(MemoryCache, cache.Cache);


MemoryCache.prototype.get = function (key, callback) {
    callback(null, this.mem[key]);
};


MemoryCache.prototype.set = function (key, value, callback) {
    this.mem[key] = value;
    callback();
};


function extend(sup, constructor)
{
    util.inherits(constructor, sup);
    return constructor;
}

var raw_reports = [];
// create mongoose-resource for User model
var ReportResource = extend(resources.MongooseResource, function () {
    ReportResource.super_.call(this, Report);
    this.fields = ['username', 'index', 'id'];
    this.default_query = function (query) {
        return raw_reports;
    };
    this.filtering = {'index':0};
    this.cache = new MemoryCache();
});

var address_seperator = /מ|עד/;
jsdom.env(
    "http://www.tel-aviv.gov.il/Tolive/Transportation/Pages/CrossRoads.aspx?tm=2&sm=3&side=11",
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
    });


// register resource to api
rest_api.register_resource('reports', new ReportResource());


app.listen(80);