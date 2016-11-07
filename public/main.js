const clearRequest=function() //sends request to the server
      {
        $("#todoList").html(""); //set container to empty string
      }
      const appendButton=function(data)
      {
        data.items.forEach(function (todoItem) //data is object, contains array items and each of them will be placed in todoitem
         {
              
               let li_item=$("<li >"+todoItem.message+ //then create a new variable concatenate elements
               '<input type="checkbox" id='+todoItem.id+
               ' onclick=updateTodo(this.id)> </input>'+' <button id='+
               todoItem.id+' onclick=deleteTodo(this.id)>Delete</button>'
               +"</li>");


               li_item.find("input").prop("checked",todoItem.completed); //then find each input and if checked , in li true or false
               $("#todoList").append(li_item);
        });

      }
      //This requests the todo items on page load
      const drawRequests=function() //calls this function in 1st time
      {
        clearRequest(); //another function, go up
        $.ajax( //ajax with object, request will be sent to todos.
        {
        url: "/todos",
        type: "get",
        dataType: "JSON", 
        data: { "default-post":"Loading the page" }, //sent to the server with this parameter
        contentType: "utf-8",//using utf8
        success: function(data)// calls the function, with the response data
        {
          appendButton(data); //IF THERE Is data then pass to appendbutton function
        },
          error: function(e) //if no data , then call error function
          {
            console.log("UUPS");
            alert("UUPS");
          }});
        };
drawRequests();
      const updateTodo=function(todoItem)// todos put ,draws new data we have
      {
        $.ajax({
              url         : "/todos/" + todoItem,
              type        : 'put',
              success     : function() {
                drawRequests();
              }
              });
      };

        const deleteTodo =function(itemID)//delete function, event listener
        {
            $.ajax({
                url     : "/todos/" + itemID,
                type    : 'delete',
                success : function(data) {
                  drawRequests();//now call this drawrequests to display new data
                },
                error   : function(data) {
                    alert('Error deleting the item');//nothing to delete
                }
            });
        };


      $("#addBtn").on("click",function() //2nd, now we are adding even listeners for each button, we have two buttons
      {// with our addbutton on click event listener, we take value and set it to constant,down->

        const val = $('#addTodoTxt').val();
        if(val=="")return;
        $('#addTodoTxt').val(''); // clear the textbox--------

        $.ajax({//now ajax, parameters
            url         : "/todos",
            type        : 'post',
            dataType    : 'json',
            data        : JSON.stringify({
                message   : val,//it is value from text field
                completed : false//this is by default
            }),
            contentType : "application/json; charset=utf-8",
            success     : function(data) {
              drawRequests();//again call drawRequests function for new data
                // refresh the list (re-run the search query)-------
            },
            error       : function(data) {
                alert('Error creating todo');
            }
        });
      });

      //Search for the todo items on click
    $("#searchBtn").on("click",function(e)
    {

          $.ajax(
            {
            url: "/todos",
            type: "get",
            dataType: "JSON",
            data: { "searchtext":$("#searchTxt").val() },// as a new data search text value
            contentType: "application/x-www-form-urlencoded;utf-8",
            success: function(recieved_data)
            {
              clearRequest(); //clearing other writings
              appendButton(recieved_data);//once data is here we are adding it to the page, lets go up update todo function
            },
              error: function(e)
              {

                alert("UUPS");
              }

           });
    });