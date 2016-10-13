var expect = require("chai").expect;

var createServer = require(__dirname + "/../resources/webdav-server.js"),
    getAdapter = require(__dirname + "/../../source/adapter/get.js");

var SERVER_URL = "http://localhost:9999";

describe("adapter:get", function() {

    beforeEach(function(done) {
        this.server = createServer();
        this.server.start().then(done);
    });

    afterEach(function(done) {
        this.server.stop().then(done);
    });

    describe("getDirectoryContents", function() {

        it("gets all objects in directory", function() {
            return getAdapter
                .getDirectoryContents(SERVER_URL, "/")
                .then(function(contents) {
                    expect(contents.length).to.equal(2);
                });
        });

        it("gets objects in correct form", function() {
            return getAdapter
                .getDirectoryContents(SERVER_URL, "/")
                .then(function(contents) {
                    contents.forEach(function(item) {
                        expect(item.filename.length).to.be.above(0);
                        expect(item.basename.length).to.be.above(0);
                        expect(item.filename.indexOf(item.basename)).to.be.above(-1);
                        var type = item.type;
                        expect(["file", "directory"]).to.contain(type);
                        if (type === "file") {
                            expect(item.size).to.be.above(0);
                            expect(item.mime.length).to.be.above(0);
                        } else if (type === "directory") {
                            expect(item.size).to.equal(0);
                        }
                    });
                });
        });

    });

    describe("getFileContents", function() {

        it("gets contents of a remote file", function() {
            return getAdapter
                .getFileContents(SERVER_URL, "/gem.png")
                .then(function(contents) {
                    expect(contents.length).to.equal(279);
                    expect(contents instanceof Buffer).to.be.true;
                });
        });

    });

    describe("getStat", function() {

        it("stats files", function() {
            return getAdapter
                .getStat(SERVER_URL, "/test.txt")
                .then(function(stat) {
                    console.log(stat);
                });
        });

    });

    describe("getTextContents", function() {

        it("gets contents of a remote file", function() {
            return getAdapter
                .getTextContents(SERVER_URL, "/test.txt")
                .then(function(contents) {
                    var numLines = contents.trim().split("\n").length;
                    expect(numLines).to.equal(3);
                });
        });

    });

});
