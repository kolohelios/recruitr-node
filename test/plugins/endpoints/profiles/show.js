// // it('should get one specific profile and info', function(done){
// //   server.inject({method: 'GET', url: '/profiles/a00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}}, function(response){
// //     expect(response.statusCode).to.equal(200);
// //     expect(response.result[0].firstName).to.equal('Evan');
// //     expect(response.result[0].photo).to.equal('http://www.yahoo.com');
// //     expect(response.result[0].lastName).to.equal('Gatchell');
// //     expect(response.result[0].createdAt).to.be.ok;
// //     expect(response.result[0].skills).to.have.length(3);
// //     expect(response.result[0].exposure).to.have.length(3);
// //     expect(response.result[0].bio).to.equal('Developer B');
// //     expect(response.result[0].location).to.equal('Fremont, CA');
// //     expect(response.result[0].interests).to.have.length(3);
// //     expect(response.result[0].remote).to.equal(true);
// //     expect(response.result[0].relocate).to.equal(true);
// //     expect(response.result[0].locationPref).to.have.length(3);
// //     expect(response.result[0].education).to.have.length(3);
// //     expect(response.result[0].contact.email).to.equal('test2@test.com');
// //     expect(response.result[0].contact.phone).to.equal('510-345-1234');
// //     expect(response.result[0].contact.address).to.equal('345 Main St, Fremont, CA 94555');
// //     expect(response.result[0].social.github).to.equal('https://github.com/greygatch');
// //     expect(response.result[0].social.facebook).to.equal('BookFace3');
// //     expect(response.result[0].social.twitter).to.equal('https://twitter.com/greygatch');
// //     expect(response.result[0].social.linkedIn).to.equal('https://www.linkedin.com/in/greygatch');
// //     expect(response.result[0].social.stackoverflow).to.equal('http://stackoverflow.com/users/4750158/greygatch');
// //     done();
// //   });
// // });
// it('should throw an error', function(done){
//   var stub = Sinon.stub(Profile, 'findOne').yields(new Error());
//   server.inject({method: 'GET', url: '/profiles/a00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}}, function(response){
//     expect(response.statusCode).to.equal(400);
//     stub.restore();
//     done();
//   });
// });
