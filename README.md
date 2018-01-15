# ucheck
a smart express req.body validator

#Install
Install the library with npm install ucheck

```
var uCheck = require('ucheck');

```

#Basic Usage

```javascript

var x = [

        {
            param: 'person.username',
            label: 'Username',
            required: true,
            type: 'string',
            length: { min: 3 , max: 16},
            regex: /^[a-z0-9_-]{3,16}$/
        },{
            param: 'person.password',
            label: 'Password',
            required: true,
            type: 'string',
            length: { min:6, max: 20},
            regex: /^[a-z0-9_-]{6,20}$/
        },{
            param: 'teamname',
            label: 'Team Name',
            required: true,
            type: 'string',
            length: {min: 3, max: 16},
            regex: /^[a-z0-9_-]{3,16}$/
        },{
            param: 'teamsecret',
            label: 'Team Secret',
            required: true,
            type: 'string',
            length: {min: 15, max: 30},
            regex: /^[a-z0-9_-]{15,30}$/
        }
]


//create instance and pass the array x to be validated
let ucheck = new uCheck.validate(req).scenario(x);

//returns true if there were any validation errors
if(ucheck.hasErrors()){
    
    //returns human readable error messages
    res.status(400).send({error: ucheck.getErrors()});
    return false;

} else {
    //validation is OK! 
    //do something
}
```

example of a returned error array

```
[
   {
      "msg":"invalid format",
      "param":"person.username",
      "label":"Username"
   },
   {
      "msg":"invalid format",
      "param":"person.password",
      "label":"Password"
   },
   {
      "msg":"invalid format",
      "param":"teamsecret",
      "label":"Team Secret"
   },
   {
      "msg":"invalid length 8 to 12 characters required",
      "param":"username",
      "label":"Username"
   },
   {
      "msg":"invalid length 7 to 15 characters required",
      "param":"teamsecret",
      "label":"Team Secret"
   }
]

```

#Validationg Options 


* param {string}: the name of the param in req.body
```

//pass the name of the param in req.body
{
    param: 'name'
}

//nested objects can be reached using 
{
    param: 'person.name'
}

```

* label {string}: how the param will appear in error messages 
```

{
    param: 'teamname'
    label: 'Team Name' // will be shown in error message
}


```

* required {boolean}: check the presence of the param & will push error if not exists 
```

{
    param: "email",
    label: "Email"
    required: true // or false
}

```

* type {string}: check the type of param
```
{
    param: "companyName",
    label: "Company Name"
    type: "string" // or number|boolean|array|object
}

{
    param: "list",
    label: "Todo List"
    type: "array" // or number|boolean|string|object
}

```
* length {object} : check the length of the param 
```
{
    param: "title",
    label: "Message Title",
    length: { min:12,  max: 24} // error if value < min OR  value > max
}

```

* regex {regex}: test the param aganist regex
```
{
    param: "link",
    lable: "linkedin URL",
    regex: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
}

//can also pass string

{
    param: "link",
    lable: "linkedin URL",
    regex: "^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$"
}

```

* oneOf {[array of strings]}
```

{
    param: "gender",
    label: "Gender",
    oneOf: ["male", "female", "other"]
}

```

* canParse {[array of strings]}
```

{
    param: "money",
    label: "Cash",
    canParse: "int"
}

{
    param: "money",
    label: "Cash",
    canParse: "float"
}


```


#Methods
* validate: accepts express req object parsed with body parser
* scenario: validates the validation array and updated hasError & getErrors with results
* hasError: return boolean
* getErrors: returns error array 
* setMsgs: accepts key & value objects to override default error messages

#Use Custom Error Messages - useing setMsgs()

```
let ucheck = new uCheck.validate(req).setMsgs(

        {

            "missingParam": "خطأ لم يتم العثور",
            "invalidFormat":"无效的格式",
            "invalidLength":"invalid length",
            "missingOpts":"Missing Options"
        
        }

    ).scenario(x);


```

#Current Supported Error Keys 

* "missingParam": triggered when a param not found
* "invalidFormat" : triggered when regex fail
* "invalidLength" : when length is not correct
* "missingOpts": when options are missing
