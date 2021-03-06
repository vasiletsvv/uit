import should from "should";
import { define, run, event } from "./main";
import helper from "./test.helper";

describe("Main", () => {
  it("run should work", done => {
    define("test", [], ctx => {
      ctx.version = 1;
    });
    const el = new Element(undefined, []);
    window.location.search = "?test";
    run(el).then(blockInstances => {
      blockInstances[0].version.should.be.equal(1);
      done();
    });
  });

  it("define should work", done => {
    event.on("test.load", block => {
      block.view.should.be.equal("<div></div>");
      done();
    });
    define("test", []);
  });
});
