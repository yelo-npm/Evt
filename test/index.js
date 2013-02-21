var Evt = require('../index');
var expect = require('chai').expect
describe('Evt',function(){
	it('Should create three methods on an object',function(){
		var a = {};
		Evt(a);
		expect(a).to.have.property('on');
		expect(a).to.have.property('off');
		expect(a).to.have.property('trigger');
	});
	it('Should not replace a property if it already exists',function(){
		var a = {on:'exists'};
		Evt(a);
		expect(a).to.have.property('on');
		expect(a.on).to.be.equal('exists');
	});
	it('Should allow to change styles',function(){
		var a = {};
		Evt(a,Evt.EVENT_EMITTER);
		expect(a).to.have.property('bind');
		expect(a).to.have.property('unbind');
		expect(a).to.have.property('trigger');
	})
	it('Should allow to change styles globally',function(){
		var a = {};
		Evt.style = Evt.DOM;
		Evt(a);
		expect(a).to.have.property('addEventListener');
		expect(a).to.have.property('removeEventListener');
		expect(a).to.have.property('dispatchEvent');
	})
	it('Should allow to add styles',function(){
		Evt.styles.special = ['addEvent','removeEvent','fireEvent'];
		Evt.SPECIAL = 'special';
		Evt.style = Evt.SPECIAL;
		var a = {};
		Evt(a);
		expect(a).to.have.property('addEvent');
		expect(a).to.have.property('removeEvent');
		expect(a).to.have.property('fireEvent');
		Evt.style = Evt.SIMPLE;
		Evt(Array,true);
	})
	it('Should return the passed object',function(){
		var a = {};
		var b = Evt(a);
		expect(a).to.be.equal(b);
	})
	it('Should return a simple emitter if called with no arguments',function(){
		var a = Evt();
		expect(a).to.have.property('on');
		expect(a).to.have.property('off');
		expect(a).to.have.property('trigger');	
	})
	it('Should be able to work on the prototype of an object',function(){
		var a = [];
		expect(a).to.have.property('on');
		expect(a).to.have.property('off');
		expect(a).to.have.property('trigger');
	})
	it('Should allow to listen and trigger events',function(done){
		var a = Evt();
		a.on('someEvent',function(){done();})
		a.trigger('someEvent');
	})
	it('Should allow to remove events',function(){
		var a = Evt();
		var fn = function(){}
		a.on('someEvent',fn);
		a.off('someEvent',fn);
		expect(a._events['someEvent'].length).to.be.equal(0);
	})
	it('Should allow to add multiple events',function(done){
		var a = Evt();
		var b = 0;
		var c = function(){
			b++;
		}
		a.on('someEvent',c,c,c,c,function(){
			expect(b).to.be.equal(4);
			done();
		});
		a.trigger('someEvent');
	})
	it('Should allow to listen to all events by passing the star "*" event',function(done){
		var a = Evt();
		a.on('*',function(){done();})
		a.on('someOtherEvent',function(){});
		a.trigger('someOtherEvent');
	})
	it('Should allow to listen to all events if no event name is passed',function(done){
		var a = Evt();
		a.on(function(){done();})
		a.on('someOtherEvent',function(){});
		a.trigger('someOtherEvent');
	})
	it('Should pass arguments',function(done){
		var a = Evt();
		a.on('someEvent',function(){
			expect(arguments.length).to.be.equal(4);
			done();
		});
		a.trigger('someEvent','a','b','c');
	})
	it('Should allow to trigger an object event as long as this object has a "type" property',function(done){
		var a = Evt();
		var e = {
			type:'someEvent'
		,	trigger:'someObject'
		,	someProperty:'yup'
		}
		var props = {}
		a.on('someEvent',function(evt,properties){
			expect(evt).to.be.equal(e);
			expect(properties).to.be.equal(props);
			done();
		});
		a.trigger(e,props);
	})
	it('Should set the context of the callback to the object triggering the event',function(done){
		var a = Evt();
		a.on('someEvent',function(){
			expect(this).to.be.equal(a);
			done();
		});
		a.trigger('someEvent');
	})
})