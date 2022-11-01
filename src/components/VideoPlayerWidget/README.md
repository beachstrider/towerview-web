https://github.com/heejunghwang/aws-kinesis-video-stream-example

{
	"name": "aws-sdk-test",
	"version": "0.0.4",
	"description": "",
	"author": "",
	"license": "MIT",
	"scripts": {
		"dash": "npx ts-node src/dash.ts",
		"hls": "npx ts-node src/hls.ts"
	},
	"dependencies": {
		"axios": "0.18.0",
		"aws-sdk": "2.687.0",
		"uuid": "^3.3.3",
		"dotenv": "8.2.0"
	},
	"devDependencies": {
		"@types/node": "^14.6.2",
		"ts-loader": "^6.2.1",
		"ts-node": "^5.0.0",
		"tsc-watch": "^1.0.16",
		"tsconfig-paths": "^3.9.0",
		"tslint": "^5.20.0",
		"tslint-eslint-rules": "^5.4.0",
		"typescript": "3.7.5",
		"@types/axios": "^0.14.0",
		"form-data": "^3.0.0"
	}
}
