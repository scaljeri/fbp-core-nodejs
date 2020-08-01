import { IFbpNodeWorkerStatic, FbpNodeManager } from '@scaljeri/fbp-core';
import * as path from 'path';
const DEFAULT_WORKER_NAME = '/worker.js';

import { NodeJsAsyncNodeRunner } from './nodejs-async-node-runner';


export function setWorkerPath(workerPath: string): void {
	NodeJsAsyncNodeRunner.workerPath = path.extname(workerPath) === '.js' ? workerPath : path.join(workerPath, DEFAULT_WORKER_NAME);
}

export function setNodePaths(paths: Record<string, string>): void {
	for (const key in paths) {
		NodeJsAsyncNodeRunner.nodePaths[key] = paths[key];
	}
}

export function setNodeJSContext(): void {
	FbpNodeManager.asyncNode = NodeJsAsyncNodeRunner as IFbpNodeWorkerStatic;
	setWorkerPath('/');
}

setNodeJSContext();

export * from '@scaljeri/fbp-core';
