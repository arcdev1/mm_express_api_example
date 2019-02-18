# Live Code Walkthrough - Designing a clean RESTful API with Node.js (Express + Mongo)

Watch the companion video at: https://www.youtube.com/watch?v=fy6-LSE_zjI

## Prerequisites
- Node.js
- Mongo DB
- Git

## Getting started
Follow these steps at the command line:

### 1. Clone and Install 
```bash
git clone https://github.com/arcdev1/mm_express_api_example.git
cd mm_express_api_example
npm install
```

### 2. Start Mongo
```bash
mongod
```

### 3. Run the solution
```bash
npm run start
```
## Troubleshooting
To get the unique email error to work like in the video, you need to add a unique constraint on the email field in MongoDB as described at: https://docs.mongodb.com/manual/core/index-unique/
