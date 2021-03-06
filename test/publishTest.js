var assert = require('chai').assert;
var helper = require('./testHelper');

describe('publish', function(){

    var boss;

    before(function(finished){
        helper.start()
            .then(dabauce => {
                boss = dabauce;
                finished();
            });
    });

    after(function(finished){
        boss.stop().then(() => finished());
    });

    it('should fail with no arguments', function(finished) {
        boss.publish().catch(error => {
            assert(true);
            finished();
        });
    });

    it('should fail with a function for data', function(finished) {
        boss.publish('job', () => true).catch(error => {
            assert(true);
            finished();
        });
    });

    it('should fail with a function for options', function(finished) {
        boss.publish('job', 'data', () => true).catch(error => {
            assert(true);
            finished();
        });
    });

    it('should accept single string argument', function(finished) {
        var jobName = 'publishNameOnly';

        boss.subscribe(jobName, (job, done) => {
            done().then(() => {
                assert(true);
                finished();
            });
        });

        boss.publish(jobName);
    });


    it('should accept job object argument with only name', function(finished){
        var jobName = 'publishJobNameOnly';

        boss.subscribe(jobName, (job, done) => {
            done().then(() => {
                assert(true);
                finished();
            });
        });

        boss.publish({name: jobName});
    });

    
    it('should accept job object with name and data only', function(finished){
        var jobName = 'publishJobNameAndData';
        var message = 'hi';

        boss.subscribe(jobName, (job, done) => {
            done().then(() => {
                assert.equal(message, job.data.message);
                finished();
            });
        });

        boss.publish({name: jobName, data: {message}});
    });


    it('should accept job object with name and options only', function(finished){
        var jobName = 'publishJobNameAndOptions';
        var options = {someCrazyOption:'whatever'};

        boss.subscribe(jobName, (job, done) => {
            done().then(() => {
                assert.isNull(job.data);
                finished();
            });
        });

        boss.publish({name: jobName, options});
    });

});



