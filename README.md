# Typedy

Typedy is a tiny typescript client for DynamoDB. 

### Usage

Add configuration to use the client. 

Configuration is an object to handle all the possible options to use DynamoDB

```
const configuration = {
    table: "TableName", 
    idPrefix: "Tbl", 
    options: { apiVersion: '2012-08-10' }
}
```
*All entities need to extend Schema type to automatically create id, createdAt and updatedAt fields.*

Use the client class to handle transaction operations. 

The operations are already created:

* findById
* insert
* update
* query
* delete 

Create an instance of client class to call operations.

```
const client = new Client(configuration)
```

### Get the item by id

```
const item = await client.findById({id: "1233-345543-22334"})
```

### Insert an item.

```
const item = await client.insert({
    name: "Test name", 
    lastName: "Test lastname"
})
```

*The client object is going to create automatically id field when the insert transactions is done.*

### Update an item information. 

Update method is going to return all the new values with the old values in a single object 

```
const item = await client.update({
    {
    id: "1233-345543-22334",
    name: "Test name", 
    lastName: "Test lastname"
    }
})
```

### Query items

Typedy includes a minimal query dsl, it includes 5 basic operations: 

* equal
* less
* greater
* and
* or
  
```
const queryExpression = new QueryBuilder().expression(greater('createdAt', '28812882')).build();
const items = await client.query(queryExpression)
```

### Delete item by id

```
const item = await client.delete({id: "1233-345543-22334"})
```

Delete method is going to return the old values when the item is deleted. 

