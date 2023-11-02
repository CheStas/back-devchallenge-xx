## Running the app

```bash
docker-compose up --build
```

## Test

```bash
docker build -t api-test --target test . && docker run api-test
```

### Next steps to make the service better
- To avoid blocking the event loop, move all calculations to a separate process (use worker threads). The main process should be used only for receiving requests, retrieving data from the database, sending a task to a worker, and sending responses to clients.

- It's possible to make all calculations more precise using BigInt, but calculations would be much slower. Therefore, it should be discussed and implemented only if it's necessary, and a loss of performance is acceptable.

- Try to convert input to a number first (e.g., "01" should be "1"), following the same approach as Excel does.

- It's possible to improve performance by looping through dependent cells fewer times and performing all necessary tasks in a single method.

- Refactor the upsert method in the sheet service; the Chain of Responsibility pattern may be a good fit for it.

- It's possible to improve performance by implementing caching mechanisms for calculated method.

- Implement error handling and logging mechanisms to capture and report errors for debugging and troubleshooting.