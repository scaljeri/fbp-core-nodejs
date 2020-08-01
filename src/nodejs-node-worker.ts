import { FbpFnCallPacket, FbpWorkerToNodePacketsCmds, IFbpInputStreamArgs, IFbpNode, IFbpNodeRunner, IFbpWorkerToNodePacket } from '@scaljeri/fbp-core';
import { IFbpWorkerDataOutArgs } from '@scaljeri/fbp-core';

// worker.js
const { parentPort, workerData } = require("worker_threads");

const { file, state } = workerData as { file: string, state: IFbpNode };

const NodeWorker = require(file).default;
const node: IFbpNodeRunner = new NodeWorker();

if (node.outputStream) {
	node.outputStream((...[data, socketId, metaData]: IFbpWorkerDataOutArgs) => {
		parentPort.postMessage({
			cmd: 'data', payload: { args: [data, socketId, metaData] }
		})
	});
}

parentPort.postMessage({ cmd: 'ready' });

parentPort.on('message', (packet: IFbpWorkerToNodePacket) => {
	switch (packet.cmd) {
		case FbpWorkerToNodePacketsCmds.init:
			// TODO prep state with getters and setters
			node.init(packet.payload as IFbpNode);
			break;
		case FbpWorkerToNodePacketsCmds.inputStream:
			if (node.inputStream) {
				const args = (packet.payload as FbpFnCallPacket).args as IFbpInputStreamArgs;
				node.inputStream(...args);
			}
			break;
	}

	// if (data.state === 'data') {
	// parentPort.postMessage({ cmd: 'data', value: data.value * 2 });
	// }
});

node.init(state);
// setTimeout(() => {
	// parentPort.close();
// }, 5000);