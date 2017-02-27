# ucheck
a smart express req.body validator

#Install
Install the library with npm install ucheck

```
var uCheck = require('ucheck');

app.use(Ucheck.init);

```

#Basic Usage

```javascript

var x = [

        {
            param: 'username',
            label: 'Username',
            required: true,
            type: 'string',
            length: { min: 3 , max: 16},
            regex: /^[a-z0-9_-]{3,16}$/
        },{
            param: 'password',
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


#Validationg Options 

* param [string]: the name of the param in req.body
* label [string]: how the param will appear in error messages 
* required [Boolean]: check the presence of the param
* type [string] (string|number|boolean|array|object): check the type of param
* length [object {min:number, max: number}]: check the length of the param 
* regex [regex]: test the param aganist regex

#Methods

* hasError: return boolean
* getErrors: returns error array 

