import { Worker } from 'worker_threads';
import * as path from 'path';

import { IFbpNode, IFbpWorkerToNodePacket, AsyncNodeRunner } from '@scaljeri/fbp-core';

export class NodeJsAsyncNodeRunner extends AsyncNodeRunner {
	static workerPath: string;
	static nodePaths: Record<string, string> = {};

	nodeState!: IFbpNode;

	private worker!: Worker;

	async init(nodeState: IFbpNode<unknown>): Promise<void> {
		this.nodeState = nodeState;

		return new Promise((resolve) => {
			const workerData = {
				state: nodeState,
				file: NodeJsAsyncNodeRunner.getNodePath(nodeState.type!)
			};

			this.worker = new Worker(NodeJsAsyncNodeRunner.workerPath, { workerData });

			this.worker.on('message', d => this.packet(d));
			this.worker.on('error', (err) => this.error(err));
			this.worker.on('exit', (code) => this.exit(code));
		});
	}

	send(packet: IFbpWorkerToNodePacket): void {
		this.worker.postMessage(packet);
	}

	private static getNodePath(type: string): string {
		return NodeJsAsyncNodeRunner.nodePaths[type] || 
			path.join(NodeJsAsyncNodeRunner.nodePaths._, `${type}/${type}.js`);
	}
// 	private outputs = {};
// 	private inputs: Record<string, Subscription> = {};

// 	private isAsync!: boolean;
// 	private node!: any;

// 	constructor() {
// 		const workerData = { nodePath: `${nodeBasePath}/${state.type}.js` };
// 		const worker = new Worker(workerName, { workerData });
// 	}

// 	go(state: IFbpNode, node: IFbpNodeWorker, worker: string, nodeBasePath: string) {
// 		this.isAsync = state.async || false;

// 		if (state.async) {
// 			// setup(state, worker!, nodeBasePath);
// 		} else {
// 			this.node = new (node as any) as IFbpNodeWorker;
// 		}
// 	}

// 	addInStream(connection: IFbpConnection, stream$: Observable<any>): void {
// 		this.inputs[connection.id] = stream$.subscribe(val => {
// 			if (this.isAsync) {

// 			} else {
// 				// this.node.
// 			}
// 		});
// 	}

// 	addOutStream(connection: IFbpConnection, subject: Subject<any>): void {

// 	}

// 	removeInStream(connection: IFbpConnection): void {
// 		this.inputs[connection.id].unsubscribe();
// 		delete this.inputs[connection.id];
// 	}

// 	removeOutStream(connection: IFbpConnection): void {

// 	}
// }

// export function go(
// 	state: IFbpNode,
// 	node: IFbpNodeWorker, 
// 	worker?: string, 
// 	nodeBasePath?: string): IFbpNodeWorker {
// 	if (state.async) {
// 		setup(state, worker!, nodeBasePath);
// 	} else {
// 		return new node();
// 	}
// }

// function setup(state: IFbpNode, workerName: string, nodeBasePath: string): IFbpNodeWorker {
// 	const workerData = { nodePath: `${nodeBasePath}/${state.type}.js` };
// 	const worker = new Worker(workerName, { workerData });

// 	const x: WorkerOptions;

// 	return {
// 		init(state: IFbpNode, updateState: IFbpWorkerStateUpdate<T>): void;
// 	inputStream(input: IFbpWorkerDataIN): void;
// 	outputStream(output: IFbpWorkerDataOut): void;
// 	connectToInSocket(connection: IFbpConnection): void;
// 	connectToOutSocket(connection: IFbpConnection): void;
// 	disconnectIn(connection: IFbpConnection): void;
// 	disconnectOut(connection: IFbpConnection): void;
// 	stop(): void;
// 	pause(): void;
// 	resume(): void;
// 	}
}


// let worker;

// function runService(workerData) {
// 	return new Promise((resolve, reject) => {
// 		worker = new Worker('./worker.js', { workerData });
// 		worker.on('message', d => {
// 			if (d.state === 'ready') {
// 				console.log('ready=' + d)
// 				worker.postMessage({ state: 'data', value: 20 });
// 			} else if (d.state === 'data') {
// 				console.log('data = ' + d.value);
// 			}

// 		});

// 		worker.on('error', reject);
// 		worker.on('exit', (code) => {
// 			if (code !== 0)
// 				reject(new Error(`Worker stopped with exit code ${code}`));
// 		})
// 	})
// }

// const data = { state: 'init', value: 10 };

// runService(data);

// interface PersonConstructor {
// 	new(): PersonInterface;
// }
// interface PersonInterface {
// 	greet(name: string): void;
// }
// const createPerson = (ctor: PersonConstructor, name: string, age: number): PersonInterface => {
// 	return new ctor();
// }
// class Person implements PersonInterface {
// 	constructor() {
// 	}
// 	greet(name: string) {
// 		console.log(`Hello `)
// 	}
// }
// let person = createPerson(Person as PersonInterface, 'Jane', 20);
// console.log(person);