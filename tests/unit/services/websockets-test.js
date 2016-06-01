import MockServerB from 'mock-socket/server';
import { moduleFor, test } from 'ember-qunit';

const { keys } = Object;

moduleFor('service:websockets', 'Unit | Service | Websocket', {
  unit: true
});

test('that the service has no connections to start', function(assert) {
  const service = this.subject();

  debugger;

  assert.expect(1);
  assert.deepEqual(service.get('sockets'), {});
});

test('that calling socketFor will correctly create a connection', function(assert) {
  const service = this.subject();
  const server = new MockServer('ws://example.com:7000/');

  service.socketFor('ws://example.com:7000');

  assert.expect(2);
  assert.equal(keys(service.get('sockets')).length, 1);
  assert.equal(keys(service.get('sockets'))[0], 'ws://examplecom:7000/');
});

test('that calling socketFor will correctly cache a connection', function(assert) {
  const service = this.subject();
  const server = new MockServer('ws://example.com:7000/');
  const referenceA = service.socketFor('ws://example.com:7000');
  const referenceB = service.socketFor('ws://example.com:7000');

  assert.expect(1);
  assert.deepEqual(referenceA, referenceB);
});

test('that calling socketFor with different urls creates the correct connections', function(assert) {
  const service = this.subject();
  const serverA = new MockServer('ws://example.com:7000/');
  const serverB = new MockServer('ws://example.com:7001/');
  const referenceA = service.socketFor('ws://example.com:7000');
  const referenceB = service.socketFor('ws://example.com:7001');

  assert.expect(2);
  assert.equal(keys(service.get('sockets')).length, 2);
  assert.notDeepEqual(referenceA, referenceB);
});

test('that on(open) and on(close) work correctly', function(assert) {
  const service = this.subject();
  const server = new MockServer('ws://example.com:7000/');
  server.start();

  const socket = service.socketFor('ws://example.com:7000');


  const mock = {
    openHandler() {
      assert.ok(true);
      service.closeSocketFor('ws://example.com:7000');
    },

    closeHandler() {
      assert.ok(true);
      server.stop();
      done();
    }
  };

  const done = assert.async();
  assert.expect(2);

  socket.on('open', mock.openHandler, mock);
  socket.on('close', mock.closeHandler, mock);
});
