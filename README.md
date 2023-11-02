## Description

**We all know there is no better software in the world than Excel**   
The powerful idea behind the cells and formulas allows many of us to understand programming.   
Today is your time to pay respect to spreadsheets and implement backend API for this fantastic tool.

# Description of input data

As a user, I want to have API service with exact endpoints:

1. **POST /api/v1/:sheet_id/:cell_id accept params {“value”: “1”} implements UPSERT strategy (update or insert) for both sheet_id and cell_id**
   1. 201 if the value is OK
   2. 422 if the value is not OK e.g. new value leads to dependent formula ERROR compilation  
      Examples:
   - POST /api/v1/devchallenge-xx/var1 with {“value:”: “0”}  
      Response: {“value:”: “0”, “result”: “0”}
   - POST /api/v1/devchallenge-xx/var1 with {“value:”: “1”}  
      Response: {“value:”: “1”, “result”: “1”}
   - POST /api/v1/devchallenge-xx/var2 with {“value”: “2”}   
      Response: {“value:”: “2”, “result”: “2”}
   - POST /api/v1/devchallenge-xx/var3 with {“value”: “=var1+var2”}  
      Response: {“value”: “=var1+var2”, “result”: “3”}
   - POST /api/v1/devchallenge-xx/var4 with {“value”: “=var3+var4”}  
      Response: {“value”: “=var3+var4”, “result”: “ERROR”}
2. **GET  /api/v1/:sheet_id/:cell_id**
   1. 200 if the value present
   2. 404 if the value is missing  
      Examples:
   - GET /api/v1/devchallenge-xx/var1  
      Response: {“value”: “1”, result: “1”}
   - GET /api/v1/devchallenge-xx/var1  
      Response: {“value”: “2”, result: “2”}
   - GET /api/v1/devchallenge-xx/var3  
      Response: {“value”: “=var1+var2”, result: “3”}
3. **GET /api/v1/:sheet_id  
   **1) 200 if the sheet is present  
   2) 404 if the sheet is missing  
   Response:  
   {  
   “var1”: {“value”: “1”, “result”: “1”},  
   “var2”: {“value”: “2”, “result”: “2”},  
   “var3”: {“value”: “=var1+var2”, “result”: “3”}  
   }

# Requirements

1. Supports basic data types: string, integer, float
2. Support basic math operations like +, -, /, \* and () as well.
3. :sheet_id - should be any URL-compatible text that represents the namespace and can be generated on the client
4. :cell_id - should be any URL-compatible text that represents a cell (variable) and can be generated on the client
5. :sheet_id and :cell_id are case-insensitive
6. Be creative and cover as many corner cases as you can. Please do not forget to mention them in the README.md
7. Data should be persisted and available between docker containers restarts

# Evaluation Criteria

**Technical assessment  
**1. Result Correctness — 90 points.  
2. Following API  Format — 40 points.  
3. Performance — 80 points.

4. Code quality —  40 points.
5. Test — 80 points.
6. Corner cases — 54 points.

---

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
