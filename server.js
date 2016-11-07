'use strict'//processes and sends data to our client
    const http_server = require("http");
    const fs= require("fs");
    const url = require('url');
    const querystring = require('querystring');//defining modules for server, use strict-use let lets us




    let todos =[//I created array todos, to store objects, with id message and completion status
      {id:Math.random()+'',message:"1",completed:false},
      {id:Math.random()+'',message:"2",completed:false},
      {id:Math.random()+'',message:"3",completed:false}
    ];

    http_server.createServer(function(req,res)//create server function with request and responce
    {
      const parsedUrl = url.parse(req.url);
      const parsedQuery = querystring.parse(parsedUrl.query);
      const method = req.method;     


      //Serve the file to the client
      fs.readFile("./public/"+req.url,function(err,data) //we are sending request to the readfile function, so open link
      {//+function if not empty data if empty then not found
        if(err)
        {
          res.statusCode=404;
          res.end("File not found");
        }
        res.statuscode=200;
        res.end(data);
      });

      // If the requests is for todo items--------
      if(parsedUrl.pathname.indexOf("/todos")>=0)
      {
        //Execute, if the client requests the items-------
        if(method === 'GET') {
            if(req.url.indexOf('/todos') === 0) {
                res.setHeader('Content-Type', 'application/json');
                let localTodos = todos;// we create a new array
                //Filter, and send the data
                if(parsedQuery.searchtext) {
                    localTodos = localTodos.filter(function(obj) {//here we aer filtering 
                        return obj.message.indexOf(parsedQuery.searchtext) >= 0;
                    });
                }
                //If search string emtpy, send whole data
                return res.end(JSON.stringify({items : localTodos}));
            }
        }


          //Here, we create a new todo-----
            if(method === 'POST')
             {
                  if(req.url.indexOf('/todos') === 0)
                   {

                      // read the content of the message
                      let body = '';//we use body as empty container
                      req.on('data', function (chunk) {
                          body += chunk;//as data comes to chunks we use this to add it to body.
                      });
                      req.on('end', function () { //when data came we use request end event to create new item in our array
                          let jsonObj = JSON.parse(body);  // now that we have the content, convert the JSON into an object
                          jsonObj.id = Math.random() + ''; // crete an id with this
                          todos[todos.length] = jsonObj;   // store the new object into our array (our 'database')
                          //The new placeholder in the todos array
                          res.setHeader('Content-Type', 'application/json');
                          return res.end(JSON.stringify(jsonObj));//here we stringify this new object to send it to client
                      });
                      return;
                  }
            }

              if(method === 'PUT')
               {

                    if(req.url.indexOf('/todos') === 0) // for put req type we use request url and create id
                    {

                        let recieved_id =  req.url.substr(7);
                        for(let i = 0; i < todos.length; i++)// if request id is = to one of the  todos items, then
                          {
                              if(todos[i].id === recieved_id)
                                  {
                                      // here it Flips the value of the completion status, indicating that checkbox was clicked, and 202 ok                                      todos[i].completed = !(todos[i].completed);
                                      res.statusCode=200;
                                      return res.end("Fine");
                                  }
                              }
                              res.statusCode = 404;//or 404 with problem error
                              return res.end('Error');

                        return;
                    }
              }

              if(method === 'DELETE')// this is delete method
               {
                    if(req.url.indexOf('/todos/') === 0)
                     {
                        let id =  req.url.substr(7);//take request url and assign that to our id
                        for(let i = 0; i < todos.length; i++) {//if id was in one of the objects of todo array and we will remove it from our array
                            if(id === todos[i].id) {
                                todos.splice(i, 1);
                                res.statusCode = 200;
                                return res.end('Successfully removed');//when completed ok, otherwise 404 error
                              }
                        }
                        res.statusCode = 404;
                        return res.end('Data not found');
                      }
                }


    }

    }).listen(4242);